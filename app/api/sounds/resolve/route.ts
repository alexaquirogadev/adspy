import { NextRequest, NextResponse } from 'next/server';
import { fetchSoundsFromApify } from '@/lib/apify';
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

    let found: any | undefined;

    // 1) Intento por song_id
    if (songId) {
      try {
        const res = await fetchSoundsFromApify({ region, keyword: songId, sortType: 'RELEVANCE', limit: 1 });
        found = res?.[0];
      } catch {}
    }

    // 2) Intento por title si no encontrado
    if (!found && title) {
      try {
        const res = await fetchSoundsFromApify({ region, keyword: title, sortType: 'RELEVANCE', limit: 1 });
        found = res?.[0];
      } catch {}
    }

    const previewUrl = found?.preview_url ?? found?.play_url ?? null;
    const coverUrl = found?.cover_url ?? null;

    if (previewUrl && found?.sound_id) {
      const upsertable = {
        sound_id: String(found.sound_id),
        region,
        title: found.title ?? '',
        author: found.author ?? '',
        play_url: found.play_url ?? null,
        preview_url: previewUrl,
        cover_url: coverUrl,
        duration: found.duration ?? null,
        language: found.language ?? null,
        fetched_at: new Date().toISOString(),
      };
      const { error } = await supabaseAdmin
        .from('sounds_trending')
        .upsert(upsertable, { onConflict: 'sound_id,region' });
      if (error) {
        console.warn('upsert sounds_trending fallo en resolve:', error.message);
      }
      return NextResponse.json({ preview_url: previewUrl, cover_url: coverUrl }, { headers: { 'cache-control': 'no-store' } });
    }

    return NextResponse.json({ preview_url: null }, { headers: { 'cache-control': 'no-store' } });
  } catch (e: any) {
    console.error('/api/sounds/resolve error', e);
    return NextResponse.json({ preview_url: null }, { status: 500 });
  }
} 