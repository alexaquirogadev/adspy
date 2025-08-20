/**
 * Apify helpers:
 * - Alien (clockworks/tiktok-sound-scraper) para TOP por país
 * - Novi   (novi/tiktok-sound-api)        para PREVIEW (play_url/cover)
 */
import { ApifyClient } from 'apify-client';
import slugify from 'slugify';

export type SortType = 'RELEVANCE' | 'MOST USED' | 'MOST RECENT' | 'SHORTEST' | 'LONGEST';

export type Sound = {
  sound_id: string;
  title: string;
  author: string;
  region: string;              // 'US','ES',...
  rank?: number | null;
  cover_url?: string | null;
  preview_url?: string | null;
  play_url?: string | null;
  duration?: number | null;
  video_count?: number | null;
  user_count?: number | null;
  fetched_at?: string;
  tiktok_url?: string | null;
  is_commerce_music?: boolean | null;
};

export const client = new ApifyClient({ token: process.env.APIFY_TOKEN! });

/** country name -> ISO code usado en UI/DB */
const COUNTRY_TO_CODE: Record<string,string> = {
  'United States':'US','Spain':'ES','Mexico':'MX','Brazil':'BR','United Kingdom':'GB',
  'Argentina':'AR','Colombia':'CO','Chile':'CL','Peru':'PE','Canada':'CA',
  'Germany':'DE','France':'FR','Italy':'IT','Portugal':'PT','Netherlands':'NL',
  'Belgium':'BE','Sweden':'SE','Norway':'NO','Denmark':'DK','Finland':'FI',
  'Ireland':'IE','Switzerland':'CH','Austria':'AT','Australia':'AU','New Zealand':'NZ',
  'Poland':'PL','Turkey':'TR','Japan':'JP','South Korea':'KR','India':'IN'
};
export function countryNameToCode(name: string) {
  return COUNTRY_TO_CODE[name] ?? name.toUpperCase();
}

/** ---------- ALIEN: TOP por país ---------- */
export async function fetchCountryTrendingAlien(params: {
  countryName: string;             // ej: 'United States'
  limit?: number;                  // default 50
  period?: number | '1'|'7'|'30';  // días: 1,7,30
}) {
  const actorId = process.env.APIFY_ALIEN_ACTOR_ID || 'alien_force/tiktok-trending-sounds-tracker';
  const countryName = params.countryName;
  const limitNum = Number(params.limit ?? 50);
  const periodStr = typeof params.period === 'string' ? params.period : String(params.period ?? 1);

  // Input EXACTO que espera alien_force
  const input = {
    country: countryName,
    limit: limitNum,
    period: periodStr,
  } as Record<string, any>;

  console.log('[ALIEN] actor:', actorId, 'input:', input);

  const { defaultDatasetId } = await client.actor(actorId).call(input);
  if (!defaultDatasetId) throw new Error('Clockworks run sin dataset');

  // NUEVO: logs útiles
  console.log('[ALIEN] dataset', defaultDatasetId);

  const { items } = await client.dataset(defaultDatasetId).listItems({ limit: 1000 });
  console.log('[ALIEN] sample ids', (items as any[]).slice(0, 5).map(it =>
    it?.song_id ?? it?.clip_id ?? it?.id ?? it?.slug
  ));

  const region = countryNameToCode(countryName);

  const mapped: Sound[] = (items as any[]).map((it) => ({
    sound_id: String(it.song_id ?? it.clip_id ?? it.id ?? it.slug),
    title: it.title ?? 'Untitled',
    author: it.author ?? '',
    region,
    rank: typeof it.rank === 'number' ? it.rank : null,
    cover_url: it.cover_url ?? null,
    preview_url: null,                 // lo resolveremos con Novi on-demand
    play_url: null,
    duration: it.duration ?? null,
    video_count: null,
    user_count: null,
    tiktok_url: it.link ?? null,       // viene en el output
    fetched_at: new Date().toISOString(),
  }));

  return mapped;
}

/** ---------- NOVI: PREVIEW (búsqueda por título) ---------- */
export async function fetchPreviewFromNovi(params: {
  region: string;            // 'US'
  title: string;             // "Hey Sexy Lady"
  sortType?: SortType;       // default 'MOST USED'
  filterBy?: 'ALL'|'TITLE'|'CREATOR';
  limit?: number;            // default 5
}) {
  const actorId = process.env.APIFY_NOVI_ACTOR_ID || 'novi/tiktok-sound-api';
  const { region, title } = params;
  const sortType = params.sortType ?? 'MOST USED';
  const filterBy = params.filterBy ?? 'ALL';
  const limit = params.limit ?? 5;

  const input: Record<string, any> = {
    type: 'SEARCH',
    region,
    sortType,
    filterBy,
    limit,
    keyword: title,
  };

  const { defaultDatasetId } = await client.actor(actorId).call(input);
  if (!defaultDatasetId) return null;

  // espera breve a que el dataset tenga registros
  const wait = async (tries = 6) => {
    for (let i = 0; i < tries; i++) {
      const { items } = await client.dataset(defaultDatasetId).listItems({ limit });
      if (items?.length) return items as any[];
      await new Promise(r => setTimeout(r, 1500));
    }
    return [] as any[];
  };

  const items = await wait();
  if (!items.length) return null;

  const first = items.find((it: any) => it?.play_url?.url_list?.[0]) ?? items[0];
  const play = first?.play_url?.url_list?.[0] ?? null;
  const cover =
    first?.cover_large?.url_list?.[0] ??
    first?.cover_medium?.url_list?.[0] ??
    first?.cover_thumb?.url_list?.[0] ?? null;

  return {
    preview_url: play,
    cover_url: cover,
    is_commerce_music: first?.is_commerce_music ?? null,
    duration: first?.duration ?? null,
    user_count: Number(first?.user_count) || null,
    sound_id_found: String(first?.id_str ?? first?.id ?? ''),
    title_found: first?.title ?? null,
    author_found: first?.author ?? null,
  };
} 