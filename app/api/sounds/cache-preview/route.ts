import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sound_id, region } = body || {};
    if (!sound_id || !region) {
      return NextResponse.json({ ok: false, error: 'sound_id y region son requeridos' }, { status: 400 });
    }

    const update: Record<string, any> = {};
    if (body.preview_url) { update.preview_url = body.preview_url; update.play_url = body.play_url ?? body.preview_url; }
    if (body.cover_url) update.cover_url = body.cover_url;
    if (typeof body.duration === 'number') update.duration = body.duration;
    if (typeof body.is_commerce_music === 'boolean') update.is_commerce_music = body.is_commerce_music;
    if (typeof body.user_count === 'number') update.user_count = body.user_count;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { error } = await supabaseAdmin
      .from('sounds_trending')
      .update(update)
      .eq('sound_id', String(sound_id))
      .eq('region', String(region));

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 });
  }
} 