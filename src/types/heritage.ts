export type LocationCategory = 'craft-village' | 'monument' | 'ethnic-region';
export type Region = 'north' | 'central' | 'south';
export type ContentType = 'authentic' | 'folk';

export interface HeritageLocation {
  id: number;
  slug: string;
  name: string;
  province: string;
  region: Region;
  category: LocationCategory;
  x: number;
  y: number;
  summary: string;
  image: string;
  tags: string[];
  product_count: number;
  content_count: number;
  address: string;
  lat: number | null;
  lng: number | null;
}

export interface HeritageContent {
  id: number;
  location_id: number;
  content_type: ContentType;
  title: string;
  body: string;
  source: string;
  author: string;
  audio_url: string | null;
}

export interface Seller {
  id: number;
  location_id: number | null;
  name: string;
  title: string;
  craft: string;
  avatar: string;
  bio: string;
  biography: string;
  achievements: string[];
  zalo: string;
  messenger: string;
  phone: string;
}

export interface HeritageStory {
  id: number;
  slug: string;
  location_id: number | null;
  title: string;
  storyteller: string | null;
  excerpt: string;
  body: string;
  cover_image: string;
  region: string | null;
  duration_minutes: number;
  audio_url: string | null;
  is_featured: boolean;
  published_at: string;
}

export interface Article {
  id: number;
  slug: string;
  location_id: number | null;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string;
  category: string;
  author: string;
  read_minutes: number;
  audio_url: string | null;
  published_at: string;
}

export interface Favorite {
  id: number;
  user_id: string;
  item_type: 'location' | 'article';
  item_id: number;
  created_at: string;
}

export interface Message {
  id: number;
  user_id: string;
  sender_name: string | null;
  sender_email: string | null;
  body: string;
  is_team_reply: boolean;
  created_at: string;
}