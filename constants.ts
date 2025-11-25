
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
        bio: "I've been guiding travelers in Bukidnon for over 10 years. I love sharing stories about our ancestral lands."
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

export const mockListings: Listing[] = [
  // BUKIDNON
  {
    id: '1', title: 'Dahilayan Adventure Park', location: 'Manolo Fortich, Bukidnon',
    rating: 4.8, reviews: 342, price: 1500, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1533234962703-2312c8742a8b?auto=format&fit=crop&w=800',
    lat: 8.219, lng: 124.877, isTrending: true,
    ...commonDetails,
    priceBreakdown: [{ item: "Park Entrance", amount: 500 }, { item: "Zipline Ride", amount: 700 }, { item: "Guide & Gear", amount: 300 }]
  },
  {
    id: '2', title: 'Mt. Kitanglad Range Trek', location: 'Impasug-ong, Bukidnon',
    rating: 4.9, reviews: 89, price: 3500, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800',
    lat: 8.132, lng: 124.918, isTrending: true,
    ...commonDetails,
    priceBreakdown: [{ item: "Permit Fee", amount: 1000 }, { item: "Guide Fee (2 Days)", amount: 2000 }, { item: "Porter (10kg)", amount: 500 }]
  },
  {
    id: '3', title: 'Kampo Juan', location: 'Manolo Fortich, Bukidnon',
    rating: 4.6, reviews: 120, price: 800, category: 'Experientials',
    imageUrl: 'https://images.unsplash.com/photo-1595964267468-d731885f8386?auto=format&fit=crop&w=800',
    lat: 8.358, lng: 124.821,
    ...commonDetails
  },
  {
    id: '4', title: 'Monastery of Transfiguration', location: 'Malaybalay, Bukidnon',
    rating: 4.9, reviews: 450, price: 0, category: 'Immersions',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=800',
    lat: 8.114, lng: 125.127,
    ...commonDetails,
    priceBreakdown: [{ item: "Donation (Optional)", amount: 0 }]
  },
  {
    id: '5', title: 'Kaamulan Festival', location: 'Malaybalay, Bukidnon',
    rating: 5.0, reviews: 1200, price: 500, category: 'Events',
    imageUrl: 'https://images.unsplash.com/photo-1589985236891-5cb317867dc8?auto=format&fit=crop&w=800',
    lat: 8.155, lng: 125.132, isTrending: true,
    ...commonDetails
  },
  {
    id: '6', title: 'Rotyponds Ridge', location: 'Impasug-ong, Bukidnon',
    rating: 4.7, reviews: 67, price: 1200, category: 'Riders',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800',
    lat: 8.356, lng: 125.021, isNew: true,
    ...commonDetails
  },
  {
    id: '7', title: 'Communal Ranch', location: 'Impasug-ong, Bukidnon',
    rating: 4.8, reviews: 210, price: 300, category: 'Experientials',
    imageUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=800',
    lat: 8.283, lng: 125.067,
    ...commonDetails
  },

  // MISAMIS ORIENTAL
  {
    id: '8', title: 'Seven Seas Waterpark', location: 'Opol, Misamis Oriental',
    rating: 4.7, reviews: 890, price: 1000, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1572331165267-854da2b00dc3?auto=format&fit=crop&w=800',
    lat: 8.514, lng: 124.597, isTrending: true,
    ...commonDetails
  },
  {
    id: '9', title: 'Claveria View Deck', location: 'Claveria, Misamis Oriental',
    rating: 4.6, reviews: 340, price: 100, category: 'Riders',
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800',
    lat: 8.650, lng: 124.917,
    ...commonDetails
  },
  {
    id: '10', title: 'Amaya View', location: 'Cagayan de Oro',
    rating: 4.8, reviews: 560, price: 1500, category: 'Eats',
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800',
    lat: 8.423, lng: 124.662,
    ...commonDetails
  },
  {
    id: '11', title: 'Duka Bay Resort', location: 'Medina, Misamis Oriental',
    rating: 4.5, reviews: 120, price: 2500, category: 'Stays',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800',
    lat: 8.917, lng: 125.033,
    ...commonDetails
  },
  {
    id: '12', title: 'Mangrove Planting', location: 'Opol, Misamis Oriental',
    rating: 4.9, reviews: 45, price: 0, category: 'Voluntourism',
    imageUrl: 'https://images.unsplash.com/photo-1464582883107-8adf2dca8a9f?auto=format&fit=crop&w=800',
    lat: 8.520, lng: 124.580, isNew: true,
    ...commonDetails
  },
  {
    id: '13', title: 'Lasang Secret Adventure', location: 'Initao, Misamis Oriental',
    rating: 4.4, reviews: 88, price: 500, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800',
    lat: 8.490, lng: 124.310,
    ...commonDetails
  },

  // LANAO DEL NORTE
  {
    id: '14', title: 'Tinago Falls', location: 'Iligan City, Lanao Del Norte',
    rating: 4.9, reviews: 670, price: 100, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800',
    lat: 8.158, lng: 124.187, isTrending: true,
    ...commonDetails
  },
  {
    id: '15', title: 'Maria Cristina Falls', location: 'Iligan City, Lanao Del Norte',
    rating: 4.8, reviews: 540, price: 100, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1533423797697-39d671295e26?auto=format&fit=crop&w=800',
    lat: 8.183, lng: 124.192,
    ...commonDetails
  },
  {
    id: '16', title: 'School Supply Drive', location: 'Munai, Lanao Del Norte',
    rating: 5.0, reviews: 12, price: 0, category: 'For a cause',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800',
    lat: 7.980, lng: 124.050, isNew: true,
    ...commonDetails
  },

  // MISAMIS OCCIDENTAL
  {
    id: '17', title: 'Hoyohoy Highland Chapel', location: 'Tangub City, Misamis Occ.',
    rating: 4.6, reviews: 90, price: 200, category: 'Experientials',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800',
    lat: 8.080, lng: 123.750,
    ...commonDetails
  },
  {
    id: '18', title: 'Cotta Fort', location: 'Ozamiz City, Misamis Occ.',
    rating: 4.5, reviews: 230, price: 50, category: 'Immersions',
    imageUrl: 'https://images.unsplash.com/photo-1599592237996-2679dc651475?auto=format&fit=crop&w=800',
    lat: 8.140, lng: 123.840,
    ...commonDetails
  },
  {
    id: '19', title: 'Lake Duminagat', location: 'Don Victoriano, Misamis Occ.',
    rating: 4.8, reviews: 30, price: 1000, category: 'Adventures',
    imageUrl: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=800',
    lat: 8.283, lng: 123.633, isNew: true,
    ...commonDetails
  },
  {
    id: '20', title: 'MisOcc Aquamarine Park', location: 'Sinacaban, Misamis Occ.',
    rating: 4.3, reviews: 150, price: 300, category: 'Stays',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800',
    lat: 8.280, lng: 123.800,
    ...commonDetails
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
  { id: 'u5', name: 'Bob Dy', nickname: 'Bobby', avatarUrl: 'https://picsum.photos/seed/u5/100/100', level: 'Gora', status: 'Working', totalTrips: 2, badges: [], isOnline: false },
  { id: 'u6', name: 'Alice Guo', nickname: 'Ali', avatarUrl: 'https://picsum.photos/seed/u6/100/100', level: 'Gora', status: 'Working', totalTrips: 0, badges: [], isOnline: false },
];
