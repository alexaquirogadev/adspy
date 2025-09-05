import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preview_url = null;
    const cover_url = null;
    return NextResponse.json({ preview_url, cover_url }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json({ preview_url: null }, { status: 500 });
  }
} 