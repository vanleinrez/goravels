
import React, { useState } from 'react';
import Icon from '../components/Icon';
import type { Trip } from '../types';

interface BackpackScreenProps {
  onClose: () => void;
  trip?: Trip;
}

const DEFAULT_ITEMS = [
    { id: '1', item: 'Valid ID / PhilSys ID', category: 'Document', checked: true },
    { id: '2', item: 'Booking Confirmation (Offline)', category: 'Document', checked: true },
    { id: '3', item: 'Insect Repellent', category: 'Health', checked: false },
    { id: '4', item: 'Sunblock / Hat', category: 'Health', checked: false },
    { id: '5', item: 'Reusable Water Bottle', category: 'Eco', checked: false },
    { id: '6', item: 'Raincoat / Poncho', category: 'Gear', checked: false },
    { id: '7', item: 'Powerbank', category: 'Gear', checked: false },
    { id: '8', item: 'Extra Cash (Small Bills)', category: 'Finance', checked: false },
];

const BackpackScreen: React.FC<BackpackScreenProps> = ({ onClose, trip }) => {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-stone-50 w-full h-[90vh] sm:h-[80vh] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-white p-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                    <Icon className="w-6 h-6 text-orange-600"><path d="M18 20V10M12 20V4M6 20v-6" /></Icon>
                </div>
                <div>
                    <h2 className="font-bold text-stone-800">Trip Backpack</h2>
                    <p className="text-xs text-stone-500">{trip ? `For: ${trip.title}` : 'General Essentials'}</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
                <Icon className="w-5 h-5 text-stone-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white px-4 pb-4 border-b border-stone-100">
            <div className="flex justify-between text-xs font-bold text-stone-500 mb-1">
                <span>{progress}% Packed</span>
                <span>{items.filter(i => i.checked).length}/{items.length} items</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-stone-50">
            <p className="text-sm text-stone-600 mb-4 bg-orange-50 p-3 rounded-xl border border-orange-100 leading-relaxed">
                <span className="font-bold">Tip:</span> These items are recommended based on the rural terrain and activities in your itinerary.
            </p>

            <div className="space-y-2">
                {items.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => toggleItem(item.id)} 
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            item.checked 
                            ? 'bg-stone-100 border-stone-200 opacity-75' 
                            : 'bg-white border-stone-200 hover:border-orange-300 shadow-sm'
                        }`}
                    >
                        <div className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-colors ${
                            item.checked 
                            ? 'bg-orange-500 border-orange-500 text-white' 
                            : 'border-stone-300 bg-stone-50'
                        }`}>
                            {item.checked && <Icon className="w-4 h-4"><polyline points="20 6 9 17 4 12" /></Icon>}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-bold ${item.checked ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                                {item.item}
                            </p>
                            <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wide">{item.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-200">
            <button onClick={onClose} className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl shadow-lg">
                Done Packing
            </button>
        </div>

      </div>
    </div>
  );
};

export default BackpackScreen;
