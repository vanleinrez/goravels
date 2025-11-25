
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import type { Trip } from '../types';

interface PlannerProps {
  isTripActive: boolean;
  onToggleTrip: () => void;
  myTrips: Trip[];
  onAddTrip: (trip: Trip) => void;
}

interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    suggestion?: Trip;
}

const PlannerScreen: React.FC<PlannerProps> = ({ isTripActive, onToggleTrip, myTrips, onAddTrip }) => {
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', sender: 'ai', text: 'Hi! I am Gora AI. Where do you want to go today? I can help you build an itinerary.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showAiPlanner]);

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;

      const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput };
      setMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsTyping(true);

      // Simulate AI processing
      setTimeout(() => {
          let aiResponse: ChatMessage = {
              id: (Date.now() + 1).toString(),
              sender: 'ai',
              text: "I found a great spot for you! How about this?"
          };

          if (userMsg.text.toLowerCase().includes('bukidnon')) {
             aiResponse.text = "Bukidnon is beautiful! Based on your preference for adventure, I recommend a trip to Impasug-ong.";
             aiResponse.suggestion = {
                 id: `ai-${Date.now()}`,
                 title: 'Impasug-ong Ridge Trek',
                 location: 'Impasug-ong, Bukidnon',
                 date: 'Suggested Date: Next Weekend',
                 status: 'Upcoming',
                 imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800',
                 price: 2500
             };
          } else if (userMsg.text.toLowerCase().includes('beach') || userMsg.text.toLowerCase().includes('water')) {
             aiResponse.text = "For water lovers, nothing beats the beaches of Misamis Oriental. Check this out:";
             aiResponse.suggestion = {
                 id: `ai-${Date.now()}`,
                 title: 'Agutayan Island Hop',
                 location: 'Jasaan, Misamis Oriental',
                 date: 'Suggested Date: Tomorrow',
                 status: 'Upcoming',
                 imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800',
                 price: 1800
             };
          } else {
             aiResponse.text = "I can plan a mystery trip for you! Here is a popular choice among backpackers.";
             aiResponse.suggestion = {
                 id: `ai-${Date.now()}`,
                 title: 'Mystery Mountain Camp',
                 location: 'Claveria, Misamis Oriental',
                 date: 'Suggested Date: Dec 12 - 14',
                 status: 'Upcoming',
                 imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800',
                 price: 1200
             };
          }

          setMessages(prev => [...prev, aiResponse]);
          setIsTyping(false);
      }, 1500);
  };

  const handleAddSuggestion = (trip: Trip) => {
      onAddTrip(trip);
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          text: `Great choice! I've added ${trip.title} to your planner.`
      }]);
  };

  return (
    <div className="p-4 min-h-full bg-stone-50 relative">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Your Planner</h1>
      
      {/* AI Planner Modal */}
      {showAiPlanner && (
          <div className="fixed inset-0 z-50 bg-stone-50 flex flex-col animate-slide-in-right">
              <div className="bg-white p-4 border-b border-stone-200 flex justify-between items-center shadow-sm">
                  <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                          <Icon className="w-5 h-5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></Icon>
                      </div>
                      <div>
                          <h2 className="font-bold text-stone-800 leading-none">Gora AI</h2>
                          <span className="text-[10px] text-emerald-600 font-bold">Trip Planner</span>
                      </div>
                  </div>
                  <button onClick={() => setShowAiPlanner(false)} className="p-2 hover:bg-stone-100 rounded-full">
                      <Icon className="w-6 h-6 text-stone-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                  </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-stone-900 text-white rounded-br-none' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none'} p-3 rounded-2xl shadow-sm`}>
                              <p className="text-sm">{msg.text}</p>
                              {msg.suggestion && (
                                  <div className="mt-3 bg-stone-50 rounded-xl overflow-hidden border border-stone-200">
                                      <img src={msg.suggestion.imageUrl} className="w-full h-24 object-cover" />
                                      <div className="p-2">
                                          <h4 className="font-bold text-sm">{msg.suggestion.title}</h4>
                                          <p className="text-xs text-stone-500">{msg.suggestion.location}</p>
                                          <div className="flex justify-between items-center mt-2">
                                              <span className="text-emerald-600 font-bold text-xs">₱{msg.suggestion.price}</span>
                                              <button 
                                                onClick={() => msg.suggestion && handleAddSuggestion(msg.suggestion)}
                                                className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold"
                                              >
                                                  Add to Planner
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
                  {isTyping && (
                      <div className="flex justify-start">
                          <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex space-x-1 items-center">
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-75"></div>
                              <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></div>
                          </div>
                      </div>
                  )}
                  <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-stone-200">
                  <div className="flex space-x-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="e.g. Plan a hiking trip for me..." 
                        className="flex-1 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button onClick={handleSendMessage} className="bg-emerald-600 text-white p-2 rounded-full shadow-md active:scale-95 transition-transform">
                          <Icon className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Icon>
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Activity Status Indicator */}
      <div className={`p-5 rounded-2xl shadow-sm border mb-6 transition-all ${isTripActive ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white border-stone-100'}`}>
          <div className="flex justify-between items-center mb-1">
              <div>
                  <h3 className={`font-bold text-lg ${isTripActive ? 'text-white' : 'text-stone-800'}`}>
                      {isTripActive ? 'Trip in Progress' : 'No Active Trip'}
                  </h3>
                  <p className={`text-xs ${isTripActive ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {isTripActive ? 'SOS Button is now active in Activity Screen.' : 'Tap the Paw icon to start an activity.'}
                  </p>
              </div>
              <div className={`p-2 rounded-full ${isTripActive ? 'bg-white/20' : 'bg-stone-100'}`}>
                  <Icon className={`w-6 h-6 ${isTripActive ? 'text-white' : 'text-stone-400'}`}>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  </Icon>
              </div>
          </div>
      </div>

      <div className="space-y-6 pb-20">
        {/* Itinerary Builder CTA */}
        <div onClick={() => setShowAiPlanner(true)} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-colors group">
            <div>
                <h3 className="font-bold text-stone-800 flex items-center">
                    Create New Trip
                    <span className="ml-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">AI Powered</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">Use AI to build your rural itinerary</p>
            </div>
            <button className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white group-hover:bg-emerald-600 transition-colors">
                <Icon className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            </button>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pl-6 py-2">
             {myTrips.length === 0 && (
                 <p className="text-sm text-stone-400 italic">No trips planned yet.</p>
             )}
             {myTrips.map((trip) => (
                 <div key={trip.id} className="relative animate-fade-in">
                     <span className={`absolute -left-[31px] top-2 w-4 h-4 rounded-full border-2 border-white ${trip.status === 'Upcoming' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`}></span>
                     <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                         <div className="flex space-x-4">
                             <img src={trip.imageUrl} alt={trip.title} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                             <div className="flex-1">
                                 <div className="flex justify-between items-start">
                                     <h3 className="font-bold text-stone-800 line-clamp-1">{trip.title}</h3>
                                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase shrink-0 ml-2 ${trip.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                                         {trip.status}
                                     </span>
                                 </div>
                                 <p className="text-sm text-stone-500 mt-1 flex items-center">
                                     <Icon className="w-3 h-3 mr-1"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /></Icon>
                                     {trip.date}
                                 </p>
                                 <div className="mt-3 flex space-x-2">
                                     <button className="text-xs font-medium text-emerald-600 hover:underline">View Details</button>
                                     {trip.status === 'Completed' && <button className="text-xs font-medium text-stone-500 hover:text-stone-800">View Moments</button>}
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             ))}
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-4">
            <div className="flex items-center text-orange-800 mb-2">
                <Icon className="w-5 h-5 mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Icon>
                <h3 className="font-bold text-sm">Adventure Challenge</h3>
            </div>
            <p className="text-xs text-orange-700 mb-3">Complete 3 more adventures in Bukidnon to unlock the "Highlander" badge!</p>
            <div className="w-full bg-orange-200 rounded-full h-1.5">
                <div className="bg-orange-500 h-1.5 rounded-full w-2/5"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerScreen;
