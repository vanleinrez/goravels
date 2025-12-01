
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
  // --- ADVENTURES (4 Items) ---
  {
    id: 'adv1', title: 'Dahilayan Adventure Park', location: 'Manolo Fortich, Bukidnon',
    rating: 4.8, reviews: 342, price: 1500, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1533234962703-2312c8742a8b?auto=format&fit=crop&w=800', 
    images: images, lat: 8.219, lng: 124.877, isTrending: true, sponsorshipTier: 'Major',
    capacity: { type: 'Slots', value: 20 }, ...commonDetails
  },
  {
    id: 'adv2', title: 'Great White Water Rafting', location: 'Cagayan de Oro City',
    rating: 4.9, reviews: 520, price: 1200, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1520859690306-390649701f2b?auto=format&fit=crop&w=800', 
    lat: 8.454, lng: 124.631, isTrending: true,
    capacity: { type: 'Seats', value: 6 }, ...commonDetails
  },
  {
    id: 'adv3', title: 'Seven Seas Waterpark', location: 'Opol, Misamis Oriental',
    rating: 4.7, reviews: 890, price: 999, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1575425186775-b8de9a427e67?auto=format&fit=crop&w=800', 
    lat: 8.529, lng: 124.597,
    capacity: { type: 'Capacity', value: 200 }, ...commonDetails
  },
  {
    id: 'adv4', title: 'Mapawa Nature Park', location: 'Cagayan de Oro City',
    rating: 4.6, reviews: 150, price: 450, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800', 
    lat: 8.460, lng: 124.680,
    capacity: { type: 'Group Size', value: 10 }, ...commonDetails
  },

  // --- EXPERIENTIALS (3 Items) ---
  {
    id: 'exp1', title: 'Talaandig Soil Painting', location: 'Lantapan, Bukidnon',
    rating: 5.0, reviews: 85, price: 1800, category: 'Experientials',
    imageUrl: 'https://images.unsplash.com/photo-1459749411177-3c971a939907?auto=format&fit=crop&w=800', 
    lat: 8.157, lng: 124.993, isNew: true,
    capacity: { type: 'Slots', value: 5 }, ...commonDetails
  },
  {
    id: 'exp2', title: 'Pottery at Lanise', location: 'Claveria, Misamis Oriental',
    rating: 4.8, reviews: 45, price: 800, category: 'Experientials',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800', 
    lat: 8.611, lng: 124.908,
    capacity: { type: 'Slots', value: 8 }, ...commonDetails
  },
  {
    id: 'exp3', title: 'Pineapple Farm Tour', location: 'Manolo Fortich, Bukidnon',
    rating: 4.7, reviews: 210, price: 600, category: 'Experientials',
    imageUrl: 'https://images.unsplash.com/photo-1605218427360-69279a321d51?auto=format&fit=crop&w=800', 
    lat: 8.340, lng: 124.860,
    capacity: { type: 'Group Size', value: 15 }, ...commonDetails
  },

  // --- IMMERSIONS (3 Items) ---
  {
    id: 'imm1', title: 'Higaonon Cultural Village', location: 'Malaybalay City',
    rating: 4.9, reviews: 120, price: 2500, category: 'Immersions',
    imageUrl: 'https://images.unsplash.com/photo-1589985236891-5cb317867dc8?auto=format&fit=crop&w=800', 
    lat: 8.150, lng: 125.130, isTrending: true, sponsorshipTier: 'Minor',
    capacity: { type: 'Group Size', value: 4 }, ...commonDetails
  },
  {
    id: 'imm2', title: 'Coffee Farm Harvest', location: 'Talakag, Bukidnon',
    rating: 4.8, reviews: 95, price: 1200, category: 'Immersions',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800', 
    lat: 8.100, lng: 124.700,
    capacity: { type: 'Slots', value: 10 }, ...commonDetails
  },
  {
    id: 'imm3', title: 'Fisherfolk for a Day', location: 'Jasaan, Misamis Oriental',
    rating: 4.6, reviews: 60, price: 900, category: 'Immersions',
    imageUrl: 'https://images.unsplash.com/photo-1536675638148-43dd58334465?auto=format&fit=crop&w=800', 
    lat: 8.600, lng: 124.750,
    capacity: { type: 'Slots', value: 3 }, ...commonDetails
  },

  // --- STAYS (4 Items) ---
  {
    id: 'stay1', title: 'Ultra Winds Mountain Resort', location: 'Bukidnon',
    rating: 4.5, reviews: 400, price: 3500, category: 'Stays',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800', 
    lat: 8.400, lng: 124.650,
    capacity: { type: 'Room Size', value: '2-4' }, ...commonDetails
  },
  {
    id: 'stay2', title: 'Duka Bay Resort', location: 'Medina, Misamis Oriental',
    rating: 4.7, reviews: 310, price: 4500, category: 'Stays',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800', 
    lat: 8.900, lng: 125.000,
    capacity: { type: 'Room Size', value: '2-6' }, ...commonDetails
  },
  {
    id: 'stay3', title: 'Binahon Agroforestry', location: 'Lantapan, Bukidnon',
    rating: 4.8, reviews: 150, price: 2800, category: 'Stays',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800', 
    lat: 8.110, lng: 125.050,
    capacity: { type: 'Room Size', value: '2' }, ...commonDetails
  },
  {
    id: 'stay4', title: 'Amaya View', location: 'Indahag, Cagayan de Oro',
    rating: 4.6, reviews: 600, price: 2200, category: 'Stays',
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-66580f4f4645?auto=format&fit=crop&w=800', 
    lat: 8.420, lng: 124.670,
    capacity: { type: 'Room Size', value: '4' }, ...commonDetails
  },

  // --- RIDERS (3 Items) ---
  {
    id: 'ride1', title: 'Route 955 Motorbike Loop', location: 'Claveria to Gingoog',
    rating: 4.9, reviews: 50, price: 500, category: 'Riders',
    imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800', 
    lat: 8.650, lng: 125.050,
    capacity: { type: 'Group Size', value: 10 }, ...commonDetails
  },
  {
    id: 'ride2', title: 'Larry\'s Hill ATV', location: 'Cagayan de Oro',
    rating: 4.7, reviews: 120, price: 1000, category: 'Riders',
    imageUrl: 'https://images.unsplash.com/photo-1599368097657-25e9858525b6?auto=format&fit=crop&w=800', 
    lat: 8.430, lng: 124.660,
    capacity: { type: 'Slots', value: 5 }, ...commonDetails
  },
  {
    id: 'ride3', title: 'Lake Apo Bike Trail', location: 'Valencia City',
    rating: 4.8, reviews: 80, price: 300, category: 'Riders',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800', 
    lat: 7.900, lng: 125.090,
    capacity: { type: 'Group Size', value: 15 }, ...commonDetails
  },

  // --- EATS (4 Items) ---
  {
    id: 'eat1', title: 'Cucina Higala', location: 'Cagayan de Oro City',
    rating: 4.9, reviews: 900, price: 800, category: 'Eats',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800', 
    lat: 8.480, lng: 124.640, isTrending: true,
    capacity: { type: 'Seats', value: 40 }, ...commonDetails
  },
  {
    id: 'eat2', title: 'Del Monte Clubhouse', location: 'Manolo Fortich',
    rating: 4.8, reviews: 650, price: 1200, category: 'Eats',
    imageUrl: 'https://images.unsplash.com/photo-1514516602074-dd7899accfe8?auto=format&fit=crop&w=800', 
    lat: 8.350, lng: 124.850,
    capacity: { type: 'Seats', value: 50 }, ...commonDetails
  },
  {
    id: 'eat3', title: 'Sea Breeze Seafoods', location: 'Laguindingan',
    rating: 4.6, reviews: 320, price: 600, category: 'Eats',
    imageUrl: 'https://images.unsplash.com/photo-1598511726623-d219904a53e8?auto=format&fit=crop&w=800', 
    lat: 8.600, lng: 124.450,
    capacity: { type: 'Seats', value: 30 }, ...commonDetails
  },
  {
    id: 'eat4', title: 'Panagatan Restaurant', location: 'Opol, Misamis Oriental',
    rating: 4.7, reviews: 500, price: 900, category: 'Eats',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800', 
    lat: 8.520, lng: 124.570,
    capacity: { type: 'Seats', value: 60 }, ...commonDetails
  },

  // --- EVENTS (3 Items) ---
  {
    id: 'evt1', title: 'Kaamulan Festival', location: 'Malaybalay City',
    rating: 5.0, reviews: 2000, price: 0, category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=800', 
    lat: 8.155, lng: 125.130, isTrending: true, sponsorshipTier: 'Major',
    capacity: { type: 'Capacity', value: 'Open' }, ...commonDetails
  },
  {
    id: 'evt2', title: 'Higalaay Festival', location: 'Cagayan de Oro',
    rating: 4.8, reviews: 1500, price: 0, category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1514525253440-b39345208668?auto=format&fit=crop&w=800', 
    lat: 8.477, lng: 124.646,
    capacity: { type: 'Capacity', value: 'Open' }, ...commonDetails
  },
  {
    id: 'evt3', title: 'Lanzones Festival', location: 'Camiguin Island',
    rating: 4.9, reviews: 1200, price: 50, category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800', 
    lat: 9.180, lng: 124.710,
    capacity: { type: 'Capacity', value: 'Open' }, ...commonDetails
  },

  // --- VOLUNTOURISM (3 Items) ---
  {
    id: 'vol1', title: 'Coastal Cleanup Drive', location: 'Opol Beach',
    rating: 4.9, reviews: 40, price: 0, category: 'Voluntourism',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800', 
    lat: 8.510, lng: 124.550, isNew: true,
    capacity: { type: 'Slots', value: 50 }, ...commonDetails
  },
  {
    id: 'vol2', title: 'Mangrove Planting', location: 'El Salvador City',
    rating: 5.0, reviews: 60, price: 100, category: 'Voluntourism',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800', 
    lat: 8.550, lng: 124.500,
    capacity: { type: 'Slots', value: 30 }, ...commonDetails
  },
  {
    id: 'vol3', title: 'School Painting Drive', location: 'Remote Barangays',
    rating: 4.8, reviews: 25, price: 0, category: 'Voluntourism',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800', 
    lat: 8.200, lng: 124.900,
    capacity: { type: 'Slots', value: 15 }, ...commonDetails
  },

  // --- FOR A CAUSE (3 Items) ---
  {
    id: 'cause1', title: 'Support Local Weavers', location: 'Bukidnon',
    rating: 5.0, reviews: 110, price: 500, category: 'For a cause',
    imageUrl: 'https://images.unsplash.com/photo-1605218427360-69279a321d51?auto=format&fit=crop&w=800', 
    lat: 8.140, lng: 125.120, isTrending: true,
    capacity: { type: 'Capacity', value: 'Unlimited' }, ...commonDetails
  },
  {
    id: 'cause2', title: 'Organic Veggie Drive', location: 'Impasug-ong',
    rating: 4.9, reviews: 90, price: 300, category: 'For a cause',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800', 
    lat: 8.120, lng: 124.950,
    capacity: { type: 'Capacity', value: 'Unlimited' }, ...commonDetails
  },
  {
    id: 'cause3', title: 'Book Donation Hub', location: 'CDO Public Schools',
    rating: 5.0, reviews: 30, price: 0, category: 'For a cause',
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800', 
    lat: 8.490, lng: 124.620,
    capacity: { type: 'Capacity', value: 'Box' }, ...commonDetails
  }
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
