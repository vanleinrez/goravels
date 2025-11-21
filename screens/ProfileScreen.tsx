import React, { useState } from 'react';
import type { User } from '../types';
import { mockListings } from '../constants';
import Icon from '../components/Icon';

interface ProfileScreenProps {
  user: User;
}

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="text-center">
    <p className="text-lg font-bold text-stone-800">{value}</p>
    <p className="text-xs text-stone-500 uppercase tracking-wide">{label}</p>
  </div>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'Stamps' | 'Listings' | 'Settings'>('Stamps');

  return (
    <div className="bg-stone-50 min-h-full">
      <div className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm">
        <div className="flex flex-col items-center">
          <div className="relative">
             <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-full border-2 border-white">
                 <Icon className="w-4 h-4"><path d="m12 15 2 2 4-4"/><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></Icon>
              </div>
          </div>
          
          <h1 className="text-xl font-bold mt-3 text-stone-800">{user.name}</h1>
          <div className="mt-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-sm flex items-center">
              <Icon className="w-3 h-3 mr-1"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></Icon>
              {user.tier} Tier
          </div>
        </div>

        <div className="mt-8 flex justify-around">
          <Stat value={user.stamps} label="Stamps" />
          <Stat value={user.following} label="Following" />
          <Stat value={user.followers} label="Followers" />
        </div>
      </div>
      
      <div className="mt-4 px-4">
        <div className="bg-white rounded-2xl p-2 flex justify-between shadow-sm">
          {['Stamps', 'Listings', 'Settings'].map((tab) => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-center rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pb-20">
        {activeTab === 'Stamps' && (
            <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-xl flex items-center justify-center border-2 border-dashed ${i < user.stamps ? 'bg-orange-50 border-orange-200' : 'bg-stone-100 border-stone-200'}`}>
                        {i < user.stamps ? (
                             <Icon className="w-8 h-8 text-orange-500"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z" /></Icon>
                        ) : (
                            <span className="text-stone-300 font-bold text-xl opacity-50">?</span>
                        )}
                    </div>
                ))}
                <div className="col-span-3 mt-4">
                    <p className="text-center text-xs text-stone-400">Collect stamps by completing verified adventures to unlock the next Tier!</p>
                </div>
            </div>
        )}

        {activeTab === 'Listings' && (
          <div className="space-y-4">
             {mockListings.slice(0,2).map(listing => (
                <div key={listing.id} className="bg-white p-3 rounded-xl shadow-sm flex space-x-3">
                    <img src={listing.imageUrl} className="w-20 h-20 rounded-lg object-cover" />
                    <div>
                        <h3 className="font-bold text-stone-800">{listing.title}</h3>
                        <p className="text-xs text-stone-500">{listing.location}</p>
                        <div className="mt-2 flex items-center text-yellow-500">
                            <Icon className="w-3 h-3 fill-current"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
                            <span className="text-xs ml-1 font-bold text-stone-700">{listing.rating}</span>
                        </div>
                    </div>
                </div>
             ))}
             <button className="w-full py-3 border-2 border-dashed border-emerald-500 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-50">
                 + Create New Adventure
             </button>
          </div>
        )}
        
        {activeTab === 'Settings' && (
            <div className="space-y-2">
                {['Preferences', 'Notifications', 'Privacy Policy', 'Log Out'].map((item) => (
                    <button key={item} className="w-full flex justify-between items-center p-4 bg-white rounded-xl shadow-sm text-left">
                        <span className={`font-medium ${item === 'Log Out' ? 'text-red-500' : 'text-stone-700'}`}>{item}</span>
                        <Icon className="w-4 h-4 text-stone-400"><path d="m9 18 6-6-6-6" /></Icon>
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;