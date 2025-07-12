import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import type { Ad, AdFilters } from "@/lib/types";
import { subDays } from "date-fns";

const dataPath = process.cwd() + "/public/mock/ads.json";

// Normaliza y parsea los query params a AdFilters
function parseFilters(searchParams: URLSearchParams): AdFilters {
  return {
    search: searchParams.get("search") || undefined,
    country: searchParams.get("country") || undefined,
    platform: searchParams.get("platform") as AdFilters["platform"],
    language: searchParams.get("language") || undefined,
    mediaType: searchParams.get("mediaType") as AdFilters["mediaType"],
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    sort: searchParams.get("sort") || undefined,
  };
}

// Ordena el array según el campo y dirección
function sortAds(ads: Ad[], sort?: string): Ad[] {
  if (!sort) return ads;
  const [field, dir] = sort.split("-");
  return [...ads].sort((a, b) => {
    if (!(field in a)) return 0;
    const aVal = (a as any)[field];
    const bVal = (b as any)[field];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return dir === "desc" ? bVal - aVal : aVal - bVal;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return dir === "desc" ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
    }
    return 0;
  });
}

export async function GET(req: Request) {
  try {
    // Lee y parsea el JSON
    const raw = await fs.readFile(dataPath, "utf-8");
    const ads: Ad[] = JSON.parse(raw);
    let filteredAds = ads;
    const { searchParams } = new URL(req.url);

    // --- filtro por fechas ---
    const { timeRange, startDate, endDate } = Object.fromEntries(searchParams.entries());

    if (timeRange === '7d' || timeRange === '30d') {
      const days = timeRange === '7d' ? 7 : 30;
      const from = subDays(new Date(), days);
      filteredAds = filteredAds.filter(a => new Date(a.date) >= from);
    }
    if (timeRange === 'custom' && startDate && endDate) {
      const s = new Date(startDate as string);
      const e = new Date(endDate as string);
      filteredAds = filteredAds.filter(a => {
        const d = new Date(a.date);
        return d >= s && d <= e;
      });
    }

    // Normaliza y parsea los query params a AdFilters
    const filters = parseFilters(searchParams);

    // Filtrado inmutable
    filteredAds = filteredAds.filter((ad) => {
      // search: busca en title y description (case-insensitive)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!ad.title.toLowerCase().includes(q) && !ad.description.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filters.country && ad.country !== filters.country) return false;
      if (filters.platform && ad.platform !== filters.platform) return false;
      if (filters.language && ad.language !== filters.language) return false;
      if (filters.mediaType && ad.mediaType !== filters.mediaType) return false;
      if (filters.from && ad.date < filters.from) return false;
      if (filters.to && ad.date > filters.to) return false;
      return true;
    });

    // Ordena si corresponde
    filteredAds = sortAds(filteredAds, filters.sort);

    // --- filtros con arrays ---
    const arr = (k: string) => searchParams.getAll(k);

    if (arr('platforms').length)
      filteredAds = filteredAds.filter(a => arr('platforms').includes(a.platform));

    if (arr('countries').length)
      filteredAds = filteredAds.filter(a => arr('countries').includes(a.country));

    if (arr('languages').length)
      filteredAds = filteredAds.filter(a => arr('languages').includes(a.language));

    if (arr('mediaTypes').length)
      filteredAds = filteredAds.filter(a => arr('mediaTypes').includes(a.mediaType));

    return NextResponse.json(filteredAds, {
      status: 200,
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("/api/ads error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
} 