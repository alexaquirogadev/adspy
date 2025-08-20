import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Calendar, Clock, Eye, Heart, Share2, Crown, Medal, Award, Users } from 'lucide-react';
import SoundPreviewModal from '../shared/SoundPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import { POPULAR_REGIONS } from '@/lib/regions';

// helpers
const toMMSS = (secs?: number | null) => {
  if (!secs && secs !== 0) return null;
  const s = Math.max(0, Math.round(Number(secs)));
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const r = (s % 60).toString().padStart(2, '0');
  return `${m}:${r}`;
};

type RankingPeriod = 'day' | 'week' | 'month';

type RankedItem = {
  sound_id: string;
  title: string;
  author: string | null;
  preview_url: string | null;
  cover_url: string | null;
  total_videos: number | null;
  best_rank: number | null;
};

const RankingView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<RankingPeriod>('day');
  const [region, setRegion] = useState<string>('ALL');
  const [range, setRange] = useState<'day'|'7d'|'30d'>('day');
  const [limit] = useState<number>(50);
  const [sortBy, setSortBy] = useState<
  'rank' | 'uses' | 'dur_asc' | 'dur_desc' | 'commercial_first' | 'noncommercial_first'
>('rank');

  const { data, isLoading } = useSWR<{ ok: boolean; items: RankedItem[] }>(
    `/api/sounds/period?region=${region}&range=${range}&limit=${limit}`,
    (url) => fetch(url).then(r => r.json()),
    { revalidateOnFocus: false }
  );
  const items = data?.items ?? [];

  const [selectedSound, setSelectedSound] = useState<any | null>(null);
  const sortedItems = useMemo(() => {
  const clone = [...items] as any[];
  return clone.sort((a: any, b: any) => {
    const ar = (a.best_rank ?? a.rank ?? 9999);
    const br = (b.best_rank ?? b.rank ?? 9999);
    const au = Number(a.user_count ?? 0);
    const bu = Number(b.user_count ?? 0);
    const ad = Number(a.duration ?? 0);
    const bd = Number(b.duration ?? 0);

    // true=1, false=0, undefined -> -1 (va al final)
    const ac = a.is_commerce_music === true ? 1 : (a.is_commerce_music === false ? 0 : -1);
    const bc = b.is_commerce_music === true ? 1 : (b.is_commerce_music === false ? 0 : -1);

    if (sortBy === 'uses') return bu - au || ar - br;
    if (sortBy === 'dur_asc') return ad - bd || ar - br;
    if (sortBy === 'dur_desc') return bd - ad || ar - br;
    if (sortBy === 'commercial_first')    return bc - ac || ar - br;
    if (sortBy === 'noncommercial_first') return ac - bc || ar - br;

    return ar - br;
  });
}, [items, sortBy]);

  const periods = [
    { value: 'day' as RankingPeriod, label: 'Día', icon: <Clock size={14} /> },
    { value: 'week' as RankingPeriod, label: 'Semana', icon: <Calendar size={14} /> },
    { value: 'month' as RankingPeriod, label: 'Mes', icon: <TrendingUp size={14} /> }
  ];

  const formatNumber = (num: number): string => {
    const n = Number(num || 0);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  const getRankBadge = (index: number) => (
    <span className="text-base md:text-lg font-extrabold text-neutral-800 leading-none">
      #{index + 1}
    </span>
  );

  const openPreview = (it: any) => setSelectedSound({ ...it, region });

  const rangeLabel = range === 'day' ? 'Today' : range === '7d' ? 'Last 7 days' : 'Last 30 days';
  const regionLabel = region === 'ALL' ? 'Worldwide' : region;

  return (
    <div className="pt-1 md:mt-0">
      <AnimatedBanner 
        text={`${regionLabel} • Top sonidos virales`}
        icon={<Trophy />}
        gradient="from-primary to-white"
      />

      {/* Controles */}
      <div className="px-4 md:px-0 mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2">
          {periods.map(period => (
            <button
              key={period.value}
              onClick={() => { setSelectedPeriod(period.value); setRange(period.value === 'day' ? 'day' : period.value === 'week' ? '7d' : '30d'); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 border-black transition-all inline-flex items-center gap-2 ${
                selectedPeriod === period.value 
                  ? "bg-yellow-400 shadow-[2px_2px_0_rgba(0,0,0,1)]" 
                  : "bg-white hover:bg-neutral-50 shadow-[1px_1px_0_rgba(0,0,0,1)]"
              }`}
            >
              {period.icon}
              <span>{period.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Región</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-1.5 rounded-full text-sm border-2 border-black bg-white"
          >
            <option value="ALL">Worldwide</option>
            {POPULAR_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-full text-sm border-2 border-black bg-white"
            title="Ordenar por"
          >
            <option value="rank">Rank</option>
            <option value="uses">Más usados</option>
            <option value="dur_asc">Menor duración</option>
            <option value="dur_desc">Mayor duración</option>
            <option value="commercial_first">Comercial primero</option>
            <option value="noncommercial_first">No comercial primero</option>
          </select>

          <span className="text-xs text-neutral-500">{rangeLabel}</span>
        </div>
      </div>

      {/* Ranking List */}
      <div className="space-y-3 px-4 md:px-0">
        {sortedItems.slice(0, 50).map((it, index) => (
          <motion.div
            key={`${it.sound_id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            onClick={() => openPreview(it)}
            className="bg-white border-2 border-black rounded-xl p-4 shadow-retro hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all duration-300 hover:translate-y-[-2px] cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Rank medalla (número siempre) */}
              <div
                className={[
                  "flex-shrink-0 w-12 h-12 border-2 border-black rounded-full flex items-center justify-center",
                  index === 0
                    ? "bg-gradient-to-br from-yellow-200 to-yellow-300"
                    : index === 1
                    ? "bg-gradient-to-br from-gray-200 to-gray-300"
                    : index === 2
                    ? "bg-gradient-to-br from-amber-200 to-amber-300"
                    : "bg-gradient-to-br from-neutral-100 to-neutral-200",
                ].join(" ")}
              >
                {getRankBadge(index)}
              </div>

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-black">
                <img 
                  src={it.cover_url ?? '/placeholder.png'} 
                  alt={it.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm md:text-base line-clamp-1 mb-1">{it.title}</h3>
                    <p className="text-xs md:text-sm text-neutral-600 font-medium">{it.author ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-gradient-to-r from-secondary/20 to-secondary/10 px-2 py-1 rounded-full border border-secondary/30">
                    <TrendingUp size={12} />
                    <span className="font-bold">#{it.best_rank ?? (index + 1)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  {/* Licencia: mostrar ambos casos */}
                  {((it as any).is_commerce_music === true || (it as any).is_commerce_music === false) && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        (it as any).is_commerce_music
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-orange-100 text-orange-700 border-orange-200'
                      }`}
                    >
                      {(it as any).is_commerce_music ? 'Uso libre (Business)' : 'Licencia requerida'}
                    </span>
                  )}

                  {/* Veces usado */}
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span>{formatNumber(Number((it as any).user_count ?? 0))}</span>
                  </div>

                  {/* Duración */}
                  {!!(it as any).duration && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                      {toMMSS((it as any).duration) as any}
                    </span>
                  )}

                  {/* Tendencia */}
                  {(it as any).is_rising && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                      🔥 En alza
                    </span>
                  )}

                  <div className="hidden md:block text-neutral-400 ml-auto">
                    {regionLabel} • {rangeLabel}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && <div className="text-sm text-neutral-500 px-4 py-6">Cargando ranking…</div>}
        {!isLoading && items.length === 0 && (
          <div className="text-sm text-neutral-500 px-4 py-6">Sin datos para {regionLabel} en {rangeLabel}.</div>
        )}
      </div>

      {/* Sound Preview Modal */}
      <SoundPreviewModal sound={selectedSound} onClose={() => setSelectedSound(null)} />
    </div>
  );
};

export default RankingView;