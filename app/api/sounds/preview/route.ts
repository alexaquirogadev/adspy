import { NextRequest, NextResponse } from 'next/server';
import { fetchPreviewFromNovi } from '@/lib/apify';
import slugify from 'slugify';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const region = (searchParams.get('region') || 'US').toUpperCase();
    const title = searchParams.get('title') || '';
    if (!title.trim()) {
      return NextResponse.json({ ok: true, preview_url: null, cover_url: null });
    }

    const res = await fetchPreviewFromNovi({ region, title, sortType: 'MOST USED', limit: 5 });

    return NextResponse.json({
      ok: true,
      preview_url: res?.preview_url ?? null,
      cover_url: res?.cover_url ?? null,
      is_commerce_music: res?.is_commerce_music ?? null,
      duration: res?.duration ?? null,
      user_count: res?.user_count ?? null,
      sound_id: res?.sound_id_found ?? null,
      tiktok_url_guess: `https://www.tiktok.com/music/${slugify(title,{lower:true,strict:true})}${res?.sound_id_found ? '-' + res.sound_id_found : ''}`,
    }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json({ ok: true, preview_url: null, cover_url: null });
  }
} 