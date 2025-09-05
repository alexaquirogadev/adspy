// app/api/sounds/resolve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchPreviewFromNovi } from '@/lib/apify';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = (searchParams.get('region') || '').toUpperCase();
    const songId = searchParams.get('song_id') || '';
    const title = searchParams.get('title') || '';

    if (!region) {
      return NextResponse.json({ error: 'region requerida' }, { status: 400 });
    }

    let found:
      | {
          preview_url: string | null;
          cover_url: string | null;
          is_commerce_music: boolean | null;
          duration: number | null;
          user_count: number | null;
          sound_id_found: string | null;
          title_found: string | null;
          author_found: string | null;
        }
      | null = null;

    // 1) Intento por song_id (algunos proveedores permiten buscar por ID en "keyword")
    if (songId) {
      try {
        const res = await fetchPreviewFromNovi({
          region,
          title: songId,
          sortType: 'MOST USED',
          limit: 3,
        });
        if (res?.preview_url) found = res as any;
      } catch {}
    }

    // 2) Si no se encontró, intento por título
    if (!found && title) {
      try {
        const res = await fetchPreviewFromNovi({
          region,
          title,
          sortType: 'MOST USED',
          limit: 5,
        });
        if (res?.preview_url) found = res as any;
      } catch {}
    }

    if (found?.preview_url) {
      // Upsert para cachear el preview (igual que haces en otros puntos)
      const upsertable = {
        sound_id: String(found.sound_id_found || songId || title || ''), // mejor algo que nada
        region,
        title: found.title_found ?? title ?? '',
        author: found.author_found ?? '',
        play_url: found.preview_url,
        preview_url: found.preview_url,
        cover_url: found.cover_url ?? null,
        duration: found.duration ?? null,
        fetched_at: new Date().toISOString(),
        is_commerce_music: found.is_commerce_music ?? null,
        user_count: found.user_count ?? null,
      };

      const { error } = await supabaseAdmin
        .from('sounds_trending')
        .upsert(upsertable, { onConflict: 'sound_id,region' });

      if (error) {
        console.warn('upsert sounds_trending fallo en resolve:', error.message);
      }

      return NextResponse.json(
        {
          ok: true,
          preview_url: found.preview_url,
          cover_url: found.cover_url ?? null,
          is_commerce_music: found.is_commerce_music ?? null,
          user_count: found.user_count ?? null,
          duration: found.duration ?? null,
          sound_id: found.sound_id_found ?? null,
        },
        { headers: { 'cache-control': 'no-store' } },
      );
    }

    // No encontrado
    return NextResponse.json(
      { ok: true, preview_url: null, cover_url: null },
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (e: any) {
    console.error('/api/sounds/resolve error', e);
    return NextResponse.json({ ok: true, preview_url: null, cover_url: null }, { status: 500 });
  }
} 