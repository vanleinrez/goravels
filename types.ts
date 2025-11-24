
export type UserLevel = 'Gora' | 'Gora X' | 'TaraGora' | 'Goravels' | 'Goramax';
export type UserStatus = 'Working' | 'Gora' | 'Plan to go' | 'Booked' | 'Happy now';

export type ListingCategory = 
  | 'Adventures' 
  | 'Experientials' 
  | 'Immersions' 
  | 'Stays' 
  | 'Riders' 
  | 'Eats' 
  | 'Events' 
  | 'Voluntourism' 
  | 'For a cause';

export interface Badge {
  id: string;
  name: string;
  imageUrl: string;
  category: 'Campaign' | 'Achievement';
  isLocked: boolean;
  description?: string;
}

export interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: UserLevel;
  };
  location: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export interface User {
  name: string;
  avatarUrl: string;
  tier: 'Nomad' | 'Explorer' | 'Legend' | 'Guest'; // Keeping legacy tier for compatibility
  level: UserLevel;
  currentStatus: UserStatus;
  stamps: number;
  listings: number;
  following: number;
  followers: number;
  totalTrips: number;
  bio?: string;
  location?: string;
  isHost?: boolean;
  hostStatus?: 'Pending' | 'Active';
  posts?: Post[];
  badges?: Badge[];
  preferences?: string[];
}

export interface Listing {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  category: ListingCategory;
  lat: number;
  lng: number;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface SafetyZone {
  id: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  type: 'Landslide' | 'Flash Flood' | 'Volcanic';
  description: string;
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  status: 'Upcoming' | 'Completed';
  imageUrl: string;
}

export interface Traveler {
  id: string;
  name: string;
  nickname: string;
  avatarUrl: string;
  level: UserLevel;
  status: UserStatus;
  totalTrips: number;
  badges: Badge[];
  isOnline: boolean;
  distance?: string;
}
