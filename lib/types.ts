export interface Ad {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  brand: string;
  platform: Platform;
  country: CountryCode;
  language: Language;
  views: number;
  engagement: number;
  date: string;
  isFavorite: boolean;
  isEcommerce: boolean;
  status: AdStatus;
  adsets: number;
  spend: number;
  mediaType: MediaType;
  targetAudience: TargetAudience[];
  cta: CTA;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  subscription: {
    plan: 'free' | 'basic' | 'pro';
    status: 'active' | 'canceled' | 'expired';
    expiry?: string;
  };
}

export type CountryCode = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR' | 'ES' | 'IT' | 'JP' | 'IN';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'zh' | 'pt' | 'ru' | 'hi';
export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'pinterest' | 'linkedin' | 'snapchat';
export type TimeRange = '24h' | '7d' | '15d' | '30d' | '90d' | 'all' | 'custom';
export type AdStatus = 'active' | 'inactive' | 'archived';
export type MediaType = 'image' | 'video' | 'carousel' | 'collection' | 'story';
export type TargetAudience = 'interests' | 'behaviors' | 'demographics' | 'custom_audiences' | 'lookalikes';
export type CTA = 'shop_now' | 'learn_more' | 'sign_up' | 'download' | 'contact_us' | 'book_now' | 'get_offer';

export interface SearchFilters {
  query?: string;
  countries?: CountryCode[];
  languages?: Language[];
  platforms?: Platform[];
  timeRange?: TimeRange;
  customDateRange?: {
    start: string;
    end: string;
  };
  isEcommerce?: boolean;
  status?: AdStatus[];
  adsetRange?: {
    min?: number;
    max?: number;
  };
  spendRange?: {
    min?: number;
    max?: number;
  };
  mediaTypes?: MediaType[];
  targetAudience?: TargetAudience[];
  cta?: CTA[];
}