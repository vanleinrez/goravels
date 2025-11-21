import type { User, Listing, SafetyZone, Trip, Traveler } from './types';

export const mockUser: User = {
  name: 'Maria Jessica Santos',
  avatarUrl: 'https://picsum.photos/id/237/200/200',
  tier: 'Explorer',
  stamps: 12,
  listings: 8,
  following: 40,
  followers: 20
};

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Singalong Nature Camp',
    location: 'Haynoni, Magsaysay',
    rating: 4.8,
    reviews: 12,
    price: 1714,
    imageUrl: 'https://picsum.photos/seed/singalong/600/400',
    category: 'Adventure',
    lat: 8.87,
    lng: 125.21,
  },
  {
    id: '2',
    title: 'Hidden Valley Farm Stay',
    location: 'Impasug-ong, Bukidnon',
    rating: 4.9,
    reviews: 25,
    price: 2500,
    imageUrl: 'https://picsum.photos/seed/farmstay/600/400',
    category: 'Space',
    lat: 8.31,
    lng: 125.00,
  },
  {
    id: '3',
    title: 'Mt. Kitanglad Trek',
    location: 'Kitanglad Range',
    rating: 5.0,
    reviews: 8,
    price: 3500,
    imageUrl: 'https://picsum.photos/seed/kitanglad/600/400',
    category: 'Adventure',
    lat: 8.12,
    lng: 124.92,
  },
  {
    id: '4',
    title: 'Local Weaving Workshop',
    location: 'Lantapan, Bukidnon',
    rating: 4.7,
    reviews: 15,
    price: 950,
    imageUrl: 'https://picsum.photos/seed/weaving/600/400',
    category: 'Experience',
    lat: 8.05,
    lng: 124.98,
  },
  {
    id: '5',
    title: 'Stanlang Wood House',
    location: 'Gingoog City',
    rating: 4.6,
    reviews: 18,
    price: 1950,
    imageUrl: 'https://picsum.photos/seed/woodhouse/600/400',
    category: 'Space',
    lat: 8.82,
    lng: 125.10,
  },
];

export const mockSafetyZones: SafetyZone[] = [
  {
    id: 'z1',
    lat: 8.50,
    lng: 124.80,
    radius: 3000,
    type: 'Landslide',
    description: 'Prone to landslides during heavy rain.'
  },
  {
    id: 'z2',
    lat: 8.20,
    lng: 125.10,
    radius: 2000,
    type: 'Flash Flood',
    description: 'River levels rise rapidly.'
  }
];

export const mockTrips: Trip[] = [
  {
    id: 't1',
    title: 'Bukidnon Roadtrip',
    date: 'Oct 12 - 15, 2024',
    status: 'Upcoming',
    imageUrl: 'https://picsum.photos/seed/roadtrip/200/200'
  },
  {
    id: 't2',
    title: 'Camiguin Island',
    date: 'Aug 5 - 8, 2024',
    status: 'Completed',
    imageUrl: 'https://picsum.photos/seed/camiguin/200/200'
  }
];

export const mockTravelers: Traveler[] = [
  { id: 'u1', name: 'John Doe', avatarUrl: 'https://picsum.photos/seed/u1/100/100', tier: 'Nomad', isOnline: true },
  { id: 'u2', name: 'Jane Smith', avatarUrl: 'https://picsum.photos/seed/u2/100/100', tier: 'Legend', isOnline: false },
  { id: 'u3', name: 'Mike Ross', avatarUrl: 'https://picsum.photos/seed/u3/100/100', tier: 'Explorer', isOnline: true },
];
