
import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { User, ListingCategory, Listing, Trip, Notification, PaymentMethod } from '../types';
import { mockListings, mockSafetyZones } from '../constants';
import ListingCard from '../components/ListingCard';
import Icon from '../components/Icon';
import MapView, { MapViewHandle, MapLayerType } from '../components/MapView';

interface DiscoverScreenProps {
  user: User;
  onRegister: () => void;
  onAddTrip?: (trip: Trip) => void;
  onAddNotification?: (notification: Notification) => void;
  onProfileClick: () => void;
  onMessageHost?: () => void;
}

type ViewMode = 'list' | 'map';
type BookingStep = 'overview' | 'details' | 'payment' | 'host-profile' | 'success';

const CATEGORIES: { id: ListingCategory | 'All'; label: string; icon: string }[] = [
    { id: 'All', label: 'All', icon: '🌍' },
    { id: 'Adventures', label: 'Adventures', icon: '🧗' },
    { id: 'Experientials', label: 'Experientials', icon: '🎨' },
    { id: 'Immersions', label: 'Immersions', icon: '🛖' },
    { id: 'Stays', label: 'Stays', icon: '🏠' },
    { id: 'Riders', label: 'Riders', icon: '🏍️' },
    { id: 'Eats', label: 'Eats', icon: '🍲' },
    { id: 'Events', label: 'Events', icon: '🎉' },
    { id: 'Voluntourism', label: 'Voluntourism', icon: '🌱' },
    { id: 'For a cause', label: 'For a cause', icon: '🤝' },
];

const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'gcash', name: 'GCash', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/1200px-GCash_logo.svg.png', feePercentage: 0.02 },
    { id: 'maya', name: 'Maya', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Maya_logo.svg/1200px-Maya_logo.svg.png', feePercentage: 0.015 },
    { id: 'card', name: 'Credit/Debit Card', icon: 'https://cdn-icons-png.flaticon.com/512/6963/6963703.png', feePercentage: 0.035 },
    { id: 'counter', name: 'Over-the-Counter', icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png', feePercentage: 0.01 }
];

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ user, onRegister, onAddTrip, onAddNotification, onProfileClick, onMessageHost }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAlert, setShowAlert] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Discover Rural State
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(5);
  
  // Map State
  const [mapRadius, setMapRadius] = useState(20); // Default 20km
  const [mapLayer, setMapLayer] = useState<MapLayerType>('standard');
  const [mapPitch, setMapPitch] = useState(0);
  const [mapBearing, setMapBearing] = useState(0);
  
  // Location State
  const [userLocation, setUserLocation] = useState({ lat: 8.4542, lng: 124.6319 }); // Default CDO Fallback
  const [isLocating, setIsLocating] = useState(false);
  
  const [navigationRoute, setNavigationRoute] = useState<{from: {lat:number, lng:number}, to: {lat:number, lng:number}} | null>(null);

  // Listing Details & Booking
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>('overview');
  const [bookedListings, setBookedListings] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Payment State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('gcash');
  const [discountCode, setDiscountCode] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Map Controller Ref
  const mapRef = useRef<MapViewHandle>(null);

  // Initial Geolocation
  useEffect(() => {
    handleLocateMe();
  }, []);

  // Reset image carousel when listing changes
  useEffect(() => {
      setCurrentImageIndex(0);
  }, [selectedListing]);

  // Determine Avatar based on Gender
  const getAvatar = () => {
    if (user.tier === 'Guest') {
        // Generic Icon
        return null; 
    }
    if (user.avatarUrl) return user.avatarUrl;

    if (user.gender === 'Male') return 'https://cdn-icons-png.flaticon.com/512/4128/4128176.png';
    if (user.gender === 'Female') return 'https://cdn-icons-png.flaticon.com/512/4128/4128262.png';
    return 'https://cdn-icons-png.flaticon.com/512/847/847969.png'; // Neutral
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setUserLocation(newLoc);
        setIsLocating(false);
        
        // Fly to new location
        if (mapRef.current) {
            mapRef.current.flyTo(latitude, longitude);
        }
      },
      (error) => {
        console.error(`Error retrieving location: ${error.message} (Code: ${error.code})`);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000, // Increased timeout to 20s
        maximumAge: 0
      }
    );
  };

  const handleListingClick = (listing: Listing) => {
    setSelectedListing(listing);
    setBookingStep('overview');
  };

  const handleHostProfileClick = () => {
      if (user.tier === 'Guest') {
          onRegister(); // Trigger restricted modal
      } else {
          setBookingStep('host-profile');
      }
  };

  const handleProceedToPayment = () => {
      if (user.tier === 'Guest') {
          // Trigger the App-level restricted access modal via the prop
          onRegister(); 
      } else {
          setBookingStep('payment');
      }
  };

  const handleBook = () => {
      setIsProcessingPayment(true);
      // Simulate Payment Processing
      setTimeout(() => {
          if (selectedListing) {
            // 1. Add to Local State
            setBookedListings(prev => [...prev, selectedListing.id]);
            
            // 2. Add to Global Planner
            if (onAddTrip) {
                const newTrip: Trip = {
                    id: `trip-${Date.now()}`,
                    title: selectedListing.title,
                    location: selectedListing.location,
                    date: 'Oct 28 - 30, 2024', // Mock date
                    status: 'Upcoming',
                    imageUrl: selectedListing.imageUrl,
                    price: selectedListing.price
                };
                onAddTrip(newTrip);
            }

            // 3. Trigger Notification
            if (onAddNotification) {
                onAddNotification({
                    id: `notif-${Date.now()}`,
                    type: 'payment_success',
                    title: 'Payment Successful',
                    message: `Booking for ${selectedListing.title} confirmed. View status in notifications.`,
                    time: 'Just now',
                    read: false
                });
            }
            
            // Go to Success Screen
            setBookingStep('success');
            setIsProcessingPayment(false);
          }
      }, 2000);
  };

  const handleGetDirection = () => {
      if (selectedListing) {
          setSelectedListing(null);
          setViewMode('map');
          setMapLayer('standard');
          setNavigationRoute({
              from: userLocation,
              to: { lat: selectedListing.lat, lng: selectedListing.lng }
          });
          setMapPitch(60);
          setMapBearing(0);
      }
  };

  const resetNorth = () => {
      setMapBearing(0);
      setMapPitch(0);
  };

  const rotateMap = (deg: number) => {
      setMapBearing(prev => prev + deg);
  };

  const handleDiscoverClick = () => {
      setIsDiscovering(true);
      setDisplayLimit(5);
  };

  const handleShowMore = () => {
      setDisplayLimit(prev => prev + 5);
  };
  
  const handleGoTop = () => {
      const main = document.querySelector('main');
      if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic to process listings
  const visibleListings = useMemo(() => {
      const filtered = mockListings.filter(l => {
          const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
          const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                l.location.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
      });

      const sponsored = filtered.filter(l => !!l.sponsorshipTier);
      const organic = filtered.filter(l => !l.sponsorshipTier);
      const shuffledSponsored = [...sponsored].sort(() => Math.random() - 0.5);
      const sortedOrganic = [...organic].sort(() => Math.random() - 0.5);

      return [...shuffledSponsored, ...sortedOrganic];
  }, [selectedCategory, searchQuery]);

  // Map view logic
  const mapListings = visibleListings.filter(l => {
      const R = 6371; // km
      const dLat = (l.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (l.lng - userLocation.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(l.lat * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance <= mapRadius;
  });

  const suggestedListings = mockListings.filter(l => 
    user.preferences?.includes(l.category) || l.rating >= 4.8
  ).slice(0, 5);

  const ViewToggleButton: React.FC<{
    mode: ViewMode;
    label: string;
    children: React.ReactNode;
  }> = ({ mode, children, label }) => (
    <button
      onClick={() => { setViewMode(mode); setNavigationRoute(null); setMapPitch(0); setMapBearing(0); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
        viewMode === mode
          ? 'bg-emerald-600 text-white shadow-md scale-105'
          : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
      }`}
    >
      {children}
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  const renderModalContent = () => {
    if (!selectedListing) return null;

    // --- STEP 4: PAYMENT SUCCESS ---
    if (bookingStep === 'success') {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-stone-50 p-6 text-center animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                    <Icon className="w-12 h-12"><polyline points="20 6 9 17 4 12" /></Icon>
                </div>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Payment Processing</h2>
                <p className="text-stone-500 mb-8 max-w-xs">
                    Your payment is being processed. You can check your notification for payment status updates.
                </p>
                <div className="w-full space-y-3">
                    <button 
                        onClick={() => { 
                            if(onMessageHost) onMessageHost();
                            setSelectedListing(null); 
                            setBookingStep('overview'); 
                        }}
                        className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center"
                    >
                        <Icon className="w-5 h-5 mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>
                        Message Host
                    </button>
                    <button 
                        onClick={() => { setSelectedListing(null); setBookingStep('overview'); }}
                        className="w-full bg-white text-stone-600 py-4 rounded-xl font-bold border border-stone-200 hover:bg-stone-50"
                    >
                        Continue Searching
                    </button>
                </div>
            </div>
        );
    }

    // --- STEP: HOST PROFILE ---
    if (bookingStep === 'host-profile' && selectedListing.host) {
        const host = selectedListing.host;
        return (
            <>
                <div className="bg-white px-4 py-4 pt-12 sm:py-3 sm:pt-3 border-b border-stone-200 flex items-center sticky top-0 z-30 shadow-sm shrink-0">
                    <button onClick={() => setBookingStep('details')} className="p-2 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full transition-colors">
                        <Icon className="w-5 h-5"><path d="m15 18-6-6 6-6"/></Icon>
                    </button>
                    <h2 className="ml-2 font-bold text-stone-800">Host Profile</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-stone-50/50 space-y-6">
                    {/* Hero Profile Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col items-center text-center">
                        <div className="relative mb-3">
                             <img src={host.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" alt={host.name} />
                             {host.isVerified && (
                                 <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Identity Verified">
                                     <Icon className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>
                                 </div>
                             )}
                        </div>
                        <h2 className="text-xl font-bold text-stone-800 flex items-center justify-center">
                            {host.name}
                        </h2>
                        <p className="text-sm font-bold text-emerald-600 mb-4">{host.role}</p>

                        <div className="grid grid-cols-3 gap-4 w-full border-t border-stone-100 pt-4">
                            <div>
                                <p className="font-bold text-stone-800 text-lg">4.9</p>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wide">Rating</p>
                            </div>
                            <div className="border-l border-stone-100">
                                <p className="font-bold text-stone-800 text-lg">124</p>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wide">Reviews</p>
                            </div>
                            <div className="border-l border-stone-100">
                                <p className="font-bold text-stone-800 text-lg">5</p>
                                <p className="text-[10px] text-stone-500 uppercase tracking-wide">Years</p>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                         <h3 className="font-bold text-stone-800 mb-3">About {host.name.split(' ')[0]}</h3>
                         <p className="text-sm text-stone-600 leading-relaxed mb-4">
                             {host.bio || `Hi, I'm ${host.name}! I love sharing the beauty of my hometown.`}
                         </p>
                         <div className="flex flex-wrap gap-2 mb-4">
                             {host.languages?.map(lang => (
                                 <span key={lang} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-lg font-medium">{lang}</span>
                             ))}
                         </div>
                    </div>
                </div>
            </>
        );
    }
    
    // --- STEP 1: LISTING REVIEW (OVERVIEW) ---
    if (bookingStep === 'overview') {
        const images = selectedListing.images || [selectedListing.imageUrl];
        
        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Image Carousel */}
                <div className="relative h-64 sm:h-56 w-full flex-shrink-0 group">
                    <img src={images[currentImageIndex]} alt={selectedListing.title} className="w-full h-full object-cover transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-60"></div>
                    
                    <button 
                        onClick={() => setSelectedListing(null)}
                        className="absolute top-8 sm:top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/50 transition-colors z-20"
                    >
                        <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                    </button>
                    
                    {/* Carousel Controls */}
                    {images.length > 1 && (
                        <>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
                                {images.map((_, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}></div>
                                ))}
                            </div>
                            <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white p-1 rounded-full"><Icon className="w-5 h-5"><polyline points="15 18 9 12 15 6" /></Icon></button>
                            <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white p-1 rounded-full"><Icon className="w-5 h-5"><polyline points="9 18 15 12 9 6" /></Icon></button>
                        </>
                    )}
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="bg-emerald-600/10 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-1 inline-block">{selectedListing.category}</span>
                            <h2 className="text-2xl font-bold text-stone-800 leading-tight">{selectedListing.title}</h2>
                            <p className="text-stone-500 flex items-center mt-1 text-sm">
                                <Icon className="w-4 h-4 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                {selectedListing.location}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                             <div className="flex items-center text-xs text-stone-500 mb-1">
                                <span className="text-yellow-400 mr-1">★</span> 
                                <span className="font-bold text-stone-800">{selectedListing.rating}</span>
                                <span className="ml-1">({selectedListing.reviews})</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-stone-600 text-sm leading-relaxed mb-6 mt-4">
                        {selectedListing.description || `Experience the authentic charm of ${selectedListing.location}.`}
                    </p>

                    {/* Specific Capacity Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                <Icon className="w-4 h-4"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-stone-500 uppercase">Duration</p>
                                <p className="font-bold text-stone-800 text-sm">Day Trip</p>
                            </div>
                        </div>
                        {selectedListing.capacity && (
                             <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex items-center">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                                     <Icon className="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></Icon>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-stone-500 uppercase">{selectedListing.capacity.type}</p>
                                    <p className="font-bold text-stone-800 text-sm">{selectedListing.capacity.value} {selectedListing.capacity.unit}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-stone-800">Location</h3>
                        </div>
                        <div className="h-32 w-full rounded-xl overflow-hidden relative bg-stone-100 border border-stone-200">
                                <MapView 
                                    listings={[selectedListing]} 
                                    userLocation={{lat: selectedListing.lat, lng: selectedListing.lng}} 
                                    radiusKm={0} 
                                    layerType="standard"
                                    pitch={0}
                                    bearing={0}
                                />
                                <div className="absolute inset-0 pointer-events-none border-2 border-stone-100/50 rounded-xl"></div>
                        </div>
                    </div>

                    {/* Footer Content */}
                    <div className="pt-6 mt-4 border-t border-stone-100 pb-12">
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="text-stone-500 text-xs font-bold uppercase">Price</p>
                                <p className="text-2xl font-bold text-emerald-700">
                                    {selectedListing.price > 0 ? `₱${selectedListing.price}` : 'Free'}
                                </p>
                            </div>

                            {bookedListings.includes(selectedListing.id) ? (
                                <button 
                                    onClick={handleGetDirection}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center"
                                >
                                    <Icon className="w-5 h-5 mr-2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>
                                    Get Direction
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setBookingStep('details')}
                                    className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center hover:bg-stone-800"
                                >
                                    Details
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // --- STEP 2: DISCOVERY DETAILS ---
     if (bookingStep === 'details') {
         return (
             <div className="p-6 bg-white h-full overflow-y-auto">
                 <div className="flex items-center mb-6 sticky top-0 bg-white z-10 py-2 border-b border-stone-50">
                    <button onClick={() => setBookingStep('overview')} className="mr-2 text-stone-500 hover:bg-stone-100 p-2 rounded-full">
                        <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
                    </button>
                    <h2 className="font-bold text-lg text-stone-800">Discovery Details</h2>
                 </div>

                 <div className="space-y-8 pb-10">
                     {/* Host Profile Link */}
                     {selectedListing.host && (
                         <div onClick={handleHostProfileClick} className="bg-stone-50 p-4 rounded-xl border border-stone-100 flex items-center justify-between cursor-pointer hover:bg-stone-100 transition-colors">
                             <div className="flex items-center space-x-3">
                                 <img src={selectedListing.host.avatar} className="w-10 h-10 rounded-full object-cover" />
                                 <div>
                                     <p className="text-xs font-bold text-stone-500 uppercase">Hosted By</p>
                                     <p className="font-bold text-stone-800 text-sm">{selectedListing.host.name}</p>
                                 </div>
                             </div>
                             <Icon className="w-5 h-5 text-stone-400"><polyline points="9 18 15 12 9 6" /></Icon>
                         </div>
                     )}

                     <div>
                        <h3 className="font-bold text-stone-800 mb-3 flex items-center"><Icon className="w-5 h-5 mr-2 text-emerald-600"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon> Itinerary</h3>
                        <div className="space-y-0 border-l-2 border-stone-200 ml-2.5">
                            {selectedListing.itinerary?.map((item, i) => (
                                <div key={i} className="relative pl-6 pb-6 last:pb-0">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-300 ring-4 ring-white"></div>
                                    <p className="text-xs font-bold text-stone-500 mb-0.5">{item.time}</p>
                                    <p className="text-sm text-stone-800 font-medium">{item.activity}</p>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="bg-stone-50 p-4 rounded-xl">
                        <h3 className="font-bold text-stone-800 mb-2 text-sm">Inclusions</h3>
                        <ul className="grid grid-cols-2 gap-2">
                            {selectedListing.inclusions?.map((inc, i) => (
                                <li key={i} className="text-xs text-stone-600 flex items-center">
                                    <Icon className="w-3 h-3 text-emerald-500 mr-2"><polyline points="20 6 9 17 4 12"/></Icon> {inc}
                                </li>
                            ))}
                        </ul>
                     </div>

                     <div>
                         <h3 className="font-bold text-stone-800 mb-3">House Rules</h3>
                         <div className="space-y-3">
                             {selectedListing.rules?.map((rule, i) => (
                                 <div key={i} className="flex items-start">
                                     <span className="text-lg mr-3">{rule.icon}</span>
                                     <div>
                                         <p className="font-bold text-stone-800 text-xs">{rule.title}</p>
                                         <p className="text-xs text-stone-500">{rule.text}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-stone-100">
                    <button 
                        onClick={handleProceedToPayment} 
                        className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95"
                    >
                        Proceed to Payment
                    </button>
                 </div>
             </div>
         );
     }

     // --- STEP 3: PAYMENT SCREEN ---
     if (bookingStep === 'payment') {
         const selectedMethod = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod);
         const basePrice = selectedListing.price;
         const gatewayFee = basePrice * (selectedMethod?.feePercentage || 0);
         const discountAmount = discountCode === 'GORA10' ? basePrice * 0.1 : 0;
         const total = basePrice + gatewayFee - discountAmount;

         return (
             <div className="p-6 bg-white h-full overflow-y-auto">
                 <div className="flex items-center mb-6">
                    <button onClick={() => setBookingStep('details')} className="mr-2 text-stone-500 hover:bg-stone-100 p-2 rounded-full">
                        <Icon className="w-6 h-6"><path d="m15 18-6-6 6-6"/></Icon>
                    </button>
                    <h2 className="font-bold text-lg text-stone-800">Payment</h2>
                 </div>

                 <div className="space-y-6 pb-12">
                     {/* Payment Method Selection */}
                     <div>
                         <h3 className="font-bold text-stone-800 mb-3 text-sm uppercase text-stone-400">Select Payment Method</h3>
                         <div className="space-y-2">
                             {PAYMENT_METHODS.map(method => (
                                 <div 
                                    key={method.id} 
                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                                        selectedPaymentMethod === method.id 
                                        ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' 
                                        : 'border-stone-200 bg-white hover:bg-stone-50'
                                    }`}
                                 >
                                     <img src={method.icon} alt={method.name} className="w-8 h-8 object-contain mr-3" />
                                     <div className="flex-1">
                                         <p className="font-bold text-sm text-stone-800">{method.name}</p>
                                         <p className="text-[10px] text-stone-500">Service Fee: {(method.feePercentage * 100).toFixed(1)}%</p>
                                     </div>
                                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPaymentMethod === method.id ? 'border-emerald-500' : 'border-stone-300'}`}>
                                         {selectedPaymentMethod === method.id && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>

                     {/* Order Summary */}
                     <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                         <h3 className="font-bold text-stone-800 mb-4 border-b border-stone-200 pb-2">Order Summary</h3>
                         <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                                 <span className="text-stone-600">{selectedListing.title}</span>
                                 <span className="font-medium">₱{basePrice.toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between">
                                 <span className="text-stone-600">Service Fee ({selectedMethod?.name})</span>
                                 <span className="font-medium">₱{gatewayFee.toFixed(2)}</span>
                             </div>
                             {discountAmount > 0 && (
                                 <div className="flex justify-between text-emerald-600">
                                     <span>Discount (GORA10)</span>
                                     <span>-₱{discountAmount.toFixed(2)}</span>
                                 </div>
                             )}
                             <div className="flex justify-between pt-3 border-t border-stone-200 mt-2">
                                 <span className="font-bold text-stone-800 text-lg">Total</span>
                                 <span className="font-bold text-stone-800 text-lg">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                             </div>
                         </div>
                     </div>

                     {/* Discount Code */}
                     <div>
                         <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Discount Code</label>
                         <div className="flex space-x-2">
                             <input 
                                type="text" 
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                placeholder="Enter code"
                                className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                             />
                             <button 
                                className="bg-stone-200 text-stone-600 px-4 rounded-lg text-xs font-bold hover:bg-stone-300"
                                onClick={() => {}} // Just visual for now
                             >
                                 Apply
                             </button>
                         </div>
                     </div>

                     {/* Terms */}
                     <div className="text-[10px] text-stone-500 bg-stone-50 p-3 rounded-lg">
                         <p className="mb-2"><span className="font-bold">Refund Policy:</span> {selectedListing.refundPolicy}</p>
                         <p>By confirming, you agree to the <span className="underline cursor-pointer">Terms & Conditions</span>.</p>
                     </div>
                     
                     <button onClick={handleBook} disabled={isProcessingPayment} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center shadow-lg active:scale-95 transition-all">
                         {isProcessingPayment ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing Payment...
                            </>
                         ) : 'Confirm Payment'}
                     </button>
                 </div>
             </div>
         );
     }
  };

  const avatarSrc = getAvatar();

  return (
    <div className="bg-stone-50 min-h-full pb-20 relative">
      
      {/* --- LISTING DETAILS MODAL --- */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-sm transition-opacity"
                onClick={() => { if(!isProcessingPayment) setSelectedListing(null); }}
            ></div>
            
            {/* Modal Card - Full screen on Mobile, Modal on Desktop */}
            <div className={`bg-white w-full h-full sm:h-[85vh] sm:w-full sm:max-w-md sm:rounded-2xl shadow-2xl pointer-events-auto relative animate-slide-in-right flex flex-col overflow-hidden transition-all duration-300`}>
                {renderModalContent()}
            </div>
        </div>
      )}
      
      {/* ... Rest of component ... */}
      
      {/* Weather Alert Banner */}
      {showAlert && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3 flex justify-between items-start animate-fade-in sticky top-0 z-30">
          <div className="flex items-start space-x-2">
            <Icon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </Icon>
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">Weather Alert</p>
              <p className="text-sm text-amber-900 leading-tight mt-0.5">Heavy rains expected in Bukidnon region.</p>
            </div>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-amber-700 hover:text-amber-900">
            <Icon className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
          </button>
        </div>
      )}

      <div className="p-4 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <p className="text-stone-500 text-sm font-medium">
              {user.tier === 'Guest' ? 'Mabuhay!' : 'Mabuhay,'}
            </p>
            <h1 className="text-2xl font-bold text-stone-800">
              {user.tier === 'Guest' ? user.name : `${user.name.split(' ')[0]}!`}
            </h1>
          </div>
          <div 
            onClick={onProfileClick}
            className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 relative overflow-hidden shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-300 transition-all"
          >
             {avatarSrc ? (
                <img src={avatarSrc} alt="User" className="w-full h-full object-cover" />
             ) : (
                <Icon className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
             )}
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search adventures in Northern Mindanao..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none text-stone-700 placeholder-stone-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            <Icon className="w-5 h-5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Icon>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center justify-center space-x-4">
          <ViewToggleButton mode="list" label="Explore">
            <Icon className="w-4 h-4"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></Icon>
          </ViewToggleButton>
          <ViewToggleButton mode="map" label="Map View">
            <Icon className="w-4 h-4"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /></Icon>
          </ViewToggleButton>
        </div>

        {/* Category Filters */}
        <div>
            <div className="flex overflow-x-auto space-x-2 pb-2 -mx-4 px-4 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors border ${
                            selectedCategory === cat.id 
                            ? 'bg-stone-900 text-white border-stone-900' 
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                    >
                        <span>{cat.icon}</span>
                        <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {viewMode === 'list' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Suggested For You - Only show if no search query */}
            {suggestedListings.length > 0 && selectedCategory === 'All' && !searchQuery && (
                <div>
                   <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center">
                       Suggested for You
                       <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Personalized</span>
                   </h2>
                   <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 scrollbar-hide">
                      {suggestedListings.map(listing => (
                          <div key={listing.id} onClick={() => handleListingClick(listing)}>
                             <ListingCard listing={listing} />
                          </div>
                      ))}
                   </div>
                </div>
            )}

            {/* Campaign Banner - Only show if no search query */}
            {!searchQuery && (
                <div onClick={() => handleListingClick(mockListings[0])} className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
                <div className="relative z-10">
                    <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Featured Campaign</span>
                    <h2 className="font-bold text-xl mt-2">Tara sa Bukidnon! 🏔️</h2>
                    <p className="text-sm mt-1 mb-4 opacity-90">Experience the highlands of Northern Mindanao. Get 20% off on stays.</p>
                    <button className="bg-white text-emerald-700 font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-stone-100 transition-colors">
                    View Offers
                    </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20">
                    <Icon className="w-32 h-32"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></Icon>
                </div>
                </div>
            )}

            {/* Trending Now - Only show if no search query */}
            {!searchQuery && selectedCategory === 'All' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-stone-800 flex items-center">
                            <Icon className="w-5 h-5 text-orange-500 mr-2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12 17 12" /></Icon>
                            Trending Now
                        </h2>
                        <button className="text-xs font-bold text-emerald-600">See All</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {mockListings.filter(l => l.isTrending).map(listing => (
                        <div key={listing.id} onClick={() => handleListingClick(listing)} className="flex bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden cursor-pointer active:scale-95 transition-transform">
                            <img src={listing.imageUrl} alt={listing.title} className="w-24 h-24 object-cover" />
                            <div className="p-3 flex-1 flex flex-col justify-center">
                            <h3 className="font-bold text-stone-800 text-sm mb-1">{listing.title}</h3>
                            <p className="text-xs text-stone-500 mb-2">{listing.location}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-emerald-600 font-bold text-sm">₱{listing.price}</span>
                                <div className="flex items-center text-[10px] text-stone-400">
                                    <span className="text-yellow-400 mr-1">★</span> {listing.rating}
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Discover Rural / All Listings Section */}
            <div className="mt-8">
               {!isDiscovering ? (
                   <div className="flex flex-col items-center justify-center space-y-4 py-8">
                       <button 
                           onClick={handleDiscoverClick}
                           className="group relative w-full overflow-hidden rounded-2xl shadow-lg transition-transform active:scale-95"
                       >
                           <div className="absolute inset-0 bg-stone-900 group-hover:scale-105 transition-transform duration-700">
                                <img src="https://images.unsplash.com/photo-1518182170546-0766ba6f9285?auto=format&fit=crop&w=800" className="w-full h-full object-cover opacity-50" />
                           </div>
                           <div className="relative p-8 text-center">
                               <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter">Discover Rural</h2>
                               <p className="text-stone-200 text-sm font-medium mb-4">Explore hidden gems and sponsored adventures</p>
                               <span className="inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm group-hover:bg-emerald-500 transition-colors">
                                   Start Browsing <Icon className="w-4 h-4 ml-2"><path d="M5 12h14M12 5l7 7-7 7"/></Icon>
                               </span>
                           </div>
                       </button>
                   </div>
               ) : (
                   <div className="animate-fade-in">
                       <div className="flex justify-between items-center mb-6">
                           <h2 className="text-xl font-bold text-stone-800">
                               {selectedCategory === 'All' ? 'Discovering Rural' : selectedCategory}
                           </h2>
                           <button onClick={() => setIsDiscovering(false)} className="text-xs font-bold text-stone-500 hover:text-stone-800">Close View</button>
                       </div>
                       
                       <div className="space-y-6">
                          {visibleListings.slice(0, displayLimit).map(listing => (
                              <div key={listing.id} onClick={() => handleListingClick(listing)} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden cursor-pointer active:scale-95 transition-transform relative group">
                                  <div className="h-48 relative">
                                      <img src={listing.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                      
                                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-xs font-bold">
                                          {listing.category}
                                      </div>
                                      
                                      {listing.sponsorshipTier && (
                                          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center">
                                              {listing.sponsorshipTier === 'Major' ? 'Featured' : 'Sponsored'}
                                          </div>
                                      )}

                                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                          <div>
                                              <h3 className="font-bold text-lg text-white leading-tight">{listing.title}</h3>
                                              <p className="text-stone-200 text-xs flex items-center mt-0.5">
                                                  <Icon className="w-3 h-3 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                                  {listing.location}
                                              </p>
                                          </div>
                                          <div className="bg-white/90 backdrop-blur text-stone-800 px-2 py-1 rounded-lg text-xs font-bold">
                                              ₱{listing.price}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="p-4">
                                      <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed mb-3">
                                          {listing.description || `Discover the beauty of ${listing.location}. A perfect getaway for ${listing.category} lovers.`}
                                      </p>
                                      <div className="flex justify-between items-center border-t border-stone-100 pt-3">
                                          <div className="flex items-center text-xs text-stone-500">
                                              <Icon className="w-3 h-3 text-yellow-400 fill-current mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
                                              <span className="font-bold text-stone-700 mr-1">{listing.rating}</span> 
                                              ({listing.reviews} reviews)
                                          </div>
                                          <span className="text-xs font-bold text-emerald-600">View Details</span>
                                      </div>
                                  </div>
                              </div>
                          ))}
                       </div>

                       <div className="mt-8 flex flex-col items-center space-y-4 pb-8">
                           {displayLimit < visibleListings.length ? (
                               <div className="flex flex-col items-center w-full">
                                   <p className="text-xs text-stone-400 mb-2">Showing {Math.min(displayLimit, visibleListings.length)} of {visibleListings.length}</p>
                                   <button 
                                       onClick={handleShowMore} 
                                       className="w-full py-3 bg-white border border-stone-200 text-stone-600 font-bold rounded-xl shadow-sm hover:bg-stone-50 active:scale-95 transition-transform"
                                   >
                                       Show More Listings
                                   </button>
                               </div>
                           ) : (
                               <p className="text-stone-400 text-sm font-medium">You've reached the end!</p>
                           )}
                           
                           <button 
                               onClick={handleGoTop}
                               className="flex items-center text-stone-400 hover:text-emerald-600 text-sm font-bold transition-colors"
                           >
                               <Icon className="w-4 h-4 mr-1"><path d="M12 19V5M5 12l7-7 7 7"/></Icon>
                               Go Top
                           </button>
                       </div>
                   </div>
               )}
            </div>

          </div>
        ) : (
          <div className="h-[calc(100vh-250px)] w-full rounded-2xl overflow-hidden shadow-inner border border-stone-200 relative animate-fade-in">
            <MapView 
                ref={mapRef}
                listings={mapListings} 
                safetyZones={mockSafetyZones}
                radiusKm={mapRadius}
                userLocation={userLocation}
                pitch={mapPitch}
                bearing={mapBearing}
                layerType={mapLayer}
                route={navigationRoute}
            />
            
            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button onClick={() => mapRef.current?.zoomIn()} className="bg-white p-2 rounded-lg shadow-md text-stone-600 hover:bg-stone-50"><Icon className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon></button>
                <button onClick={() => mapRef.current?.zoomOut()} className="bg-white p-2 rounded-lg shadow-md text-stone-600 hover:bg-stone-50"><Icon className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/></Icon></button>
                <button onClick={() => mapRef.current?.centerOnUser()} className={`p-2 rounded-lg shadow-md transition-colors ${isLocating ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-white text-stone-600 hover:bg-stone-50'}`}>
                    <Icon className="w-5 h-5"><path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z"/><circle cx="12" cy="10" r="3"/></Icon>
                </button>
                <div className="relative group">
                     <button className="bg-white p-2 rounded-lg shadow-md text-stone-600 hover:bg-stone-50"><Icon className="w-5 h-5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></Icon></button>
                     <div className="absolute right-full top-0 mr-2 bg-white rounded-lg shadow-lg p-2 hidden group-hover:flex flex-col space-y-1 min-w-[100px]">
                         {(['standard', 'satellite', 'hybrid', 'terrain'] as MapLayerType[]).map(t => (
                             <button key={t} onClick={() => setMapLayer(t)} className={`text-xs text-left px-2 py-1 rounded ${mapLayer === t ? 'bg-emerald-50 text-emerald-600 font-bold' : 'hover:bg-stone-50'}`}>
                                 {t.charAt(0).toUpperCase() + t.slice(1)}
                             </button>
                         ))}
                     </div>
                </div>
                {mapBearing !== 0 && (
                    <button onClick={resetNorth} className="bg-white p-2 rounded-lg shadow-md text-red-500 font-bold text-xs" style={{ transform: `rotate(${mapBearing}deg)` }}>
                        N
                    </button>
                )}
            </div>

            {/* Map 3D Controls */}
            <div className="absolute bottom-6 left-4 right-4 flex justify-between items-end pointer-events-none">
                 <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg pointer-events-auto space-y-2">
                     <p className="text-[10px] font-bold text-stone-400 uppercase">Search Radius: {mapRadius}km</p>
                     <input 
                        type="range" 
                        min="5" max="100" 
                        value={mapRadius} 
                        onChange={(e) => setMapRadius(Number(e.target.value))}
                        className="w-32 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                     />
                 </div>
                 
                 <div className="pointer-events-auto flex space-x-2">
                     <button onClick={() => setMapPitch(p => p === 0 ? 60 : 0)} className={`px-3 py-2 rounded-lg shadow-md text-xs font-bold transition-colors ${mapPitch > 0 ? 'bg-emerald-600 text-white' : 'bg-white text-stone-600'}`}>
                         3D
                     </button>
                     <button onClick={() => rotateMap(45)} className="bg-white px-3 py-2 rounded-lg shadow-md text-xs font-bold text-stone-600">
                         Rotate
                     </button>
                 </div>
            </div>
            
            {navigationRoute && (
                 <div className="absolute top-4 left-4 right-16 bg-blue-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between animate-slide-in-right z-10">
                     <div className="flex items-center">
                         <Icon className="w-5 h-5 mr-2 animate-pulse"><polygon points="3 11 22 2 13 21 11 13 3 11"/></Icon>
                         <div>
                             <p className="text-xs font-bold opacity-80">Navigating to</p>
                             <p className="text-sm font-bold truncate max-w-[150px]">{mockListings.find(l => l.lat === navigationRoute.to.lat)?.title || 'Destination'}</p>
                         </div>
                     </div>
                     <button onClick={() => { setNavigationRoute(null); setMapPitch(0); setMapBearing(0); }} className="bg-white/20 p-1.5 rounded-full hover:bg-white/30">
                         <Icon className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                     </button>
                 </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverScreen;
