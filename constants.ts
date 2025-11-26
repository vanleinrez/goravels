
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
  preferences: ['Adventures', 'Stays', 'Eats'],
  posts: mockPosts,
  badges: [mockBadges[0], mockBadges[1]]
};

const commonDetails = {
    description: "Immerse yourself in the breathtaking landscapes and rich culture of Northern Mindanao. This experience is curated to provide a balance of adventure and relaxation.",
    howToGetThere: "From Cagayan de Oro City, take a van or bus from Agora Terminal heading towards Bukidnon. Travel time is approximately 1.5 - 2 hours. Alight at the town proper where our shuttle will pick you up.",
    inclusions: ["Entrance Fees", "Local Guide", "Environmental Fee", "Welcome Drink", "Shuttle Service from Town"],
    rules: [
        { title: "Respect Local Culture", text: "Ask permission before taking photos of indigenous people.", icon: "📸" },
        { title: "Leave No Trace", text: "Bring your trash back with you. No littering allowed.", icon: "🌱" },
        { title: "Safety First", text: "Follow the guide's instructions at all times.", icon: "⛑️" }
    ],
    host: {
        name: "Kuya Ben",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200",
        role: "Certified Local Guide",
        bio: "I've been guiding travelers in Bukidnon for over 10 years. I love sharing stories about our ancestral lands and local traditions.",
        isVerified: true,
        joinedDate: "October 2018",
        languages: ["English", "Tagalog", "Cebuano", "Higaonon"],
        responseRate: 100,
        responseTime: "within an hour",
        badges: ["Licensed Guide", "First Aid Certified", "Community Leader", "Eco-Advocate"]
    },
    itinerary: [
        { time: "08:00 AM", activity: "Meet up at Town Plaza" },
        { time: "09:00 AM", activity: "Arrival at Site & Welcome Briefing" },
        { time: "09:30 AM", activity: "Start of Activity" },
        { time: "12:00 PM", activity: "Local Lunch (Optional add-on)" },
        { time: "02:00 PM", activity: "Free Time / Photo Op" },
        { time: "04:00 PM", activity: "Return to Town Proper" }
    ],
    refundPolicy: "Full refund if cancelled 48 hours before the trip. 50% refund if cancelled 24 hours before. No refund for same-day cancellation.",
};

const images = [
  'https://images.unsplash.com/photo-1533234962703-2312c8742a8b?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1595964267468-d731885f8386?auto=format&fit=crop&w=800',
  'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800'
];

export const mockListings: Listing[] = [
  // Listings content... (Truncated for brevity as it doesn't change)
  {
    id: '1', title: 'Dahilayan Adventure Park', location: 'Manolo Fortich, Bukidnon',
    rating: 4.8, reviews: 342, price: 1500, category: 'Adventures',
    imageUrl: images[0], images: images,
    lat: 8.219, lng: 124.877, isTrending: true, sponsorshipTier: 'Major',
    capacity: { type: 'Slots', value: 20 },
    ...commonDetails,
    priceBreakdown: [{ item: "Park Entrance", amount: 500 }, { item: "Zipline Ride", amount: 700 }, { item: "Guide & Gear", amount: 300 }]
  },
  // ... (Rest of listings)
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
    location: 'Bukidnon, Philippines',
    date: 'Oct 12 - 15, 2024',
    status: 'Upcoming',
    imageUrl: 'https://picsum.photos/seed/roadtrip/200/200'
  },
  {
    id: 't2',
    title: 'Camiguin Island',
    location: 'Camiguin, Philippines',
    date: 'Aug 5 - 8, 2024',
    status: 'Completed',
    imageUrl: 'https://picsum.photos/seed/camiguin/200/200'
  }
];

export const mockTravelers: Traveler[] = [
  { 
      id: 'u1', name: 'John Doe', nickname: 'Johny', avatarUrl: 'https://picsum.photos/seed/u1/100/100', 
      level: 'TaraGora', status: 'Gora', totalTrips: 24, badges: [mockBadges[0], mockBadges[4]], 
      isOnline: true, distance: '0.5 km',
      currentTrip: {
          id: 't1',
          title: 'Dahilayan Adventure',
          itineraryStatus: 'Ziplining at 800m',
          coords: { lat: 8.219, lng: 124.877 },
          host: { name: 'Kuya Ben', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=100&h=100' }
      }
  },
  { id: 'u2', name: 'Jane Smith', nickname: 'Janey', avatarUrl: 'https://picsum.photos/seed/u2/100/100', level: 'Goravels', status: 'Happy now', totalTrips: 52, badges: [mockBadges[1], mockBadges[2], mockBadges[5]], isOnline: false, distance: '1.2 km' },
  { id: 'u3', name: 'Mike Ross', nickname: 'Mikey', avatarUrl: 'https://picsum.photos/seed/u3/100/100', level: 'Goramax', status: 'Booked', totalTrips: 80, badges: [mockBadges[0], mockBadges[1], mockBadges[2], mockBadges[3]], isOnline: true, distance: '2.0 km' },
  { 
      id: 'u4', name: 'Sarah L.', nickname: 'Sars', avatarUrl: 'https://picsum.photos/seed/u4/100/100', 
      level: 'Gora X', status: 'Gora', totalTrips: 15, badges: [mockBadges[4]], 
      isOnline: true, distance: '0.8 km',
      isSosActive: true,
      sosMessage: 'Level 2 Risk: Lost in trail nearby. Needs guide assistance.',
      currentTrip: {
          id: 't2',
          title: 'Mt. Kitanglad Trek',
          itineraryStatus: 'Ascending to Summit',
          coords: { lat: 8.132, lng: 124.918 },
          host: { name: 'Guide Mario', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?fit=crop&w=100&h=100' }
      }
  },
  { id: 'u5', name: 'Bob Dy', nickname: 'Bobby', avatarUrl: 'https://picsum.photos/seed/u5/100/100', level: 'Gora', status: 'Working', totalTrips: 2, badges: [], isOnline: false },
  { id: 'u6', name: 'Alice Guo', nickname: 'Ali', avatarUrl: 'https://picsum.photos/seed/u6/100/100', level: 'Gora', status: 'Working', totalTrips: 0, badges: [], isOnline: false },
];
