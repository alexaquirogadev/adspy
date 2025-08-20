/**
 * POST /api/sounds/refresh
 * Refresca sonidos trending desde Apify y los guarda en Supabase.
 * - Solo acepta POST.
 * - Valida X-CRON-KEY.
 * - Ejecuta actor Apify y obtiene dataset.
 * - Mapea y upserta en tabla sounds_trending.
 * - Devuelve número de sonidos importados.
 * - Manejo de errores y tipado estricto.
 */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { fetchCountryTrendingAlien, fetchPreviewFromNovi, countryNameToCode } from '@/lib/apify';

export const dynamic = 'force-dynamic';

async function upsertRegionBatch(items: any[]) {
  // sounds_trending
  const { error } = await supabaseAdmin
    .from('sounds_trending')
    .upsert(items, { onConflict: 'sound_id,region' });
  if (error) throw new Error(error.message);

  // snapshots a sound_metrics (guardamos más campos útiles para tendencias y modal)
  const metrics = items.map((s: any) => ({
    sound_id: s.sound_id,
    region: s.region,
    fetched_at: s.fetched_at,
    rank: s.rank ?? null,
    video_count: s.video_count ?? null,
    title: s.title ?? null,
    author: s.author ?? null,
    preview_url: s.preview_url ?? null,
    cover_url: s.cover_url ?? null,
    duration: s.duration ?? null,
    is_commercial: typeof s.is_commerce_music === 'boolean' ? s.is_commerce_music : null,
  }));
  const { error: mErr } = await supabaseAdmin.from('sound_metrics').insert(metrics);
  if (mErr) throw new Error(mErr.message);
}

export async function handler(req: NextRequest) {
  try {
    if (req.method !== 'POST' && req.method !== 'GET') {
      return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }

    // auth del cron
    let key = req.headers.get('x-cron-key');
    const url = new URL(req.url);
    if (req.method === 'GET') key = url.searchParams.get('cronKey') || key;
    if (!key || key !== process.env.CRON_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sp = url.searchParams;
    const period = sp.get('period') || '1';
    const backfillPreview = sp.get('backfillPreview') === '1';
    let backfillCount = Number(sp.get('backfillCount') ?? 10);

    let countriesCsv = '';
    let limit = 50;

    if (req.method === 'GET') {
      countriesCsv = sp.get('countries') || sp.get('country') || '';
      if (sp.get('limit')) limit = Number(sp.get('limit'));
    } else {
    try {
      const body = await req.json();
        countriesCsv = body?.countries || body?.country || '';
        if (body?.limit) limit = Number(body.limit);
        if (body?.backfillCount != null) backfillCount = Number(body.backfillCount);
      } catch {}
    }

    if (!countriesCsv) {
      countriesCsv = 'United States, Spain, Mexico, Brazil, United Kingdom';
    }
    const countries = countriesCsv.split(',').map(s => s.trim()).filter(Boolean);

    const totals: Record<string, { upserted: number; snapshots: number }> = {};
    for (const country of countries) {
      const list = await fetchCountryTrendingAlien({ countryName: country, limit, period: (period as '1'|'7'|'30') });
      // normaliza rank continuo 1..N
      const normalized = list
        .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999))
        .map((s, i) => ({ ...s, rank: s.rank ?? i + 1, fetched_at: new Date().toISOString() }));

      await upsertRegionBatch(normalized);

      if (backfillPreview) {
        const region = countryNameToCode(country);
        for (const s of normalized.slice(0, backfillCount)) {
          try {
            const prev = await fetchPreviewFromNovi({ region, title: s.title, sortType: 'MOST USED', limit: 3 });
            if (prev?.preview_url) {
              // 1) Actualiza la fila visible (sounds_trending)
              await supabaseAdmin
                .from('sounds_trending')
                .update({
                  preview_url: prev.preview_url,
                  play_url: prev.preview_url,
                  cover_url: s.cover_url ?? prev.cover_url ?? null,
                  is_commerce_music: (prev as any).is_commerce_music ?? null,
                  user_count: prev.user_count ?? null,
                  duration: prev.duration ?? s.duration ?? null,
                })
                .eq('sound_id', s.sound_id)
                .eq('region', region);

              // 2) Inserta un snapshot enriquecido en sound_metrics
              await supabaseAdmin.from('sound_metrics').insert({
                sound_id: s.sound_id,
                region,
                fetched_at: new Date().toISOString(),
                rank: s.rank ?? null,
                video_count: s.video_count ?? null,
                title: s.title ?? null,
                author: s.author ?? null,
                preview_url: prev.preview_url ?? null,
                cover_url: s.cover_url ?? prev.cover_url ?? null,
                duration: prev.duration ?? s.duration ?? null,
                is_commercial: (prev as any).is_commerce_music ?? null,
              });
            }
          } catch {}
        }
      }

      totals[country] = { upserted: normalized.length, snapshots: normalized.length };
      console.log(`[refresh][alien] ${country} → ${normalized.length}`);
    }

    return NextResponse.json({ ok: true, source: 'alien', countries, totals });
  } catch (e: any) {
    console.error('Error en /api/sounds/refresh:', e);
    return NextResponse.json({ error: 'Error al refrescar sonidos' }, { status: 500 });
  }
}

export { handler as POST, handler as GET }; 