import React, { useState } from 'react';
import { mockTravelers } from '../constants';
import Icon from '../components/Icon';

const ConnectScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Feed' | 'Travelers' | 'Chats'>('Travelers');

  return (
    <div className="bg-stone-50 min-h-full">
       <div className="bg-white border-b border-stone-200 p-4 sticky top-0 z-10">
           <h1 className="text-2xl font-bold text-stone-800 mb-4">Connect</h1>
           <div className="flex space-x-6">
               {['Feed', 'Travelers', 'Chats'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab as any)}
                     className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                         activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-stone-400'
                     }`}
                   >
                       {tab}
                   </button>
               ))}
           </div>
       </div>

       <div className="p-4">
           {activeTab === 'Travelers' && (
               <div className="space-y-4">
                   <p className="text-xs text-stone-500 uppercase font-bold tracking-wider mb-2">Nearby Travelers</p>
                   {mockTravelers.map((traveler) => (
                       <div key={traveler.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                               <div className="relative">
                                   <img src={traveler.avatarUrl} alt={traveler.name} className="w-12 h-12 rounded-full object-cover" />
                                   {traveler.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                               </div>
                               <div>
                                   <h3 className="font-bold text-stone-800">{traveler.name}</h3>
                                   <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">{traveler.tier}</span>
                               </div>
                           </div>
                           <button className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-emerald-100 hover:text-emerald-600">
                               <Icon className="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></Icon>
                           </button>
                       </div>
                   ))}
               </div>
           )}

           {activeTab === 'Chats' && (
               <div className="text-center py-10">
                   <div className="bg-stone-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                       <Icon className="w-8 h-8 text-stone-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Icon>
                   </div>
                   <p className="text-stone-500 text-sm">No active conversations.</p>
                   <p className="text-xs text-stone-400 mt-2 max-w-xs mx-auto">Remember: You can only message hosts after a confirmed booking.</p>
               </div>
           )}
            
            {activeTab === 'Feed' && (
                <div className="space-y-4">
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                         <div className="flex items-center space-x-2 mb-3">
                              <img src="https://picsum.photos/id/64/50/50" className="w-8 h-8 rounded-full" />
                              <div>
                                  <p className="text-sm font-bold">Sarah Jen</p>
                                  <p className="text-[10px] text-stone-400">Just now</p>
                              </div>
                         </div>
                         <p className="text-sm text-stone-600 mb-3">Just finished the Mt. Kitanglad trek! The view at the summit is breathtaking. 🏔️ #Gora #Bukidnon</p>
                         <img src="https://picsum.photos/seed/kitanglad/600/300" className="w-full h-40 object-cover rounded-lg" />
                     </div>
                </div>
            )}
       </div>
    </div>
  );
};

export default ConnectScreen;