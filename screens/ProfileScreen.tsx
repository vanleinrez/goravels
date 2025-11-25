
import React, { useState } from 'react';
import type { User, UserStatus } from '../types';
import Icon from '../components/Icon';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onSwitchToHost: () => void;
}

// Reusing Input component locally for Edit Modal
const Input: React.FC<{ label: string; value?: string; placeholder?: string; type?: string; onChange?: (e: any) => void }> = ({ label, value, placeholder, type = 'text', onChange }) => (
  <div className="mb-3">
      <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">{label}</label>
      <input 
          type={type} 
          value={value}
          onChange={onChange}
          className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-medium text-stone-800" 
          placeholder={placeholder} 
      />
  </div>
);

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center px-4">
    <p className="text-lg font-bold text-stone-800">{value}</p>
    <p className="text-[10px] text-stone-500 uppercase tracking-wide font-medium">{label}</p>
  </div>
);

const StatusPill: React.FC<{ status: UserStatus; isActive?: boolean; onClick?: () => void }> = ({ status, isActive, onClick }) => {
  const getStatusColor = (s: UserStatus) => {
    switch(s) {
      case 'Working': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Gora': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Plan to go': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Booked': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Happy now': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${getStatusColor(status)} ${isActive ? 'ring-2 ring-offset-1 ring-stone-300 scale-105' : 'opacity-70 hover:opacity-100'}`}
    >
      {status}
    </button>
  );
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onSwitchToHost }) => {
  const [activeTab, setActiveTab] = useState<'Moments' | 'Collectibles' | 'Info'>('Collectibles');
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(user.currentStatus);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Edit Profile State
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
      nickname: 'Maj',
      fullname: user.name,
      phone: '+63 912 345 6789',
      location: user.location || '',
      country: 'Philippines',
      province: 'Misamis Oriental',
      city: 'Cagayan de Oro'
  });
  const [otpSent, setOtpSent] = useState(false);

  // Bio Editing
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio || '');

  // Settings State
  const [settings, setSettings] = useState({
      distanceUnit: 'km', // km or miles
      language: 'English',
      tempUnit: 'C' // C or F
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Sarah liked your photo', time: '2m', read: false },
    { id: 2, text: 'You earned the "Early Bird" badge!', time: '1h', read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const LevelProgress = () => {
    let nextLevelTrips = 10;
    let prevLevelTrips = 0;
    
    if (user.totalTrips >= 10 && user.totalTrips < 20) {
      prevLevelTrips = 10;
      nextLevelTrips = 20;
    } else if (user.totalTrips >= 20 && user.totalTrips < 50) {
      prevLevelTrips = 20;
      nextLevelTrips = 50;
    }
    
    const progress = Math.min(100, Math.max(0, ((user.totalTrips - prevLevelTrips) / (nextLevelTrips - prevLevelTrips)) * 100));

    return (
      <div className="w-full max-w-[180px] mt-2">
        <div className="flex justify-between text-[10px] font-bold text-stone-500 mb-1">
          <span>Level: {user.level}</span>
          <span>{user.totalTrips} / {nextLevelTrips} Trips</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-600" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  };

  const handleVerifyPhone = () => {
    setOtpSent(true);
    alert("OTP Sent to " + editForm.phone);
  };

  return (
    <div className="bg-stone-50 min-h-full pb-24 relative overflow-hidden">
      
      {/* --- EDIT PROFILE MODAL --- */}
      {showEditProfile && (
          <div className="fixed inset-0 z-50 bg-stone-50 flex flex-col animate-slide-in-right">
              <div className="bg-white px-4 py-4 border-b border-stone-200 flex items-center justify-between sticky top-0">
                  <button onClick={() => setShowEditProfile(false)} className="text-stone-500 font-bold text-sm">Cancel</button>
                  <h2 className="font-bold text-lg text-stone-800">Edit Profile</h2>
                  <button onClick={() => setShowEditProfile(false)} className="text-emerald-600 font-bold text-sm">Save</button>
              </div>
              <div className="p-6 overflow-y-auto">
                  <div className="flex flex-col items-center mb-6">
                      <div className="relative">
                          <img src={user.avatarUrl} className="w-24 h-24 rounded-full object-cover opacity-80" />
                          <button className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full text-white font-bold text-xs">
                             <Icon className="w-6 h-6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Icon>
                          </button>
                      </div>
                      <p className="text-emerald-600 text-xs font-bold mt-2">Change Photo</p>
                  </div>

                  <Input label="Nickname" value={editForm.nickname} onChange={e => setEditForm({...editForm, nickname: e.target.value})} />
                  <Input label="Full Name" value={editForm.fullname} onChange={e => setEditForm({...editForm, fullname: e.target.value})} />
                  
                  <div className="mb-4">
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1.5">Phone Number</label>
                      <div className="flex space-x-2">
                           <input 
                              type="tel" 
                              value={editForm.phone} 
                              onChange={e => setEditForm({...editForm, phone: e.target.value})}
                              className="flex-1 p-3 rounded-xl border border-stone-200 bg-stone-50 outline-none text-sm font-bold"
                           />
                           <button 
                             onClick={handleVerifyPhone}
                             className={`px-4 rounded-xl text-xs font-bold ${otpSent ? 'bg-green-100 text-green-700' : 'bg-stone-900 text-white'}`}
                            >
                               {otpSent ? 'Sent' : 'Verify'}
                           </button>
                      </div>
                      {otpSent && (
                          <div className="mt-2 animate-fade-in">
                              <input placeholder="Enter OTP" className="w-full p-2 border border-stone-200 rounded-lg text-sm text-center tracking-widest" />
                              <p className="text-[10px] text-stone-400 mt-1 text-center">We sent a code to verify this number.</p>
                          </div>
                      )}
                  </div>

                  <div className="space-y-3 border-t border-stone-100 pt-4">
                      <h3 className="font-bold text-stone-800 text-sm">Location</h3>
                      <Input label="Country" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
                      <div className="flex space-x-2">
                         <div className="flex-1">
                             <Input label="State / Province" value={editForm.province} onChange={e => setEditForm({...editForm, province: e.target.value})} />
                         </div>
                         <div className="flex-1">
                             <Input label="City / Municipality" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                         </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- PROFILE MENU DRAWER --- */}
      {showMenu && (
          <div className="fixed inset-0 z-40 flex justify-end">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setShowMenu(false)}></div>
              <div className="w-80 bg-white h-full shadow-2xl relative z-50 flex flex-col animate-slide-in-right">
                  <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                      <h2 className="font-bold text-xl text-stone-800">Menu</h2>
                      <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                          <Icon className="w-5 h-5 text-stone-500"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Icon>
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                      {/* Account Section */}
                      <div>
                          <h3 className="text-xs font-bold text-stone-400 uppercase mb-3 px-2">Account</h3>
                          <div className="space-y-1">
                              <button onClick={() => { setShowMenu(false); setShowEditProfile(true); }} className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors text-left group">
                                  <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100"><Icon className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon></div>
                                      <span className="font-bold text-sm text-stone-700">Profile Info</span>
                                  </div>
                                  <Icon className="w-4 h-4 text-stone-300"><polyline points="9 18 15 12 9 6" /></Icon>
                              </button>
                              <button onClick={() => alert("Preferences coming soon")} className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors text-left group">
                                  <div className="flex items-center space-x-3">
                                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100"><Icon className="w-4 h-4"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon></div>
                                      <span className="font-bold text-sm text-stone-700">Preferences</span>
                                  </div>
                                  <Icon className="w-4 h-4 text-stone-300"><polyline points="9 18 15 12 9 6" /></Icon>
                              </button>
                          </div>
                      </div>

                      {/* Settings Section */}
                      <div>
                          <h3 className="text-xs font-bold text-stone-400 uppercase mb-3 px-2">Settings</h3>
                          <div className="bg-stone-50 rounded-2xl p-2 space-y-1">
                              <div className="flex items-center justify-between p-3">
                                  <span className="text-sm font-medium text-stone-600">Distance Unit</span>
                                  <button 
                                    onClick={() => setSettings({...settings, distanceUnit: settings.distanceUnit === 'km' ? 'mi' : 'km'})}
                                    className="bg-white border border-stone-200 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                                  >
                                      {settings.distanceUnit === 'km' ? 'KM' : 'Miles'}
                                  </button>
                              </div>
                              <div className="flex items-center justify-between p-3 border-t border-stone-100">
                                  <span className="text-sm font-medium text-stone-600">Temperature</span>
                                  <button 
                                    onClick={() => setSettings({...settings, tempUnit: settings.tempUnit === 'C' ? 'F' : 'C'})}
                                    className="bg-white border border-stone-200 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
                                  >
                                      °{settings.tempUnit}
                                  </button>
                              </div>
                              <div className="flex items-center justify-between p-3 border-t border-stone-100">
                                  <span className="text-sm font-medium text-stone-600">Language</span>
                                  <span className="text-xs font-bold text-stone-400">English</span>
                              </div>
                          </div>
                      </div>

                       {/* General Section */}
                      <div>
                           <h3 className="text-xs font-bold text-stone-400 uppercase mb-3 px-2">General</h3>
                           <div className="space-y-1">
                              <button className="w-full flex items-center p-3 hover:bg-stone-50 rounded-xl transition-colors text-left text-sm font-medium text-stone-600">
                                  <Icon className="w-4 h-4 mr-3 text-stone-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>
                                  About Gora
                              </button>
                              <button className="w-full flex items-center p-3 hover:bg-stone-50 rounded-xl transition-colors text-left text-sm font-medium text-stone-600">
                                  <Icon className="w-4 h-4 mr-3 text-stone-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Icon>
                                  Invite (Voucher)
                              </button>
                              <button className="w-full flex items-center justify-between p-3 hover:bg-stone-50 rounded-xl transition-colors text-left text-sm font-medium text-stone-600">
                                  <div className="flex items-center">
                                     <Icon className="w-4 h-4 mr-3 text-stone-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Icon>
                                     Messages
                                  </div>
                                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">1</span>
                              </button>
                           </div>
                      </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-5 border-t border-stone-100 space-y-3 bg-stone-50">
                      <button onClick={onSwitchToHost} className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-bold shadow-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 mr-2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></Icon>
                          Switch to Host
                      </button>
                      <button onClick={onLogout} className="w-full py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors">
                          Log Out
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Top Bar */}
      <div className="bg-white p-4 flex justify-between items-center sticky top-0 z-20 border-b border-stone-50">
        <h1 className="font-bold text-lg text-stone-800">Profile</h1>
        <div className="flex space-x-4">
          <button className="relative" onClick={() => setShowNotifications(!showNotifications)}>
            <Icon className="w-6 h-6 text-stone-600"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-30">
                 <div className="p-3 border-b border-stone-50 font-bold text-xs text-stone-500">Notifications</div>
                 {notifications.map(n => (
                   <div key={n.id} className="p-3 hover:bg-stone-50 border-b border-stone-50 flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 mr-2"></div>
                      <div>
                        <p className="text-xs font-medium text-stone-800">{n.text}</p>
                        <p className="text-[10px] text-stone-400">{n.time} ago</p>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </button>
          <button onClick={() => setShowMenu(true)}>
             <Icon className="w-6 h-6 text-stone-600"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></Icon>
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white pt-2 pb-6 rounded-b-3xl shadow-sm relative z-10">
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Story Ring */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full p-1"></div>
            <div className="relative bg-white p-1 rounded-full">
               <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            {/* Edit Status Button */}
            <button 
              onClick={() => setShowStatusPicker(!showStatusPicker)}
              className="absolute bottom-0 right-0 bg-stone-900 text-white p-1.5 rounded-full border-4 border-white hover:scale-110 transition-transform"
            >
               <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
            </button>
          </div>

          {/* Status Picker Popover */}
          {showStatusPicker && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 animate-fade-in max-w-xs">
               {(['Working', 'Gora', 'Plan to go', 'Booked', 'Happy now'] as UserStatus[]).map(status => (
                 <StatusPill 
                    key={status} 
                    status={status} 
                    isActive={currentStatus === status} 
                    onClick={() => { setCurrentStatus(status); setShowStatusPicker(false); }}
                 />
               ))}
            </div>
          )}

          <div className="mt-3 text-center">
            <h1 className="text-xl font-bold text-stone-800">{editForm.nickname}</h1>
            <p className="text-xs text-stone-500">{editForm.city}, {editForm.province}</p>
            
            {/* Current Status Display */}
            {!showStatusPicker && (
              <div className="mt-2">
                 <StatusPill status={currentStatus} isActive={true} />
              </div>
            )}
          </div>

          <LevelProgress />

          {/* Editable Bio */}
          <div className="mt-4 px-4 w-full max-w-xs">
              {isEditingBio ? (
                  <div className="animate-fade-in relative">
                      <textarea 
                          value={bioText} 
                          onChange={(e) => setBioText(e.target.value)} 
                          className="w-full text-sm text-stone-600 text-center bg-stone-50 p-2 rounded-lg border border-emerald-300 focus:outline-none italic"
                          rows={2}
                          autoFocus
                      />
                      <div className="flex justify-center space-x-2 mt-1">
                          <button onClick={() => setIsEditingBio(false)} className="text-[10px] font-bold text-stone-400">Cancel</button>
                          <button onClick={() => setIsEditingBio(false)} className="text-[10px] font-bold text-emerald-600">Save</button>
                      </div>
                  </div>
              ) : (
                  <div 
                    onClick={() => setIsEditingBio(true)}
                    className="group relative cursor-pointer"
                  >
                     <p className="text-sm text-stone-600 text-center italic">"{bioText}"</p>
                     <div className="absolute top-0 -right-4 opacity-0 group-hover:opacity-100 transition-opacity text-stone-300">
                         <Icon className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Icon>
                     </div>
                  </div>
              )}
          </div>

          <div className="flex justify-center items-center w-full mt-6 border-t border-stone-100 pt-4 divide-x divide-stone-100">
            <Stat value={user.totalTrips} label="Total Trips" />
            <Stat value={user.followers} label="Followers" />
            <Stat value={user.following} label="Following" />
          </div>

          <div className="flex space-x-2 mt-6 w-full px-6">
              <button onClick={() => setShowEditProfile(true)} className="flex-1 py-2 bg-stone-900 text-white rounded-lg text-sm font-bold">Edit Profile</button>
              <button className="flex-1 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-bold border border-stone-200">Share Profile</button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-4 px-4 sticky top-[70px] z-10">
        <div className="bg-white rounded-xl p-1.5 flex justify-between shadow-sm border border-stone-100">
          {[
            { id: 'Moments', icon: <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /> },
            { id: 'Collectibles', icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
            { id: 'Info', icon: <circle cx="12" cy="12" r="10" /> },
          ].map((tab) => (
             <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 flex items-center justify-center space-x-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-100'
                  : 'text-stone-400 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'fill-current' : ''}`}>{tab.icon}</Icon>
              <span className="hidden sm:inline">{tab.id}</span>
              {/* Mobile abbreviated labels if needed, currently showing full */}
              <span className="sm:hidden text-xs">{tab.id === 'Collectibles' ? 'Badges' : tab.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        
        {/* MOMENTS TAB (Instagram-like Feed) */}
        {activeTab === 'Moments' && (
          <div className="animate-fade-in">
              {/* Story Highlights */}
              <div className="flex space-x-4 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                  {['Baguio', 'Surigao', 'Cebu', 'Davao'].map((loc, i) => (
                      <div key={i} className="flex flex-col items-center space-y-1 min-w-[60px]">
                          <div className="w-14 h-14 rounded-full border border-stone-200 p-0.5">
                              <div className="w-full h-full bg-stone-200 rounded-full overflow-hidden">
                                  <img src={`https://picsum.photos/seed/${loc}/100/100`} className="w-full h-full object-cover" />
                              </div>
                          </div>
                          <span className="text-[10px] text-stone-600">{loc}</span>
                      </div>
                  ))}
                  <div className="flex flex-col items-center space-y-1 min-w-[60px]">
                      <div className="w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center bg-white text-stone-300">
                          <Icon className="w-6 h-6"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
                      </div>
                      <span className="text-[10px] text-stone-600">New</span>
                  </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
                  {user.posts?.map((post) => (
                      <div key={post.id} className="aspect-square relative group cursor-pointer">
                          <img src={post.imageUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white space-x-1">
                              <Icon className="w-4 h-4 fill-white"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Icon>
                              <span className="text-xs font-bold">{post.likes}</span>
                          </div>
                      </div>
                  ))}
                   {/* Placeholder for empty state */}
                   <div className="aspect-square bg-stone-100 flex items-center justify-center text-stone-300">
                       <Icon className="w-8 h-8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Icon>
                   </div>
              </div>
          </div>
        )}

        {/* COLLECTIBLES TAB (Passport) */}
        {activeTab === 'Collectibles' && (
          <div className="space-y-6 animate-fade-in">
              {/* Stamps Section */}
              <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="font-bold text-orange-800 flex items-center">
                         <Icon className="w-5 h-5 mr-2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /></Icon>
                         Adventure Stamps
                      </h3>
                      <span className="bg-white/50 px-2 py-1 rounded-lg text-xs font-bold text-orange-700">{user.stamps} Collected</span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 relative z-10">
                      {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className={`aspect-square rounded-lg flex items-center justify-center border-2 border-dashed ${i < user.stamps ? 'bg-white border-orange-300 shadow-sm rotate-1' : 'bg-transparent border-orange-200/50'}`}>
                              {i < user.stamps ? (
                                  <Icon className="w-6 h-6 text-orange-500 opacity-80"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></Icon>
                              ) : (
                                  <span className="text-orange-200 text-xs font-bold">{i + 1}</span>
                              )}
                          </div>
                      ))}
                  </div>
                  <p className="text-[10px] text-orange-600/70 mt-4 text-center font-medium relative z-10">
                      Complete a trip & write a review to earn a stamp!
                  </p>
                  {/* Background decoration */}
                  <div className="absolute -right-10 -bottom-10 opacity-5">
                      <Icon className="w-48 h-48"><circle cx="12" cy="12" r="10"/></Icon>
                  </div>
              </div>

              {/* Badges Section */}
              <div>
                  <h3 className="font-bold text-stone-800 mb-3 px-1">Badges & Achievements</h3>
                  <div className="grid grid-cols-2 gap-3">
                      {user.badges?.map((badge) => (
                          <div key={badge.id} className={`p-3 rounded-xl border flex items-center space-x-3 ${badge.isLocked ? 'bg-stone-50 border-stone-100 opacity-60 grayscale' : 'bg-white border-stone-200 shadow-sm'}`}>
                              <img src={badge.imageUrl} alt={badge.name} className="w-10 h-10" />
                              <div>
                                  <p className="font-bold text-xs text-stone-800">{badge.name}</p>
                                  <p className="text-[10px] text-stone-500">{badge.category}</p>
                              </div>
                              {badge.isLocked && <Icon className="w-3 h-3 text-stone-400 ml-auto"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Icon>}
                          </div>
                      ))}
                  </div>
                  <button className="w-full mt-3 py-2 text-xs text-stone-500 font-bold border border-stone-200 rounded-lg hover:bg-stone-50">View Leaderboard</button>
              </div>
          </div>
        )}

        {/* INFO TAB */}
        {activeTab === 'Info' && (
            <div className="space-y-4 animate-fade-in">
                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-stone-800">Personal Details</h3>
                        <button onClick={() => setShowEditProfile(true)} className="text-xs font-bold text-emerald-600">Edit</button>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-stone-500">Full Name</span>
                            <span className="font-medium text-stone-800">{editForm.fullname}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Nickname</span>
                            <span className="font-medium text-stone-800">{editForm.nickname}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Phone</span>
                            <span className="font-medium text-stone-800">{editForm.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Location</span>
                            <span className="font-medium text-stone-800">{editForm.city}, {editForm.province}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                    <h3 className="font-bold text-stone-800 mb-4">Preferences</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Beach', 'Coffee', 'Hiking', 'Local Food', 'Photography'].map(p => (
                            <span key={p} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">{p}</span>
                        ))}
                        <button className="px-3 py-1 border border-dashed border-emerald-300 text-emerald-600 text-xs font-bold rounded-full hover:bg-emerald-50">+ Add</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProfileScreen;
