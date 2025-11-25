
import React from 'react';
import Icon from '../components/Icon';
import MapView from '../components/MapView';
import type { Listing } from '../types';

interface GoraMapScreenProps {
  onClose: () => void;
}

const PAY_IT_FORWARD_SPOTS: Listing[] = [
    { 
        id: 'c1', title: 'School Supply Drive', location: 'Munai Elementary', rating: 5.0, reviews: 0, price: 0, 
        category: 'For a cause', lat: 8.150, lng: 124.900, imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800',
        description: 'Drop off pencils, paper, and books for the local students.'
    },
    { 
        id: 'c2', title: 'Community Pantry', location: 'Impasug-ong Plaza', rating: 5.0, reviews: 0, price: 0, 
        category: 'For a cause', lat: 8.300, lng: 125.000, imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800',
        description: 'Leave canned goods or rice for farmers.'
    },
    { 
        id: 'c3', title: 'Reforestation Site', location: 'Mt. Kitanglad Buffer', rating: 5.0, reviews: 0, price: 0, 
        category: 'Voluntourism', lat: 8.132, lng: 124.918, imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800',
        description: 'Pick up seedlings here to plant during your trek.'
    },
];

const GoraMapScreen: React.FC<GoraMapScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-stone-50 w-full h-[90vh] sm:h-[85vh] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="bg-white p-4 border-b border-stone-200 flex justify-between items-center shrink-0">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <Icon className="w-6 h-6 text-emerald-600"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /></Icon>
                </div>
                <div>
                    <h2 className="font-bold text-stone-800">Gora Map</h2>
                    <p className="text-xs text-stone-500">Pay It Forward Spots</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
                <Icon className="w-5 h-5 text-stone-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="h-1/2 w-full relative bg-stone-100">
                <MapView 
                    listings={PAY_IT_FORWARD_SPOTS} 
                    radiusKm={20}
                    userLocation={{ lat: 8.15, lng: 124.95 }} // Mock center for view
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur p-2 rounded-lg shadow-sm pointer-events-none">
                    <p className="text-[10px] font-bold text-stone-500">NEARBY IMPACT SPOTS</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white border-t border-stone-200">
                <h3 className="font-bold text-stone-800 mb-3 text-sm">Opportunities to Help</h3>
                <div className="space-y-3">
                    {PAY_IT_FORWARD_SPOTS.map(spot => (
                        <div key={spot.id} className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-start">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mr-3 flex-shrink-0">
                                <Icon className="w-6 h-6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Icon>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-stone-800 text-sm">{spot.title}</h3>
                                <p className="text-xs text-stone-500 mb-1 flex items-center">
                                    <Icon className="w-3 h-3 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                    {spot.location}
                                </p>
                                <p className="text-xs text-emerald-700 font-medium bg-emerald-100/50 p-2 rounded-lg mt-1">
                                    {spot.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default GoraMapScreen;
