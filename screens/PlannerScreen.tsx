
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import type { Trip, GroupMember, ChatMessage, PlannerChannel } from '../types';
import BackpackScreen from './BackpackScreen';
import CompassScreen from './CompassScreen';
import GoraMapScreen from './GoraMapScreen';

interface PlannerProps {
  isTripActive: boolean;
  onToggleTrip: () => void;
  myTrips: Trip[];
  onAddTrip: (trip: Trip) => void;
}

// Mock Data for Group Planner
const MOCK_MEMBERS: GroupMember[] = [
    { id: 'u1', name: 'You', avatar: 'https://picsum.photos/id/237/100/100', role: 'Admin', isOnline: true },
    { id: 'ai', name: 'Gora AI', avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png', role: 'AI', isOnline: true },
    { id: 'u2', name: 'Sarah J.', avatar: 'https://picsum.photos/id/1011/100/100', role: 'Member', isOnline: true },
    { id: 'u3', name: 'Mike R.', avatar: 'https://picsum.photos/id/1005/100/100', role: 'Member', isOnline: false },
    { id: 'u4', name: 'Anna L.', avatar: 'https://picsum.photos/id/1027/100/100', role: 'Member', isOnline: false },
];

const CHANNELS: PlannerChannel[] = [
    { id: 'c1', name: 'general', type: 'text', unreadCount: 0 },
    { id: 'c2', name: 'itinerary', type: 'text', unreadCount: 2 },
    { id: 'c3', name: 'budget-planning', type: 'text', unreadCount: 0 },
    { id: 'c4', name: 'bookings', type: 'text', unreadCount: 0 },
];

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: 'm1', senderId: 'ai', text: 'Welcome to the group! I am Gora AI, your budget adviser. Ask me anything about costs!', timestamp: '10:00 AM', type: 'text' },
    { id: 'm2', senderId: 'u2', text: 'Hey everyone! Excited for the Bukidnon trip. 🏔️', timestamp: '10:05 AM', type: 'text' },
    { id: 'm3', senderId: 'u1', text: 'Me too! @GoraAI calculate budget for 4 pax for 3 days.', timestamp: '10:06 AM', type: 'text' },
    { 
        id: 'm4', 
        senderId: 'ai', 
        text: 'Here is an estimated budget breakdown based on standard rates in Bukidnon:', 
        timestamp: '10:06 AM', 
        type: 'budget_plan',
        data: {
            total: 18000,
            perPerson: 4500,
            breakdown: [
                { item: 'Accommodation (2 Nights)', cost: 8000 },
                { item: 'Food & Drinks', cost: 6000 },
                { item: 'Activities & Entrance', cost: 3000 },
                { item: 'Transport (Van Rental)', cost: 1000 }
            ]
        }
    }
];

const PlannerScreen: React.FC<PlannerProps> = ({ myTrips }) => {
  const [activeTab, setActiveTab] = useState<'MyTrip' | 'GroupChat'>('MyTrip');
  
  // Chat State
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showChannelList, setShowChannelList] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  // Essentials Modal State
  const [activeEssential, setActiveEssential] = useState<'backpack' | 'compass' | 'map' | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (activeTab === 'GroupChat') {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages, activeChannel, activeTab]);

  const handleSendMessage = () => {
      if (!inputText.trim()) return;

      const newMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'u1',
          text: inputText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
      };

      setMessages(prev => [...prev, newMsg]);
      setInputText('');

      // AI Response Logic
      if (inputText.toLowerCase().includes('@goraai') || inputText.toLowerCase().includes('budget') || inputText.toLowerCase().includes('calculate')) {
          setIsAiTyping(true);
          setTimeout(() => {
              const aiMsg: ChatMessage = {
                  id: (Date.now() + 1).toString(),
                  senderId: 'ai',
                  text: 'I can help with that! Here is a revised estimation:',
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: 'budget_plan',
                  data: {
                      total: 22000,
                      perPerson: 5500,
                      breakdown: [
                          { item: 'Accommodation (Upgraded)', cost: 10000 },
                          { item: 'Food (Buffet)', cost: 8000 },
                          { item: 'Private Tour Guide', cost: 2000 },
                          { item: 'Souvenirs', cost: 2000 }
                      ]
                  }
              };
              setMessages(prev => [...prev, aiMsg]);
              setIsAiTyping(false);
          }, 1500);
      }
  };

  const getMember = (id: string) => MOCK_MEMBERS.find(m => m.id === id);

  // Get upcoming trip for backpack context
  const upcomingTrip = myTrips.find(t => t.status === 'Upcoming');
  const pastTrips = myTrips.filter(t => t.status === 'Completed');

  return (
    <div className="h-full bg-stone-50 flex flex-col relative">
      
      {/* --- ESSENTIALS SCREENS OVERLAYS --- */}
      {activeEssential === 'backpack' && <BackpackScreen onClose={() => setActiveEssential(null)} trip={upcomingTrip} />}
      {activeEssential === 'compass' && <CompassScreen onClose={() => setActiveEssential(null)} />}
      {activeEssential === 'map' && <GoraMapScreen onClose={() => setActiveEssential(null)} />}

      {/* --- MAIN TAB NAVIGATION --- */}
      <div className="bg-white px-4 pt-4 border-b border-stone-200 sticky top-0 z-20">
          <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('MyTrip')}
                className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'MyTrip' 
                    ? 'border-emerald-600 text-emerald-800' 
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                  My Trip & Essentials
              </button>
              <button
                onClick={() => setActiveTab('GroupChat')}
                className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === 'GroupChat' 
                    ? 'border-emerald-600 text-emerald-800' 
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                  Group Chat
              </button>
          </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 overflow-hidden relative">
          
          {/* --- MY TRIP TAB --- */}
          {activeTab === 'MyTrip' && (
              <div className="h-full overflow-y-auto custom-scrollbar p-4 pb-20 space-y-6">
                  
                  {/* Essentials Grid */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                      <h2 className="text-sm font-bold text-stone-800 mb-4 flex items-center">
                          <Icon className="w-5 h-5 mr-2 text-emerald-600"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></Icon>
                          Gora Essentials
                      </h2>
                      <div className="grid grid-cols-3 gap-3">
                          <div 
                            onClick={() => setActiveEssential('backpack')}
                            className="bg-orange-50 rounded-xl p-3 border border-orange-100 flex flex-col items-center text-center cursor-pointer hover:bg-orange-100 transition-colors active:scale-95"
                          >
                              <div className="w-10 h-10 mb-2 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                  <Icon className="w-5 h-5"><path d="M18 20V10M12 20V4M6 20v-6" /></Icon>
                              </div>
                              <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">Backpack</span>
                          </div>

                          <div 
                            onClick={() => setActiveEssential('compass')}
                            className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex flex-col items-center text-center cursor-pointer hover:bg-blue-100 transition-colors active:scale-95"
                          >
                               <div className="w-10 h-10 mb-2 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                  <Icon className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></Icon>
                              </div>
                              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Compass</span>
                          </div>

                          <div 
                            onClick={() => setActiveEssential('map')}
                            className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex flex-col items-center text-center cursor-pointer hover:bg-emerald-100 transition-colors active:scale-95"
                          >
                               <div className="w-10 h-10 mb-2 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                  <Icon className="w-5 h-5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /></Icon>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Gora Map</span>
                          </div>
                      </div>
                  </div>

                  {/* Upcoming Trip Card */}
                  <div>
                      <h2 className="text-lg font-bold text-stone-800 mb-3">Upcoming Trip</h2>
                      {upcomingTrip ? (
                          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-stone-100">
                              <div className="h-32 bg-stone-200 relative">
                                  <img src={upcomingTrip.imageUrl} className="w-full h-full object-cover" />
                                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                      Confirmed
                                  </div>
                              </div>
                              <div className="p-4">
                                  <div className="flex justify-between items-start mb-2">
                                      <div>
                                          <h3 className="font-bold text-xl text-stone-800">{upcomingTrip.title}</h3>
                                          <p className="text-sm text-stone-500 flex items-center">
                                              <Icon className="w-3 h-3 mr-1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Icon>
                                              {upcomingTrip.location}
                                          </p>
                                      </div>
                                      <div className="bg-stone-100 px-3 py-1 rounded-lg text-center">
                                          <p className="text-xs text-stone-500 uppercase font-bold">Oct</p>
                                          <p className="text-lg font-bold text-stone-800">28</p>
                                      </div>
                                  </div>
                                  <div className="mt-4 flex space-x-2">
                                      <button className="flex-1 py-2 bg-stone-900 text-white text-xs font-bold rounded-lg">View Ticket</button>
                                      <button className="flex-1 py-2 border border-stone-200 text-stone-600 text-xs font-bold rounded-lg">Manage</button>
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="bg-stone-100 rounded-2xl p-8 text-center border-2 border-dashed border-stone-200">
                              <Icon className="w-10 h-10 text-stone-300 mx-auto mb-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /></Icon>
                              <p className="text-stone-500 font-bold text-sm">No upcoming trips</p>
                              <p className="text-stone-400 text-xs">Start exploring to book your next adventure.</p>
                          </div>
                      )}
                  </div>

                  {/* Past Bookings */}
                  <div>
                      <h2 className="text-lg font-bold text-stone-800 mb-3">Past Adventures</h2>
                      <div className="space-y-3">
                          {pastTrips.map(trip => (
                              <div key={trip.id} className="bg-white p-3 rounded-xl border border-stone-100 flex items-center shadow-sm">
                                  <div className="w-16 h-16 bg-stone-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                      <img src={trip.imageUrl} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-stone-800 text-sm">{trip.title}</h4>
                                      <p className="text-xs text-stone-500 mb-1">{trip.date}</p>
                                      <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-bold">Completed</span>
                                  </div>
                                  <button className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full">
                                      <Icon className="w-5 h-5"><path d="M9 18l6-6-6-6"/></Icon>
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* --- GROUP CHAT TAB --- */}
          {activeTab === 'GroupChat' && (
              <div className="h-full flex flex-col bg-white">
                   {/* Channels Sidebar (Mobile Drawer / Desktop Sidebar) */}
                  <div className={`${showChannelList ? 'w-64 absolute inset-y-0 left-0 z-20 shadow-2xl' : 'hidden'} bg-stone-900 text-stone-300 flex flex-col transition-all duration-300 h-full`}>
                      <div className="p-4 border-b border-stone-800 flex justify-between items-center">
                          <h2 className="font-bold text-white">Trip Channels</h2>
                          <button onClick={() => setShowChannelList(false)}><Icon className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon></button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-1">
                          {CHANNELS.map(channel => (
                              <button 
                                key={channel.id}
                                onClick={() => { setActiveChannel(channel.name); setShowChannelList(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${activeChannel === channel.name ? 'bg-stone-700 text-white' : 'hover:bg-stone-800'}`}
                              >
                                  <div className="flex items-center">
                                      <span className="text-stone-500 mr-2 text-lg">#</span>
                                      {channel.name}
                                  </div>
                                  {channel.unreadCount > 0 && (
                                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{channel.unreadCount}</span>
                                  )}
                              </button>
                          ))}
                      </div>
                      <div className="p-4 bg-stone-800 border-t border-stone-700">
                          <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-white">B</div>
                              <div>
                                  <p className="text-xs font-bold text-white">Bukidnon Trip</p>
                                  <p className="text-[10px] text-stone-400">4 Members</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Chat Header */}
                  <div className="h-14 border-b border-stone-200 flex items-center justify-between px-4 bg-white shadow-sm shrink-0">
                       <div className="flex items-center">
                           <button onClick={() => setShowChannelList(true)} className="mr-3 text-stone-500 hover:bg-stone-100 p-1 rounded-md">
                               <Icon className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>
                           </button>
                           <span className="text-stone-400 text-xl font-light mr-1">#</span>
                           <h2 className="font-bold text-stone-800">{activeChannel}</h2>
                       </div>
                       <div className="flex -space-x-2">
                           {MOCK_MEMBERS.slice(0, 4).map(m => (
                               <img key={m.id} src={m.avatar} className="w-8 h-8 rounded-full border-2 border-white" title={m.name} />
                           ))}
                           <button className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 text-xs font-bold text-stone-500 flex items-center justify-center">+</button>
                       </div>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                       {messages.map((msg) => {
                           const sender = getMember(msg.senderId);
                           const isMe = msg.senderId === 'u1';
                           
                           return (
                               <div key={msg.id} className={`flex items-start space-x-3 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                   {!isMe && (
                                       <div className="flex-shrink-0">
                                           <img src={sender?.avatar} className="w-8 h-8 rounded-full" />
                                       </div>
                                   )}
                                   <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                       {!isMe && (
                                           <div className="flex items-center space-x-2 mb-1">
                                               <span className="text-xs font-bold text-stone-600">{sender?.name}</span>
                                               {sender?.role === 'AI' && <span className="bg-emerald-100 text-emerald-700 text-[9px] px-1 rounded font-bold uppercase">BOT</span>}
                                               <span className="text-[10px] text-stone-400">{msg.timestamp}</span>
                                           </div>
                                       )}
                                       
                                       {msg.type === 'budget_plan' ? (
                                           <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-4 shadow-sm w-full">
                                                <div className="flex items-center text-emerald-600 mb-2">
                                                    <Icon className="w-5 h-5 mr-2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></Icon>
                                                    <span className="font-bold text-sm uppercase">Budget Estimation</span>
                                                </div>
                                                <p className="text-sm text-stone-600 mb-3">{msg.text}</p>
                                                
                                                <div className="space-y-2 mb-3 bg-stone-50 p-3 rounded-lg">
                                                    {msg.data?.breakdown?.map((item, i) => (
                                                        <div key={i} className="flex justify-between text-xs">
                                                            <span className="text-stone-500">{item.item}</span>
                                                            <span className="font-bold text-stone-800">₱{item.cost.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex justify-between items-center border-t border-stone-100 pt-2">
                                                    <span className="text-xs font-bold text-stone-500">Est. Per Person</span>
                                                    <span className="text-lg font-bold text-emerald-700">₱{msg.data?.perPerson?.toLocaleString()}</span>
                                                </div>
                                           </div>
                                       ) : (
                                           <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                               isMe 
                                               ? 'bg-emerald-600 text-white rounded-tr-none' 
                                               : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                                           }`}>
                                               {msg.text}
                                           </div>
                                       )}
                                       {isMe && <span className="text-[10px] text-stone-400 mt-1">{msg.timestamp}</span>}
                                   </div>
                               </div>
                           );
                       })}
                       
                       {isAiTyping && (
                           <div className="flex items-start space-x-3">
                               <img src={getMember('ai')?.avatar} className="w-8 h-8 rounded-full" />
                               <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1 items-center">
                                   <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                                   <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-75"></div>
                                   <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-150"></div>
                               </div>
                           </div>
                       )}
                       <div ref={chatEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-3 bg-white border-t border-stone-200">
                       <div className="flex items-end space-x-2 bg-stone-100 p-2 rounded-xl">
                           <button className="p-2 text-stone-400 hover:text-stone-600">
                               <Icon className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></Icon>
                           </button>
                           <textarea 
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                              onKeyPress={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                              placeholder={`Message #${activeChannel}`}
                              className="flex-1 bg-transparent border-none focus:ring-0 text-sm max-h-20 py-2 resize-none outline-none"
                              rows={1}
                           />
                           <button 
                             onClick={handleSendMessage}
                             disabled={!inputText.trim()}
                             className={`p-2 rounded-lg transition-colors ${inputText.trim() ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-400'}`}
                           >
                               <Icon className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>
                           </button>
                       </div>
                       <p className="text-[10px] text-center text-stone-400 mt-2">
                           Tip: Ask <span className="font-bold text-emerald-600">@GoraAI</span> to calculate budgets.
                       </p>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default PlannerScreen;
