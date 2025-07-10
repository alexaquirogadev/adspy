'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  Share2, 
  ExternalLink, 
  Calendar, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Layers,
  Globe,
  Languages,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Download,
  Check,
  MessageCircle,
  Bookmark,
  MousePointer
} from 'lucide-react';
import { Ad } from '../../lib/types';

interface AdPreviewModalProps {
  ad: Ad | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const AdPreviewModal: React.FC<AdPreviewModalProps> = ({
  ad,
  isOpen,
  onClose,
  onToggleFavorite,
  onViewDetails
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!ad) return null;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      facebook: '📘',
      instagram: '📷',
      youtube: '📺',
      tiktok: '🎵',
      twitter: '🐦',
      pinterest: '📌',
      linkedin: '💼'
    };
    return icons[platform] || '📱';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-white';
      case 'inactive': return 'bg-warning text-black';
      case 'archived': return 'bg-neutral-400 text-white';
      default: return 'bg-neutral-200 text-neutral-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'archived': return 'Archivado';
      default: return 'Desconocido';
    }
  };

  // Mock additional metrics
  const additionalMetrics = {
    likes: Math.floor(ad.views * 0.05),
    comments: Math.floor(ad.views * 0.02),
    shares: Math.floor(ad.views * 0.01),
    saves: Math.floor(ad.views * 0.03),
    ctr: (Math.random() * 3 + 1).toFixed(2),
    growthData: [
      { 
        date: 'Sem 1', 
        views: Math.floor(ad.views * 0.1),
        likes: Math.floor(ad.views * 0.05 * 0.1),
        comments: Math.floor(ad.views * 0.02 * 0.1),
        shares: Math.floor(ad.views * 0.01 * 0.1),
        saves: Math.floor(ad.views * 0.03 * 0.1)
      },
      { 
        date: 'Sem 2', 
        views: Math.floor(ad.views * 0.3),
        likes: Math.floor(ad.views * 0.05 * 0.3),
        comments: Math.floor(ad.views * 0.02 * 0.3),
        shares: Math.floor(ad.views * 0.01 * 0.3),
        saves: Math.floor(ad.views * 0.03 * 0.3)
      },
      { 
        date: 'Sem 3', 
        views: Math.floor(ad.views * 0.6),
        likes: Math.floor(ad.views * 0.05 * 0.6),
        comments: Math.floor(ad.views * 0.02 * 0.6),
        shares: Math.floor(ad.views * 0.01 * 0.6),
        saves: Math.floor(ad.views * 0.03 * 0.6)
      },
      { 
        date: 'Sem 4', 
        views: ad.views,
        likes: Math.floor(ad.views * 0.05),
        comments: Math.floor(ad.views * 0.02),
        shares: Math.floor(ad.views * 0.01),
        saves: Math.floor(ad.views * 0.03)
      }
    ]
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadCreative = () => {
    const link = document.createElement('a');
    link.href = ad.thumbnail;
    link.download = `${ad.brand}_${ad.title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Mock carousel images for demonstration
  const carouselImages = [
    ad.thumbnail,
    'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Get max values for chart scaling
  const maxValues = {
    views: Math.max(...additionalMetrics.growthData.map(d => d.views)),
    likes: Math.max(...additionalMetrics.growthData.map(d => d.likes)),
    comments: Math.max(...additionalMetrics.growthData.map(d => d.comments)),
    shares: Math.max(...additionalMetrics.growthData.map(d => d.shares)),
    saves: Math.max(...additionalMetrics.growthData.map(d => d.saves))
  };

  // Chart lines configuration
  const chartLines = [
    { key: 'views', color: '#FF006F', label: 'Vistas' },
    { key: 'likes', color: '#EF4444', label: 'Likes' },
    { key: 'comments', color: '#3B82F6', label: 'Comentarios' },
    { key: 'shares', color: '#10B981', label: 'Compartidos' },
    { key: 'saves', color: '#F59E0B', label: 'Guardados' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal - Mobile First Approach */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 xl:inset-x-32 xl:inset-y-8 bg-white rounded-xl md:rounded-2xl lg:rounded-3xl z-[101] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col max-h-[calc(100vh-16px)] sm:max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-48px)]"
          >
            {/* Header - Compact on mobile */}
            <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b-2 border-black bg-gradient-to-r from-primary/20 to-secondary/20 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="text-lg sm:text-xl md:text-2xl flex-shrink-0">{getPlatformIcon(ad.platform)}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl line-clamp-1">{ad.brand}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(ad.status)}`}>
                      {getStatusText(ad.status)}
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-600 hidden sm:block">
                      {formatDate(ad.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={downloadCreative}
                  className="p-1.5 sm:p-2 hover:bg-white/50 rounded-full transition-colors"
                  title="Descargar creativo"
                >
                  <Download size={16} className="text-neutral-600" />
                </button>
                <button
                  onClick={() => onToggleFavorite?.(ad.id)}
                  className="p-1.5 sm:p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <Heart
                    size={16}
                    fill={ad.isFavorite ? '#FF006F' : 'none'}
                    className={ad.isFavorite ? 'text-secondary' : 'text-neutral-600'}
                  />
                </button>
                <button className="p-1.5 sm:p-2 hover:bg-white/50 rounded-full transition-colors hidden sm:block">
                  <Share2 size={16} className="text-neutral-600" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X size={16} className="text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Content - Responsive Layout */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
              {/* Media Section - Limitado en móvil, no fijo */}
              <div className="w-full lg:w-96 xl:w-[420px] relative bg-neutral-100 flex items-center justify-center max-h-[250px] sm:max-h-[300px] md:max-h-[400px] lg:min-h-0 lg:max-h-none flex-shrink-0">
                {ad.mediaType === 'carousel' ? (
                  <div className="relative w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[350px] sm:max-h-[350px] lg:max-w-[400px] lg:max-h-[400px] lg:aspect-square lg:m-4">
                    <img
                      src={carouselImages[currentImageIndex]}
                      alt={ad.title}
                      className="w-full h-full object-cover lg:rounded-lg lg:border-2 lg:border-black lg:shadow-retro"
                    />
                    
                    {/* Carousel Controls */}
                    <button
                      onClick={prevImage}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                      {carouselImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ) : ad.mediaType === 'video' ? (
                  <div className="relative w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[350px] sm:max-h-[350px] lg:max-w-[400px] lg:max-h-[400px] lg:aspect-square lg:m-4 bg-black lg:rounded-lg lg:border-2 lg:border-black lg:shadow-retro lg:overflow-hidden">
                    <img
                      src={ad.thumbnail}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause size={24} className="text-white sm:w-8 sm:h-8" />
                        ) : (
                          <Play size={24} className="text-white ml-0.5 sm:w-8 sm:h-8" />
                        )}
                      </button>
                    </div>

                    {/* Volume Control */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX size={16} className="text-white sm:w-5 sm:h-5" />
                      ) : (
                        <Volume2 size={16} className="text-white sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full max-w-[300px] max-h-[300px] sm:max-w-[350px] sm:max-h-[350px] lg:max-w-[400px] lg:max-h-[400px] lg:aspect-square lg:m-4">
                    <img
                      src={ad.thumbnail}
                      alt={ad.title}
                      className="w-full h-full object-cover lg:rounded-lg lg:border-2 lg:border-black lg:shadow-retro"
                    />
                  </div>
                )}
              </div>

              {/* Info Section - Responsive width and scrolling */}
              <div className="w-full lg:flex-1 flex flex-col min-h-0">
                <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">
                  {/* Title and Description */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
                        {ad.title}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(ad.title, 'title')}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors flex-shrink-0"
                        title="Copiar título"
                      >
                        {copiedText === 'title' ? (
                          <Check size={14} className="text-success" />
                        ) : (
                          <Copy size={14} className="text-neutral-500" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="text-sm sm:text-base text-neutral-700 leading-relaxed flex-1">
                        {ad.description}
                      </p>
                      <button
                        onClick={() => copyToClipboard(ad.description, 'description')}
                        className="p-1 hover:bg-neutral-100 rounded transition-colors flex-shrink-0"
                        title="Copiar descripción"
                      >
                        {copiedText === 'description' ? (
                          <Check size={14} className="text-success" />
                        ) : (
                          <Copy size={14} className="text-neutral-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Engagement Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Heart size={12} className="text-red-500 sm:w-3 sm:h-3" />
                        <span className="text-[10px] sm:text-xs font-medium text-red-700">Likes</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-red-800">{formatNumber(additionalMetrics.likes)}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <MessageCircle size={12} className="text-blue-500 sm:w-3 sm:h-3" />
                        <span className="text-[10px] sm:text-xs font-medium text-blue-700">Comentarios</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-blue-800">{formatNumber(additionalMetrics.comments)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-100 to-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Share2 size={12} className="text-green-500 sm:w-3 sm:h-3" />
                        <span className="text-[10px] sm:text-xs font-medium text-green-700">Compartidos</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-green-800">{formatNumber(additionalMetrics.shares)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Bookmark size={12} className="text-yellow-600 sm:w-3 sm:h-3" />
                        <span className="text-[10px] sm:text-xs font-medium text-yellow-700">Guardados</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-yellow-800">{formatNumber(additionalMetrics.saves)}</p>
                    </div>
                  </div>

                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-black rounded-lg sm:rounded-xl p-2 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <Eye size={12} className="text-neutral-600 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium text-neutral-600">Vistas</span>
                      </div>
                      <p className="text-base sm:text-xl font-bold">{formatNumber(ad.views)}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-2 border-black rounded-lg sm:rounded-xl p-2 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <MousePointer size={12} className="text-neutral-600 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-medium text-neutral-600">CTR</span>
                      </div>
                      <p className="text-base sm:text-xl font-bold">{additionalMetrics.ctr}%</p>
                    </div>
                  </div>

                  {/* Linear Growth Chart with Points */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} className="text-neutral-600" />
                      <h4 className="text-sm sm:text-base font-semibold">Crecimiento de métricas</h4>
                    </div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 sm:p-4">
                      {/* Chart Legend */}
                      <div className="flex flex-wrap gap-2 mb-4 text-xs">
                        {chartLines.map((line) => (
                          <div key={line.key} className="flex items-center gap-1">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: line.color }}
                            />
                            <span className="text-neutral-600">{line.label}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Chart Area */}
                      <div className="relative h-32 sm:h-40">
                        <svg className="w-full h-full" viewBox="0 0 300 120">
                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4].map((i) => (
                            <line
                              key={i}
                              x1="0"
                              y1={i * 24}
                              x2="300"
                              y2={i * 24}
                              stroke="#e5e7eb"
                              strokeWidth="1"
                            />
                          ))}
                          
                          {/* Chart lines */}
                          {chartLines.map((line) => {
                            const points = additionalMetrics.growthData.map((point, index) => {
                              const x = (index * 100) + 50;
                              const value = point[line.key as keyof typeof point] as number;
                              const maxValue = maxValues[line.key as keyof typeof maxValues];
                              const y = 100 - ((value / maxValue) * 80);
                              return `${x},${y}`;
                            }).join(' ');
                            
                            return (
                              <g key={line.key}>
                                {/* Line */}
                                <polyline
                                  points={points}
                                  fill="none"
                                  stroke={line.color}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                
                                {/* Points */}
                                {additionalMetrics.growthData.map((point, index) => {
                                  const x = (index * 100) + 50;
                                  const value = point[line.key as keyof typeof point] as number;
                                  const maxValue = maxValues[line.key as keyof typeof maxValues];
                                  const y = 100 - ((value / maxValue) * 80);
                                  
                                  return (
                                    <circle
                                      key={index}
                                      cx={x}
                                      cy={y}
                                      r="4"
                                      fill={line.color}
                                      stroke="white"
                                      strokeWidth="2"
                                    />
                                  );
                                })}
                              </g>
                            );
                          })}
                          
                          {/* X-axis labels */}
                          {additionalMetrics.growthData.map((point, index) => (
                            <text
                              key={index}
                              x={(index * 100) + 50}
                              y="115"
                              textAnchor="middle"
                              className="text-xs fill-neutral-600"
                            >
                              {point.date}
                            </text>
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Info - Compact on mobile */}
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-neutral-200">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <DollarSign size={14} className="text-neutral-500 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base font-medium">Gasto estimado</span>
                      </div>
                      <span className="text-sm sm:text-base font-bold">${formatNumber(ad.spend)}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-neutral-200">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Layers size={14} className="text-neutral-500 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base font-medium">Adsets</span>
                      </div>
                      <span className="text-sm sm:text-base font-bold">{ad.adsets}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-neutral-200">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <TrendingUp size={14} className="text-neutral-500 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base font-medium">Engagement</span>
                      </div>
                      <span className="text-sm sm:text-base font-bold">{ad.engagement}%</span>
                    </div>

                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-neutral-200">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Globe size={14} className="text-neutral-500 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base font-medium">País</span>
                      </div>
                      <span className="text-sm sm:text-base font-bold">{ad.country}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-neutral-200">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Languages size={14} className="text-neutral-500 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base font-medium">Idioma</span>
                      </div>
                      <span className="text-sm sm:text-base font-bold">{ad.language.toUpperCase()}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 sm:py-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar size={14} className="text-neutral-500 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base font-medium">Fecha de creación</span>
                      </div>
                      <span className="text-sm sm:text-base font-bold">{formatDate(ad.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Responsive sizing */}
                <div className="p-3 sm:p-4 md:p-6 border-t-2 border-black bg-neutral-50 flex-shrink-0">
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => onViewDetails?.(ad.id)}
                      className="flex-1 px-3 sm:px-6 py-2 sm:py-3 font-bold rounded-lg sm:rounded-xl border-2 border-black bg-secondary text-white hover:bg-secondary-hover shadow-retro transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                      <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="hidden sm:inline">Ver más detalles</span>
                      <span className="sm:hidden">Detalles</span>
                    </button>
                    
                    <button className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-black rounded-lg sm:rounded-xl hover:bg-neutral-100 transition-colors flex-shrink-0">
                      <ExternalLink size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdPreviewModal;