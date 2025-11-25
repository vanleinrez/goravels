
import React from 'react';
import Icon from '../components/Icon';

interface CompassScreenProps {
  onClose: () => void;
}

const TRIP_ACHIEVEMENTS = [
    { id: 'a1', title: 'Bukidnon Conqueror', type: 'Badge', icon: '🏔️', desc: 'Complete the Mt. Kitanglad Trek', status: 'In Progress' },
    { id: 'a2', title: 'Eco Warrior', type: 'Token', icon: '🌱', desc: 'Participate in Tree Planting', status: 'Locked' },
    { id: 'a3', title: 'Local Taste', type: 'Stamp', icon: '🍲', desc: 'Eat at a local tribal home', status: 'Locked' },
    { id: 'a4', title: 'Social Butterfly', type: 'Badge', icon: '🦋', desc: 'Connect with 3 travelers', status: 'Locked' },
];

const CompassScreen: React.FC<CompassScreenProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-stone-50 w-full h-[85vh] sm:h-auto sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="bg-white p-4 border-b border-stone-200 flex justify-between items-center">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Icon className="w-6 h-6 text-blue-600"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></Icon>
                </div>
                <div>
                    <h2 className="font-bold text-stone-800">Achievements Guide</h2>
                    <p className="text-xs text-stone-500">Rewards available for this trip</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200">
                <Icon className="w-5 h-5 text-stone-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                <h3 className="text-blue-800 font-bold text-sm mb-1">Trip Goals</h3>
                <p className="text-xs text-blue-600">Complete these tasks to earn unique collectibles for your Gora Passport.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {TRIP_ACHIEVEMENTS.map(ach => (
                    <div key={ach.id} className={`bg-white p-4 rounded-xl border shadow-sm flex flex-col items-center text-center relative overflow-hidden transition-all ${ach.status === 'In Progress' ? 'border-blue-300 ring-1 ring-blue-200' : 'border-stone-200'}`}>
                        <div className="text-4xl mb-3 transform transition-transform hover:scale-110 cursor-default">{ach.icon}</div>
                        <h3 className="font-bold text-stone-800 text-sm mb-1">{ach.title}</h3>
                        <p className="text-[10px] text-stone-500 mb-3 leading-tight">{ach.desc}</p>
                        
                        <div className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                            ach.status === 'In Progress' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-stone-100 text-stone-400'
                        }`}>
                            {ach.status === 'In Progress' ? 'In Progress' : ach.type}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-4 bg-white border-t border-stone-200 text-center">
            <p className="text-[10px] text-stone-400 font-medium">Collectibles are awarded automatically upon activity completion.</p>
        </div>

      </div>
    </div>
  );
};

export default CompassScreen;
