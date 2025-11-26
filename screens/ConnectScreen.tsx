
import React, { useState } from 'react';
import { mockTravelers, mockPosts, mockBadges } from '../constants';
import Icon from '../components/Icon';
import type { Badge, UserLevel, UserStatus, Traveler } from '../types';

const ConnectScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Feed' | 'Travelers'>('Feed');
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Badge Modal
  const renderBadgeModal = () => {
    if (!selectedBadge) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={() => setSelectedBadge(null)}>
        <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl transform scale-100" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col items-center text-center">
            <img src={selectedBadge.imageUrl} alt={selectedBadge.name} className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-bold text-stone-800">{selectedBadge.name}</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 mb-4">{selectedBadge.category}</span>
            <p className="text-stone-500 text-sm">{selectedBadge.description}</p>
            <button onClick={() => setSelectedBadge(null)} className="mt-6 w-full py-3 bg-stone-900 text-white rounded-xl font-bold">Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Traveler Profile & SOS Details Modal
  const renderTravelerProfileModal = () => {
      if (!selectedTraveler) return null;
      const hasAccess = !!selectedTraveler.distance; // Mock logic: access if nearby/distance is known

      return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-black/60 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={() => setSelectedTraveler(null)}></div>
              
              <div className="bg-white w-full h-[85vh] sm:h-auto sm:max-w-md sm:rounded-2xl shadow-2xl pointer-events-auto relative animate-slide-in-right flex flex-col overflow-hidden transition-all duration-300">
                  
                  {/* Header */}
                  <div className="relative bg-stone-100 h-32 flex-shrink-0">
                      {selectedTraveler.isSosActive && (
                          <div className="absolute inset-0 bg-red-600/90 flex items-center justify-center animate-pulse z-10">
                              <div className="text-white text-center">
                                  <Icon className="w-12 h-12 mx-auto mb-1"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
                                  <h2 className="font-black text-xl tracking-widest">SOS ACTIVE</h2>
                              </div>
                          </div>
                      )}
                      <button onClick={() => setSelectedTraveler(null)} className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/30 z-20">
                          <Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                      </button>
                  </div>

                  <div className="px-6 -mt-12 relative flex-shrink-0">
                      <div className="flex justify-between items-end">
                          <img src={selectedTraveler.avatarUrl} className={`w-24 h-24 rounded-full border-4 ${selectedTraveler.isSosActive ? 'border-red-500' : 'border-white'} shadow-md bg-white`} />
                          <div className="mb-2 text-right">
                              <LevelBadge level={selectedTraveler.level} />
                              <p className="text-xs text-stone-500 font-bold mt-1">{selectedTraveler.totalTrips} Trips</p>
                          </div>
                      </div>
                      <h2 className="text-2xl font-bold text-stone-800 mt-3">{selectedTraveler.name}</h2>
                      <p className="text-stone-500 text-sm">@{selectedTraveler.nickname}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                      
                      {/* SOS Message Section */}
                      {selectedTraveler.isSosActive && (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                              <h3 className="font-bold text-red-700 text-sm mb-1 flex items-center">
                                  <Icon className="w-4 h-4 mr-2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Icon>
                                  Emergency Status
                              </h3>
                              <p className="text-red-600 text-xs leading-relaxed font-medium">
                                  "{selectedTraveler.sosMessage}"
                              </p>
                              <div className="mt-3 flex space-x-2">
                                  <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold shadow-sm">Contact Authorities</button>
                                  <button className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-xs font-bold">Message</button>
                              </div>
                          </div>
                      )}

                      {/* Journey Itinerary & Host Info (Visible if Nearby/Follower) */}
                      {hasAccess && selectedTraveler.currentTrip ? (
                          <>
                              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                                  <h3 className="font-bold text-stone-800 text-sm mb-3 flex items-center">
                                      <Icon className="w-4 h-4 mr-2 text-emerald-600"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></Icon>
                                      Current Journey
                                  </h3>
                                  <div className="space-y-3">
                                      <div>
                                          <p className="text-xs text-stone-500 font-bold uppercase">Activity</p>
                                          <p className="font-bold text-stone-800">{selectedTraveler.currentTrip.title}</p>
                                      </div>
                                      <div>
                                          <p className="text-xs text-stone-500 font-bold uppercase">Status</p>
                                          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded font-bold mt-1">
                                              {selectedTraveler.currentTrip.itineraryStatus}
                                          </span>
                                      </div>
                                      {selectedTraveler.currentTrip.coords && (
                                          <div>
                                              <p className="text-xs text-stone-500 font-bold uppercase">GPS Location</p>
                                              <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg mt-1 border border-stone-100">
                                                  <code className="text-xs text-stone-600 font-mono">
                                                      {selectedTraveler.currentTrip.coords.lat.toFixed(4)}, {selectedTraveler.currentTrip.coords.lng.toFixed(4)}
                                                  </code>
                                                  <button className="text-xs font-bold text-blue-600 flex items-center">
                                                      <Icon className="w-3 h-3 mr-1"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /></Icon>
                                                      View Map
                                                  </button>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>

                              {selectedTraveler.currentTrip.host && (
                                  <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-center space-x-3">
                                      <img src={selectedTraveler.currentTrip.host.avatar} className="w-10 h-10 rounded-full object-cover" />
                                      <div>
                                          <p className="text-xs text-stone-500 font-bold uppercase">Guided By</p>
                                          <p className="font-bold text-stone-800 text-sm">{selectedTraveler.currentTrip.host.name}</p>
                                      </div>
                                      <button className="ml-auto text-stone-400 hover:text-emerald-600">
                                          <Icon className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>
                                      </button>
                                  </div>
                              )}
                          </>
                      ) : (
                          <div className="text-center py-8 text-stone-400">
                              <Icon className="w-12 h-12 mx-auto mb-2 opacity-50"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></Icon>
                              <p className="text-sm">Journey details hidden.</p>
                              <p className="text-xs">Connect or get closer to view activity.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  const LevelBadge: React.FC<{ level: UserLevel }> = ({ level }) => {
    const colors = {
      'Gora': 'bg-stone-100 text-stone-600',
      'Gora X': 'bg-emerald-100 text-emerald-700',
      'TaraGora': 'bg-blue-100 text-blue-700',
      'Goravels': 'bg-purple-100 text-purple-700',
      'Goramax': 'bg-amber-100 text-amber-700',
    };
    return (
      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${colors[level] || colors['Gora']}`}>
        {level}
      </span>
    );
  };

  const StatusDot: React.FC<{ status: UserStatus }> = ({ status }) => {
    const colors = {
      'Working': 'bg-gray-400',
      'Gora': 'bg-emerald-500',
      'Plan to go': 'bg-blue-400',
      'Booked': 'bg-purple-500',
      'Happy now': 'bg-yellow-400',
    };
    return <span className={`w-3 h-3 border-2 border-white rounded-full absolute bottom-0 right-0 ${colors[status] || 'bg-gray-300'}`} title={status}></span>;
  };

  const TravelerCard: React.FC<{ traveler: Traveler, actionType?: 'Follow' | 'Nudge' }> = ({ traveler, actionType = 'Follow' }) => (
    <div 
        onClick={() => setSelectedTraveler(traveler)}
        className={`bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between mb-3 cursor-pointer active:scale-95 transition-all ${traveler.isSosActive ? 'border-red-300 ring-2 ring-red-100' : 'border-stone-100 hover:border-emerald-200'}`}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <img src={traveler.avatarUrl} alt={traveler.name} className="w-12 h-12 rounded-full object-cover" />
          <StatusDot status={traveler.status} />
          
          {/* SOS Indicator on Avatar */}
          {traveler.isSosActive && (
              <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 border-2 border-white animate-pulse shadow-md">
                  <Icon className="w-3 h-3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></Icon>
              </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h3 className={`font-bold truncate ${traveler.isSosActive ? 'text-red-600' : 'text-stone-800'}`}>
                {traveler.nickname}
            </h3>
            <LevelBadge level={traveler.level} />
          </div>
          
          {traveler.isSosActive ? (
              <p className="text-[10px] font-bold text-red-500 flex items-center mt-0.5 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span> SOS ALERT
              </p>
          ) : (
              <div className="flex items-center text-xs text-stone-500 mt-0.5 space-x-2">
                <span>{traveler.totalTrips} Trips</span>
                {traveler.distance && <span className="flex items-center text-emerald-600"><Icon className="w-3 h-3 mr-0.5"><circle cx="12" cy="12" r="10"/></Icon> {traveler.distance}</span>}
              </div>
          )}

          <div className="flex space-x-1 mt-1.5 overflow-x-auto scrollbar-hide">
             {traveler.badges.slice(0, 4).map(badge => (
               <button key={badge.id} onClick={(e) => { e.stopPropagation(); setSelectedBadge(badge); }}>
                 <img src={badge.imageUrl} className="w-4 h-4 opacity-80 hover:scale-110 transition-transform" title={badge.name} />
               </button>
             ))}
          </div>
        </div>
      </div>
      
      <button 
        onClick={(e) => e.stopPropagation()} // Prevent triggering card click
        className={`ml-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 flex-shrink-0 ${
        actionType === 'Nudge' 
          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
          : 'bg-stone-900 text-white hover:bg-stone-800'
      }`}>
        {actionType === 'Nudge' ? '🔥 Nudge' : 'Follow'}
      </button>
    </div>
  );

  return (
    <div className="bg-stone-50 min-h-full pb-20">
      {renderBadgeModal()}
      {renderTravelerProfileModal()}

      {/* Header / Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 pt-4 pb-0 sticky top-0 z-20">
           <div className="flex space-x-8">
               {['Feed', 'Travelers'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setActiveTab(tab as any)}
                     className={`text-lg font-bold pb-3 border-b-4 transition-all rounded-t-sm ${
                         activeTab === tab ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-stone-400 hover:text-stone-600'
                     }`}
                   >
                       {tab}
                   </button>
               ))}
           </div>
      </div>

      <div className="p-4">
            
        {/* --- FEED TAB --- */}
        {activeTab === 'Feed' && (
            <div className="space-y-6 animate-fade-in">
                  {/* Post Creation Placeholder */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-stone-200 rounded-full"></div>
                      <input type="text" placeholder="Share your adventure..." className="flex-1 bg-stone-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500" />
                      <Icon className="w-6 h-6 text-emerald-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></Icon>
                  </div>

                  {mockPosts.map((post) => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                          {/* Post Header */}
                          <div className="p-4 flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                  <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover border border-stone-100" />
                                  <div>
                                      <div className="flex items-center space-x-2">
                                        <p className="text-sm font-bold text-stone-800">{post.user.name}</p>
                                        <LevelBadge level={post.user.level} />
                                      </div>
                                      <div className="flex items-center text-xs text-stone-500">
                                        <Icon className="w-3 h-3 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                        {post.location}
                                      </div>
                                  </div>
                              </div>
                              <button className="text-stone-400 hover:text-stone-600"><Icon className="w-5 h-5"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></Icon></button>
                          </div>

                          {/* Image */}
                          <div className="w-full aspect-[4/3] bg-stone-100 relative">
                               <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" loading="lazy" />
                               <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                  {post.tags[0]}
                               </div>
                          </div>

                          {/* Actions & Caption */}
                          <div className="p-4">
                              <div className="flex justify-between items-center mb-3">
                                  <div className="flex space-x-4">
                                      <button className="flex items-center space-x-1 group">
                                          <Icon className="w-6 h-6 text-stone-800 group-hover:text-red-500 transition-colors"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>
                                          <span className="text-sm font-bold text-stone-800">{post.likes}</span>
                                      </button>
                                      <button className="flex items-center space-x-1 group">
                                          <Icon className="w-6 h-6 text-stone-800 group-hover:text-blue-500 transition-colors"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></Icon>
                                          <span className="text-sm font-bold text-stone-800">{post.comments}</span>
                                      </button>
                                      <button><Icon className="w-6 h-6 text-stone-800 hover:text-emerald-600"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon></button>
                                  </div>
                                  <button><Icon className="w-6 h-6 text-stone-800 hover:text-yellow-500"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></Icon></button>
                              </div>
                              <p className="text-sm text-stone-700 leading-relaxed mb-2">
                                  <span className="font-bold mr-2">{post.user.name}</span>
                                  {post.caption}
                              </p>
                              <p className="text-[10px] text-stone-400 uppercase">{post.timestamp}</p>
                          </div>
                      </div>
                  ))}
            </div>
        )}

        {/* --- TRAVELERS TAB --- */}
        {activeTab === 'Travelers' && (
            <div className="space-y-8 animate-fade-in">
               
               {/* Nearby Section */}
               <div>
                   <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center">
                      <Icon className="w-4 h-4 mr-1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></Icon>
                      Nearby Travelers
                   </h2>
                   {mockTravelers.filter(t => t.distance).sort((a,b) => (b.isSosActive ? 1 : 0) - (a.isSosActive ? 1 : 0)).map((traveler) => (
                       <TravelerCard key={traveler.id} traveler={traveler} />
                   ))}
               </div>

               {/* Suggested Section */}
               <div>
                   <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center">
                      <Icon className="w-4 h-4 mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></Icon>
                      Suggested to Connect
                   </h2>
                   {mockTravelers.filter(t => !t.distance && t.totalTrips > 10).map((traveler) => (
                       <TravelerCard key={traveler.id} traveler={traveler} />
                   ))}
               </div>

               {/* Scratch Back / Ignite Section */}
               <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                   <h2 className="text-sm font-bold text-orange-800 uppercase tracking-wider mb-2 flex items-center">
                      <Icon className="w-4 h-4 mr-1 text-orange-600"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></Icon>
                      Ignite the Spirit
                   </h2>
                   <p className="text-xs text-orange-600 mb-4">These travelers haven't been out in a while. Give them a nudge to join the adventure!</p>
                   
                   {mockTravelers.filter(t => t.totalTrips < 5).map((traveler) => (
                       <TravelerCard key={traveler.id} traveler={traveler} actionType="Nudge" />
                   ))}
               </div>

            </div>
        )}

      </div>
    </div>
  );
};

export default ConnectScreen;
