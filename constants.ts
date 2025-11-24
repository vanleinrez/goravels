
import type { User, Listing, SafetyZone, Trip, Traveler, Badge, Post } from './types';

export const mockBadges: Badge[] = [
  { id: 'b1', name: 'Early Bird', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3176/3176294.png', category: 'Achievement', isLocked: false, description: 'Booked a trip 3 months in advance.' },
  { id: 'b2', name: 'Coffee Lover', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2935/2935413.png', category: 'Campaign', isLocked: false, description: 'Visited 5 local coffee farms.' },
  { id: 'b3', name: 'Highlander', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3004/3004613.png', category: 'Achievement', isLocked: true, description: 'Climbed 3 major peaks.' },
  { id: 'b4', name: 'Eco Warrior', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2913/2913520.png', category: 'Campaign', isLocked: true, description: 'Participated in a tree planting activity.' },
  { id: 'b5', name: 'River Rat', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2847/2847048.png', category: 'Achievement', isLocked: false, description: 'Completed 3 water rafting courses.' },
  { id: 'b6', name: 'Social Butterfly', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3050/3050455.png', category: 'Achievement', isLocked: false, description: 'Attended 5 community events.' },
];

export const mockPosts: Post[] = [
  { 
    id: 'p1', 
    user: { name: 'Maria Santos', avatar: 'https://picsum.photos/id/237/200/200', level: 'Gora X' },
    location: 'Claveria, Misamis Oriental',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800',
    caption: 'Morning mist at the view deck. The air is so fresh here! 🌫️🍃 #Claveria #Nature',
    likes: 245, comments: 23, timestamp: '2h ago', tags: ['Nature', 'Relax']
  },
  { 
    id: 'p2', 
    user: { name: 'Jay Walker', avatar: 'https://picsum.photos/id/1011/200/200', level: 'TaraGora' },
    location: 'Cagayan de Oro River',
    imageUrl: 'https://images.unsplash.com/photo-1520859690306-390649701f2b?auto=format&fit=crop&w=800',
    caption: 'Whitewater rafting extreme! Adrenaline rush 100%! 🚣‍♂️🌊 #CDO #Rafting',
    likes: 892, comments: 104, timestamp: '5h ago', tags: ['Adventure', 'Water Sports']
  },
  { 
    id: 'p3', 
    user: { name: 'Anna L.', avatar: 'https://picsum.photos/id/1027/200/200', level: 'Goravels' },
    location: 'Dahilayan, Bukidnon',
    imageUrl: 'https://images.unsplash.com/photo-1533234962703-2312c8742a8b?auto=format&fit=crop&w=800',
    caption: 'Ziplining through the pine trees! 🌲💨 #Zipline #Bukidnon',
    likes: 567, comments: 45, timestamp: '1d ago', tags: ['Adventure', 'Zipline']
  },
  { 
    id: 'p4', 
    user: { name: 'Mike Ross', avatar: 'https://picsum.photos/id/1005/200/200', level: 'Goramax' },
    location: 'Tinago Falls, Iligan City',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800',
    caption: 'Hidden gem indeed. The water is freezing but worth it! 💦 #Tinago #Waterfalls',
    likes: 1205, comments: 89, timestamp: '2d ago', tags: ['Waterfalls', 'Swimming']
  },
  { 
    id: 'p5', 
    user: { name: 'Sarah J.', avatar: 'https://picsum.photos/id/64/200/200', level: 'Gora' },
    location: 'Higaonon Village, Talakag',
    imageUrl: 'https://images.unsplash.com/photo-1589985236891-5cb317867dc8?auto=format&fit=crop&w=800',
    caption: 'Learned traditional weaving today. So much respect for our culture. 🧶🇵🇭 #TribalImmersion',
    likes: 340, comments: 12, timestamp: '2d ago', tags: ['Culture', 'Immersion']
  },
  { 
    id: 'p6', 
    user: { name: 'Tom Cruise', avatar: 'https://picsum.photos/id/177/200/200', level: 'Gora X' },
    location: 'Initao, Lasang Secret Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800',
    caption: 'Spelunking and beach hopping in one day! 🦇🏖️ #Initao #Cave',
    likes: 455, comments: 34, timestamp: '3d ago', tags: ['Adventure', 'Cave']
  },
  { 
    id: 'p7', 
    user: { name: 'Chef Boy', avatar: 'https://picsum.photos/id/292/200/200', level: 'TaraGora' },
    location: 'Magsaysay, Misamis Oriental',
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800',
    caption: 'Farm to table cooking workshop. The kinilaw was the best! 🐟🍋 #Foodie #Cooking',
    likes: 678, comments: 56, timestamp: '3d ago', tags: ['Food', 'Workshop']
  },
  { 
    id: 'p8', 
    user: { name: 'Nature Boi', avatar: 'https://picsum.photos/id/338/200/200', level: 'Gora' },
    location: 'Tiklas Falls, Gingoog City',
    imageUrl: 'https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?auto=format&fit=crop&w=800',
    caption: 'Chasing waterfalls in Gingoog. 🌈 #Gingoog #Nature',
    likes: 233, comments: 8, timestamp: '4d ago', tags: ['Waterfalls', 'Trekking']
  },
  { 
    id: 'p9', 
    user: { name: 'Beach Bum', avatar: 'https://picsum.photos/id/435/200/200', level: 'Goramax' },
    location: 'Medina, Misamis Oriental',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800',
    caption: 'Golden hour at the beach. Quiet and peaceful. 🌅 #Medina #Beach',
    likes: 890, comments: 45, timestamp: '5d ago', tags: ['Beach', 'Sunset']
  },
  { 
    id: 'p10', 
    user: { name: 'Farmer Joe', avatar: 'https://picsum.photos/id/550/200/200', level: 'TaraGora' },
    location: 'Impasug-ong, Bukidnon',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800',
    caption: 'Harvesting pineapples today! 🍍 Sweetest in the world. #Farming #Bukidnon',
    likes: 560, comments: 78, timestamp: '6d ago', tags: ['Farming', 'Experience']
  },
  { 
    id: 'p11', 
    user: { name: 'Adv. Kate', avatar: 'https://picsum.photos/id/823/200/200', level: 'Goravels' },
    location: 'Seven Seas, Opol',
    imageUrl: 'https://images.unsplash.com/photo-1572331165267-854da2b00dc3?auto=format&fit=crop&w=800',
    caption: 'Waterpark fun with the barkada! 🌊🎢 #SevenSeas #Opol',
    likes: 345, comments: 22, timestamp: '1w ago', tags: ['Fun', 'Waterpark']
  },
  { 
    id: 'p12', 
    user: { name: 'Zen Master', avatar: 'https://picsum.photos/id/999/200/200', level: 'Goramax' },
    location: 'Monastery of Transfiguration, Malaybalay',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800',
    caption: 'Finding peace and coffee. 🙏☕ #Malaybalay #Spiritual',
    likes: 670, comments: 33, timestamp: '1w ago', tags: ['Spiritual', 'Coffee']
  },
  { 
    id: 'p13', 
    user: { name: 'Trail Blazer', avatar: 'https://picsum.photos/id/1015/200/200', level: 'TaraGora' },
    location: 'Mt. Kitanglad Range',
    imageUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800',
    caption: 'Summit reached! The mossy forest is magical. 🏔️🧚‍♀️ #Trekking #Mountains',
    likes: 999, comments: 150, timestamp: '2w ago', tags: ['Trekking', 'Mountains']
  },
  { 
    id: 'p14', 
    user: { name: 'River Queen', avatar: 'https://picsum.photos/id/1020/200/200', level: 'Gora X' },
    location: 'Pulangi River',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800',
    caption: 'Sunset river cruise. 🛶🌅 #Pulangi #River',
    likes: 450, comments: 20, timestamp: '2w ago', tags: ['River', 'Relax']
  }
];

export const mockUser: User = {
  name: 'Maria Jessica Santos',
  avatarUrl: 'https://picsum.photos/id/237/200/200',
  tier: 'Explorer',
  level: 'Gora X',
  currentStatus: 'Gora',
  totalTrips: 14,
  stamps: 12,
  listings: 0,
  following: 40,
  followers: 128,
  bio: 'Digital nomad loving the rural vibes. Always up for a coffee run! ☕️🌿',
  location: 'Cagayan de Oro, PH',
  posts: mockPosts,
  badges: [mockBadges[0], mockBadges[1]]
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
  { id: 'u1', name: 'John Doe', nickname: 'Johny', avatarUrl: 'https://picsum.photos/seed/u1/100/100', level: 'TaraGora', status: 'Gora', totalTrips: 24, badges: [mockBadges[0], mockBadges[4]], isOnline: true, distance: '0.5 km' },
  { id: 'u2', name: 'Jane Smith', nickname: 'Janey', avatarUrl: 'https://picsum.photos/seed/u2/100/100', level: 'Goravels', status: 'Happy now', totalTrips: 52, badges: [mockBadges[1], mockBadges[2], mockBadges[5]], isOnline: false, distance: '1.2 km' },
  { id: 'u3', name: 'Mike Ross', nickname: 'Mikey', avatarUrl: 'https://picsum.photos/seed/u3/100/100', level: 'Goramax', status: 'Booked', totalTrips: 80, badges: [mockBadges[0], mockBadges[1], mockBadges[2], mockBadges[3]], isOnline: true, distance: '2.0 km' },
  { id: 'u4', name: 'Sarah L.', nickname: 'Sars', avatarUrl: 'https://picsum.photos/seed/u4/100/100', level: 'Gora X', status: 'Plan to go', totalTrips: 15, badges: [mockBadges[4]], isOnline: true, distance: '5.0 km' },
  // Inactive / Less active users for "Scratch back"
  { id: 'u5', name: 'Bob Dy', nickname: 'Bobby', avatarUrl: 'https://picsum.photos/seed/u5/100/100', level: 'Gora', status: 'Working', totalTrips: 2, badges: [], isOnline: false },
  { id: 'u6', name: 'Alice Guo', nickname: 'Ali', avatarUrl: 'https://picsum.photos/seed/u6/100/100', level: 'Gora', status: 'Working', totalTrips: 0, badges: [], isOnline: false },
];
