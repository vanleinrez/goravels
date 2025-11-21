export interface User {
  name: string;
  avatarUrl: string;
  tier: 'Nomad' | 'Explorer' | 'Legend';
  stamps: number;
  listings: number;
  following: number;
  followers: number;
}

export interface Listing {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  category: 'Space' | 'Adventure' | 'Experience';
  lat: number;
  lng: number;
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
  avatarUrl: string;
  tier: 'Nomad' | 'Explorer' | 'Legend';
  isOnline: boolean;
}