import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/sounds
 * Devuelve los sonidos trending de la tabla sounds_trending según la región.
 * - Solo acepta GET.
 * - Consulta Supabase.
 * - Devuelve los sonidos ordenados por rank.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region') || 'ES';
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    const { data, error } = await supabase
      .from('sounds_trending')
      .select('*')
      .eq('region', region)
      .order('rank', { ascending: true });
    if (error) {
      console.error('/api/sounds error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const mapped = (data ?? []).map(row => ({
      id:           row.sound_id,
      sound_id:     row.sound_id,
      title:        row.title,
      author:       row.author,
      preview_url:  row.preview_url ?? row.play_url ?? null,
      cover_thumb:  row.cover_url,
      video_count:  row.video_count,
      duration:     row.duration,
      language:     row.language,
      rank:         row.rank,
      tags:         row.tags,
      fetched_at:   row.fetched_at,
      create_time:  row.create_time,
      tiktok_url:   row.tiktok_url,
    }));
    return NextResponse.json(mapped, {
      status: 200,
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("/api/sounds error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 