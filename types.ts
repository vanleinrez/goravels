
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
  nickname?: string;
  email?: string;
  phone?: string;
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
  images?: string[]; // Multiple images for carousel
  category: ListingCategory;
  lat: number;
  lng: number;
  isTrending?: boolean;
  isNew?: boolean;
  sponsorshipTier?: 'Major' | 'Minor'; // New field for paid boosting
  // Extended Details
  description?: string;
  howToGetThere?: string;
  inclusions?: string[];
  rules?: { title: string; text: string; icon?: string }[];
  host?: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
    isVerified?: boolean;
    joinedDate?: string;
    languages?: string[];
    responseRate?: number;
    responseTime?: string;
    badges?: string[];
  };
  itinerary?: { time: string; activity: string }[];
  refundPolicy?: string;
  priceBreakdown?: { item: string; amount: number }[];
  
  // Specific Capacity Metrics
  capacity?: {
    type: 'Room Size' | 'Capacity' | 'Group Size' | 'Slots' | 'Seats';
    value: string | number;
    unit?: string;
  };
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
  location: string;
  date: string;
  status: 'Upcoming' | 'Completed';
  imageUrl: string;
  price?: number;
}

export type NotificationType = 'payment_success' | 'payment_failed' | 'payment_pending' | 'voucher' | 'activity' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  data?: any; // For linking to specific trips or vouchers
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

export interface PaymentMethod {
    id: string;
    name: string;
    icon: string; // URL or icon name
    feePercentage: number;
}
