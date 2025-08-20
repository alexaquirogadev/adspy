import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Target, Zap, Heart, Brain, Moon, Dumbbell, Smile, Shield, Sparkles } from 'lucide-react';
import SoundCard from '../shared/SoundCard';
import SoundPreviewModal from '../shared/SoundPreviewModal';
import AnimatedBanner from '../shared/AnimatedBanner';
import SortButton, { SortOption } from '../search/SortButton';
import { Ad } from '../../lib/types';

interface Problem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  adCount: number;
}

const problems: Problem[] = [
  {
    id: 'acne',
    name: 'Acné',
    icon: <Sparkles size={20} />,
    color: 'from-pink-400 to-rose-500',
    description: 'Productos y tratamientos para el cuidado de la piel',
    adCount: 1247
  },
  {
    id: 'back-pain',
    name: 'Dolor de espalda',
    icon: <Shield size={20} />,
    color: 'from-blue-400 to-indigo-500',
    description: 'Soluciones para aliviar el dolor de espalda',
    adCount: 892
  },
  {
    id: 'sleep',
    name: 'Problemas de sueño',
    icon: <Moon size={20} />,
    color: 'from-purple-400 to-violet-500',
    description: 'Productos para mejorar la calidad del sueño',
    adCount: 1156
  },
  {
    id: 'weight-loss',
    name: 'Pérdida de peso',
    icon: <Dumbbell size={20} />,
    color: 'from-green-400 to-emerald-500',
    description: 'Suplementos y programas de pérdida de peso',
    adCount: 2341
  },
  {
    id: 'anxiety',
    name: 'Ansiedad',
    icon: <Brain size={20} />,
    color: 'from-teal-400 to-cyan-500',
    description: 'Productos para el bienestar mental',
    adCount: 743
  },
  {
    id: 'hair-loss',
    name: 'Caída del cabello',
    icon: <Heart size={20} />,
    color: 'from-orange-400 to-red-500',
    description: 'Tratamientos para la caída del cabello',
    adCount: 654
  },
  {
    id: 'energy',
    name: 'Falta de energía',
    icon: <Zap size={20} />,
    color: 'from-yellow-400 to-orange-500',
    description: 'Suplementos energéticos y vitaminas',
    adCount: 987
  },
  {
    id: 'confidence',
    name: 'Autoestima',
    icon: <Smile size={20} />,
    color: 'from-rose-400 to-pink-500',
    description: 'Productos para mejorar la confianza personal',
    adCount: 432
  }
];

// Mock ads for each problem
const mockProblemAds: { [key: string]: Ad[] } = {
  'acne': [
    {
      id: 'acne-1',
      title: 'ClearSkin Pro - Elimina el acné en 7 días',
      description: 'Tratamiento revolucionario que elimina el acné y previene nuevos brotes.',
      brand: 'ClearSkin',
      thumbnail: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
      platform: 'instagram',
      language: 'es',
      country: 'US',
      views: 2100000,
      engagement: 7.8,
      date: '2025-02-14',
      isFavorite: false,
      isEcommerce: true,
      status: 'active',
      adsets: 6,
      spend: 85000,
      mediaType: 'video',
      targetAudience: ['interests', 'demographics'],
      cta: 'shop_now'
    },
    {
      id: 'acne-2',
      title: 'Serum Anti-Acné Natural',
      description: 'Ingredientes 100% naturales para una piel libre de imperfecciones.',
      brand: 'NaturalGlow',
      thumbnail: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
      platform: 'facebook',
      language: 'es',
      country: 'ES',
      views: 1800000,
      engagement: 6.9,
      date: '2025-02-13',
      isFavorite: false,
      isEcommerce: true,
      status: 'active',
      adsets: 4,
      spend: 62000,
      mediaType: 'carousel',
      targetAudience: ['interests', 'behaviors'],
      cta: 'shop_now'
    }
  ],
  'sleep': [
    {
      id: 'sleep-1',
      title: 'SleepWell - Duerme mejor naturalmente',
      description: 'Suplemento natural que te ayuda a conciliar el sueño profundo.',
      brand: 'SleepWell',
      thumbnail: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg',
      platform: 'youtube',
      language: 'en',
      country: 'US',
      views: 3200000,
      engagement: 8.2,
      date: '2025-02-15',
      isFavorite: false,
      isEcommerce: true,
      status: 'active',
      adsets: 8,
      spend: 120000,
      mediaType: 'video',
      targetAudience: ['interests', 'custom_audiences'],
      cta: 'shop_now'
    }
  ],
  'weight-loss': [
    {
      id: 'weight-1',
      title: 'FitBurn - Quema grasa mientras duermes',
      description: 'El suplemento que acelera tu metabolismo 24/7.',
      brand: 'FitBurn',
      thumbnail: 'https://images.pexels.com/photos/4474052/pexels-photo-4474052.jpeg',
      platform: 'tiktok',
      language: 'es',
      country: 'US',
      views: 4500000,
      engagement: 9.1,
      date: '2025-02-16',
      isFavorite: false,
      isEcommerce: true,
      status: 'active',
      adsets: 12,
      spend: 180000,
      mediaType: 'video',
      targetAudience: ['interests', 'lookalikes'],
      cta: 'shop_now'
    }
  ]
};

const FAVORITES_STORAGE_KEY = 'adspy_favorites';

const ProblemsView: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('date_newest');

  const filteredProblems = problems.filter(problem =>
    problem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort ads based on selected sort option
  const sortAds = (adsToSort: Ad[], sortOption: SortOption): Ad[] => {
    const sorted = [...adsToSort];
    
    switch (sortOption) {
      case 'date_newest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date_oldest':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'duration_longest':
        return sorted.sort((a, b) => {
          const aDuration = Date.now() - new Date(a.date).getTime();
          const bDuration = Date.now() - new Date(b.date).getTime();
          return bDuration - aDuration;
        });
      case 'duration_shortest':
        return sorted.sort((a, b) => {
          const aDuration = Date.now() - new Date(a.date).getTime();
          const bDuration = Date.now() - new Date(b.date).getTime();
          return aDuration - bDuration;
        });
      case 'adsets_most':
        return sorted.sort((a, b) => b.adsets - a.adsets);
      case 'adsets_least':
        return sorted.sort((a, b) => a.adsets - b.adsets);
      case 'spend_highest':
        return sorted.sort((a, b) => b.spend - a.spend);
      case 'spend_lowest':
        return sorted.sort((a, b) => a.spend - b.spend);
      case 'likes_most':
        return sorted.sort((a, b) => (b.views * 0.05) - (a.views * 0.05));
      case 'likes_least':
        return sorted.sort((a, b) => (a.views * 0.05) - (b.views * 0.05));
      case 'views_most':
        return sorted.sort((a, b) => b.views - a.views);
      case 'views_least':
        return sorted.sort((a, b) => a.views - b.views);
      default:
        return sorted;
    }
  };

  const handleProblemSelect = (problemId: string) => {
    setSelectedProblem(problemId);
    const problemAds = mockProblemAds[problemId] || [];
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    const adsWithFavorites = problemAds.map(ad => ({
      ...ad,
      isFavorite: favoriteIds.includes(ad.id)
    }));
    
    setAds(sortAds(adsWithFavorites, selectedSort));
  };

  const toggleFavorite = (id: string) => {
    const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favoriteIds = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    let newFavoriteIds;
    if (favoriteIds.includes(id)) {
      newFavoriteIds = favoriteIds.filter((favId: string) => favId !== id);
    } else {
      newFavoriteIds = [...favoriteIds, id];
    }
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavoriteIds));
    
    setAds(prev => prev.map(ad => 
      ad.id === id ? { ...ad, isFavorite: !ad.isFavorite } : ad
    ));

    if (selectedAd && selectedAd.id === id) {
      setSelectedAd(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const handleCardClick = (ad: Ad) => {
    setSelectedAd(ad);
    setIsPreviewOpen(true);
  };

  const handleViewDetails = (id: string) => {
    console.log('View details for ad:', id);
    setIsPreviewOpen(false);
  };

  const handleBackToProblems = () => {
    setSelectedProblem(null);
    setAds([]);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Apply sorting whenever sort option changes
  React.useEffect(() => {
    if (ads.length > 0) {
      setAds(prevAds => sortAds(prevAds, selectedSort));
    }
  }, [selectedSort]);

  return (
    <div className="pt-1 md:mt-0">
      <AnimatedBanner 
        text="Explora anuncios por problema"
        icon={<Target />}
        gradient="from-teal-400 to-blue-500"
      />

      {!selectedProblem ? (
        <>
          {/* Search Bar */}
          <div className="px-4 md:px-0 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar problemas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>

          {/* Problems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4 md:px-0">
            {filteredProblems.map((problem, index) => (
              <motion.button
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleProblemSelect(problem.id)}
                className="bg-white border-2 border-black rounded-xl p-4 shadow-retro hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all duration-300 hover:translate-y-[-2px] text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${problem.color} border-2 border-black rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {problem.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-base md:text-lg">{problem.name}</h3>
                      <span className="text-xs bg-neutral-100 px-2 py-1 rounded-full font-medium">
                        {formatNumber(problem.adCount)} ads
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Back Button and Selected Problem Header */}
          <div className="px-4 md:px-0 mb-4">
            <button
              onClick={handleBackToProblems}
              className="mb-4 px-3 py-1.5 bg-white border-2 border-black rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium"
            >
              ← Volver a problemas
            </button>
            
            <div className="bg-white border-2 border-black rounded-xl p-4 shadow-retro flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${problems.find(p => p.id === selectedProblem)?.color} border-2 border-black rounded-lg flex items-center justify-center text-white`}>
                  {problems.find(p => p.id === selectedProblem)?.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{problems.find(p => p.id === selectedProblem)?.name}</h2>
                  <p className="text-sm text-neutral-600">{ads.length} anuncios encontrados</p>
                </div>
              </div>
              
              {/* Sort Button - Only show if there are ads */}
              {ads.length > 0 && (
                <SortButton 
                  selectedSort={selectedSort}
                  onSortChange={setSelectedSort}
                />
              )}
            </div>
          </div>

          {/* Ads Results */}
          <div className="mt-4">
            {ads.length === 0 ? (
              <motion.div 
                className="bg-white rounded-xl p-6 md:p-8 text-center mx-auto max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div 
                  className="text-4xl md:text-6xl mb-4"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  🔍
                </motion.div>
                <h3 className="text-lg md:text-xl font-bold mb-2">No hay anuncios disponibles</h3>
                <p className="text-neutral-600 text-sm md:text-base mb-4">
                  Aún no tenemos anuncios para este problema específico.
                </p>
                <button 
                  onClick={handleBackToProblems}
                  className="dopamine-btn inline-flex items-center gap-2"
                >
                  Explorar otros problemas
                </button>
              </motion.div>
            ) : (
              <motion.div 
                className="columns-2 md:columns-4 lg:columns-6 gap-2 md:gap-3 px-1 md:px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {ads.map((ad, index) => (
                  <SoundCard 
                    key={ad.id} 
                    ad={ad} 
                    onToggleFavorite={toggleFavorite}
                    onCardClick={handleCardClick}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Ad Preview Modal */}
      <SoundPreviewModal sound={selectedAd} onClose={() => setIsPreviewOpen(false)} />
    </div>
  );
};

export default ProblemsView;