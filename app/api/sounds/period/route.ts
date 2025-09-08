import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Utilidad para ISO compacto (mantiene tu estilo anterior)
function toIso(date: Date) {
  return date.toISOString().slice(0, 19) + 'Z';
}

// Une datos base (rank/ids) con metadata de sounds_trending
function mergeWithMeta(base: any[], metaRows: any[], regionNorm: string) {
  const byId = new Map<string, any>();
  for (const r of metaRows) {
    const key = String(r.sound_id);
    if (!byId.has(key)) byId.set(key, r); // nos quedamos con la 1ª aparición (suficiente para UI)
  }

  return base.map((b) => {
    const m = byId.get(String(b.sound_id)) || {};
    return {
      id: String(b.sound_id || m.sound_id),
      sound_id: String(b.sound_id || m.sound_id),
      region: b.region || m.region || regionNorm,
      // rank del RPC, si no, rank de trending
      rank:
        (typeof b.best_rank === 'number' ? b.best_rank : null) ||
        (typeof b.rank === 'number' ? b.rank : null) ||
        (typeof m.rank === 'number' ? m.rank : null) ||
        null,

      // ▼▼ añadido: contador real de usos ▼▼
      user_count: m.user_count ?? null,
      // ▲▲ añadido ▲▲

      // metadata para la tarjeta y modal
      title: m.title || null,
      author: m.author || null,
      cover_url: m.cover_url || null,
      // preview: priorizamos play/preview guardados; si no, la modal hará fetch on-demand
      preview_url: m.preview_url ?? m.play_url ?? null,
      play_url: m.play_url ?? m.preview_url ?? null,
      duration: m.duration ?? null,
      language: m.language ?? null,
      create_time: m.create_time ?? null,
      tiktok_url: m.tiktok_url ?? null,
      fetched_at: m.fetched_at ?? null,
      sort_type: m.sort_type ?? null,
      is_commerce_music: m.is_commerce_music ?? null,
      // campos extra del RPC si existieran
      total_videos: b.total_videos ?? null,
      best_rank: typeof b.best_rank === 'number' ? b.best_rank : null,
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const regionQ = (searchParams.get('region') || 'ALL').toUpperCase();
    const range = (searchParams.get('range') || 'day').toLowerCase();
    const limit = Math.max(1, Math.min(200, Number(searchParams.get('limit') || 50)));

    let start = searchParams.get('start');
    let end = searchParams.get('end');

    // Cálculo de start/end como lo tenías
    const now = new Date();
    if (!start || !end) {
      if (range === 'day') {
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        start = toIso(today);
        end = toIso(now);
      } else if (range === '7d') {
        const s = new Date(now);
        s.setDate(now.getDate() - 7);
        start = toIso(s);
        end = toIso(now);
      } else if (range === '30d') {
        const s = new Date(now);
        s.setDate(now.getDate() - 30);
        start = toIso(s);
        end = toIso(now);
      } else {
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        start = toIso(today);
        end = toIso(now);
      }
    }

    // 1) Intento con RPC
    let baseItems: any[] = [];
    let rpcError: string | null = null;

    try {
      const { data, error } = await supabaseAdmin.rpc('get_sounds_period', {
        p_region: regionQ,
        p_start: start,
        p_end: end,
        p_limit: limit,
      });
      if (error) throw error;
      baseItems = Array.isArray(data) ? data : [];
    } catch (e: any) {
      rpcError = e?.message || String(e);
      console.error('[period] RPC get_sounds_period falló:', rpcError);
    }

    // 2) Si RPC falló o vino vacío, Fallback directo
    if (!baseItems.length) {
      console.warn('[period] usando FALLBACK desde sound_metrics (ALL)');
      if (regionQ === 'ALL') {
        // 1) Tomamos snapshots en el rango y calculamos el mejor rank por sound_id a nivel mundial
        const { data: metricsAll, error: mAllErr } = await supabaseAdmin
          .from('sound_metrics')
          .select('sound_id, region, rank, fetched_at')
          .gte('fetched_at', start!)
          .lte('fetched_at', end!);

        if (mAllErr) {
          return NextResponse.json({ ok: false, error: mAllErr.message }, { status: 500 });
        }

        // best rank por sonido y región donde se logró ese best
        const bestBySound = new Map<string, { best_rank: number; top_region: string }>();
        for (const r of metricsAll || []) {
          if (r.rank == null) continue;
          const key = String(r.sound_id);
          const cur = bestBySound.get(key);
          if (!cur || r.rank < cur.best_rank) {
            bestBySound.set(key, { best_rank: r.rank, top_region: r.region });
          }
        }

        // baseItems: uno por sound_id con el mejor rank
        baseItems = Array
          .from(bestBySound.entries())
          .map(([sound_id, v]) => ({ sound_id, region: v.top_region, best_rank: v.best_rank }))
          .sort((a, b) => (a.best_rank ?? 9e9) - (b.best_rank ?? 9e9))
          .slice(0, limit);
      } else {
        // ... tu caso de región específica queda igual (lo de abajo)
        const { data: fb, error: fbErr } = await supabaseAdmin
          .from('sounds_trending')
          .select('*')
          .eq('region', regionQ)
          .order('rank', { ascending: true })
          .limit(limit);
        if (fbErr) {
          return NextResponse.json({ ok: false, error: fbErr.message }, { status: 500 });
        }
        baseItems = (fb || []).map((r) => ({
          sound_id: r.sound_id,
          region: r.region,
          rank: r.rank,
        }));
      }
    }

    if (!baseItems.length) {
      return NextResponse.json({ ok: true, items: [] }, { headers: { 'cache-control': 'no-store' } });
    }

    // 3) Enriquecer con metadata de sounds_trending
    const ids = Array.from(new Set(baseItems.map((b) => String(b.sound_id))));

    // Cálculo de tendencia para región específica (delta rank últimos 3 días)
    let deltasById = new Map<string, { delta_rank: number; is_rising: boolean }>();

    if (regionQ !== 'ALL') {
      const since = new Date();
      since.setDate(since.getDate() - 3);
      const { data: recent, error: recErr } = await supabaseAdmin
        .from('sound_metrics')
        .select('sound_id, rank, fetched_at')
        .eq('region', regionQ)
        .in('sound_id', ids)
        .gte('fetched_at', toIso(since))
        .order('fetched_at', { ascending: false });

      if (!recErr && recent?.length) {
        const byId: Record<string, number[]> = {};
        for (const r of recent) {
          if (r.rank == null) continue;
          const k = String(r.sound_id);
          (byId[k] ||= []).push(r.rank);
        }
        for (const [k, arr] of Object.entries(byId)) {
          // últimos dos ranks (más reciente primero)
          const [r0, r1] = arr;
          if (typeof r0 === 'number' && typeof r1 === 'number') {
            const delta = r1 - r0; // positivo si MEJORÓ (número bajó)
            deltasById.set(k, { delta_rank: delta, is_rising: delta > 0 });
          }
        }
      }
    } else {
      // ALL: comparamos "mejor rank por día" (agregado entre regiones) últimos ~3 días
      const since = new Date();
      since.setDate(since.getDate() - 3);

      const { data: recentAll, error: recAllErr } = await supabaseAdmin
        .from('sound_metrics')
        .select('sound_id, rank, fetched_at')
        .in('sound_id', ids)
        .gte('fetched_at', toIso(since))
        .order('fetched_at', { ascending: false });

      if (!recAllErr && recentAll?.length) {
        // agrupar por sound_id y day => tomar MIN(rank)
        const byIdDay: Record<string, Record<string, number>> = {};
        for (const r of recentAll) {
          if (r.rank == null) continue;
          const sid = String(r.sound_id);
          const day = new Date(r.fetched_at).toISOString().slice(0,10);
          byIdDay[sid] ||= {};
          byIdDay[sid][day] = Math.min(byIdDay[sid][day] ?? 9e9, r.rank);
        }
        // para cada sound: tomar los 2 días más recientes y comparar
        for (const [sid, days] of Object.entries(byIdDay)) {
          const dayKeys = Object.keys(days).sort().reverse(); // reciente primero
          const r0 = days[dayKeys[0]];
          const r1 = days[dayKeys[1]];
          if (typeof r0 === 'number' && typeof r1 === 'number') {
            const delta = r1 - r0; // positivo si mejoró (descendió el número)
            deltasById.set(sid, { delta_rank: delta, is_rising: delta > 0 });
          }
        }
      }
    }

    let metaRows: any[] = [];
    if (regionQ === 'ALL') {
      // Tomamos la metadata más reciente por sound_id (cualquier región)
      const { data: meta, error: mErr } = await supabaseAdmin
        .from('sounds_trending')
        .select('*')
        .in('sound_id', ids)
        .order('fetched_at', { ascending: false });
      if (mErr) {
        return NextResponse.json({ ok: false, error: mErr.message }, { status: 500 });
      }
      metaRows = meta || [];
    } else {
      const { data: meta, error: mErr } = await supabaseAdmin
        .from('sounds_trending')
        .select('*')
        .eq('region', regionQ)
        .in('sound_id', ids);
      if (mErr) {
        return NextResponse.json({ ok: false, error: mErr.message }, { status: 500 });
      }
      metaRows = meta || [];
    }

    let items = mergeWithMeta(baseItems, metaRows, regionQ)
      // orden estable por rank asc
      .sort((a, b) => (a.rank ?? 9e9) - (b.rank ?? 9e9))
      // limit final por si el RPC devolvió más
      .slice(0, limit);

    // añade tendencia si la tenemos
    if (deltasById.size) {
      items = items.map((it) => {
        const d = deltasById.get(String(it.sound_id));
        return d ? { ...it, delta_rank: d.delta_rank, is_rising: d.is_rising } : it;
      });
    }

    return NextResponse.json({ ok: true, items }, { headers: { 'cache-control': 'no-store' } });
  } catch (e: any) {
    console.error('/api/sounds/period error:', e);
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 });
  }
} 