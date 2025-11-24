
import React, { useState } from 'react';
import Icon from '../components/Icon';

interface HostDashboardProps {
  onLogout: () => void;
  status?: 'Pending' | 'Active';
  onSwitchToTraveler: () => void;
}

type Tab = 'Overview' | 'Listings' | 'Calendar' | 'Earnings' | 'Settings';
type BookingStatus = 'Check-In' | 'Check-Out' | 'Completed' | 'Cancelled';
type PaymentStatus = 'Pending' | 'Processing' | 'Paid';

// Mock Data
const MOCK_HOST = {
  name: 'Juan Dela Cruz',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
  rating: 4.8,
  joined: 'October 2023'
};

const MOCK_EARNINGS = {
  available: 15400.00,
  pending: 3200.00,
  payouts: [
    { id: 'p1', date: 'Oct 15, 2023', amount: 12500, status: 'Successful' },
    { id: 'p2', date: 'Sep 30, 2023', amount: 8400, status: 'Successful' },
  ]
};

const MOCK_BOOKINGS = [
  {
    id: 'b1',
    guestName: 'Sarah J.',
    guestAvatar: 'https://picsum.photos/id/1011/50/50',
    listingName: 'Singalong Nature Camp',
    dates: 'Oct 24 - 26',
    guests: 2,
    price: 3428,
    status: 'Check-In' as BookingStatus,
    paymentStatus: 'Paid' as PaymentStatus,
    commission: 342.8,
    tax: 411.36
  },
  {
    id: 'b2',
    guestName: 'Mike R.',
    guestAvatar: 'https://picsum.photos/id/1005/50/50',
    listingName: 'Singalong Nature Camp',
    dates: 'Oct 28 - 30',
    guests: 4,
    price: 6856,
    status: 'Check-In' as BookingStatus,
    paymentStatus: 'Processing' as PaymentStatus,
    commission: 685.6,
    tax: 822.72
  },
  {
    id: 'b3',
    guestName: 'Anna L.',
    guestAvatar: 'https://picsum.photos/id/1027/50/50',
    listingName: 'Hidden Valley Farm',
    dates: 'Oct 20 - 22',
    guests: 2,
    price: 5000,
    status: 'Completed' as BookingStatus,
    paymentStatus: 'Paid' as PaymentStatus,
    commission: 500,
    tax: 600
  }
];

const MOCK_LISTINGS = [
  { id: 'l1', title: 'Singalong Nature Camp', status: 'Active', price: 1714, views: 1205, bookings: 12 },
  { id: 'l2', title: 'Hidden Valley Farm', status: 'Active', price: 2500, views: 850, bookings: 8 },
  { id: 'l3', title: 'Bukidnon Cloud House', status: 'Under Review', price: 3200, views: 0, bookings: 0 },
];

const HostDashboardScreen: React.FC<HostDashboardProps> = ({ onLogout, status = 'Active', onSwitchToTraveler }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const Sidebar = () => (
    <>
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <div className={`absolute top-0 left-0 bottom-0 w-64 bg-white border-r border-stone-200 z-50 transform transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-stone-100">
          <span className="font-bold text-xl tracking-tight text-stone-800">Tara<span className="text-emerald-600">Go</span></span>
          <button onClick={toggleSidebar}><Icon className="w-5 h-5 text-stone-400"><path d="M18 6L6 18M6 6l12 12" /></Icon></button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
               <img src={MOCK_HOST.avatar} className="w-12 h-12 rounded-full border-2 border-stone-100" alt="Host" />
               {status === 'Active' && (
                 <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white">
                    <Icon className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></Icon>
                 </div>
               )}
            </div>
            <div>
              <p className="font-bold text-sm text-stone-800">{MOCK_HOST.name}</p>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                {status} Host
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'Overview', icon: <rect x="3" y="3" width="7" height="7" /> },
              { id: 'Listings', icon: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /> },
              { id: 'Calendar', icon: <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /> },
              { id: 'Earnings', icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
              { id: 'Settings', icon: <circle cx="12" cy="12" r="3" /> }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as Tab); toggleSidebar(); }}
                disabled={status === 'Pending' && item.id !== 'Overview' && item.id !== 'Settings'}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-stone-100 text-emerald-700 font-bold' 
                    : status === 'Pending' && item.id !== 'Overview' && item.id !== 'Settings'
                        ? 'text-stone-300 cursor-not-allowed'
                        : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-5 h-5">{item.icon}</Icon>
                <span className="text-sm">{item.id}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-stone-100 space-y-2">
            {/* Switch to Traveling */}
           <button onClick={onSwitchToTraveler} className="flex items-center text-stone-600 hover:text-emerald-600 text-sm font-medium w-full p-2 hover:bg-stone-50 rounded-lg transition-colors">
              <Icon className="w-4 h-4 mr-3"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></Icon>
              Switch to Traveling
           </button>
           
           <button onClick={onLogout} className="flex items-center text-red-500 hover:text-red-600 text-sm font-medium w-full p-2 hover:bg-red-50 rounded-lg">
             <Icon className="w-4 h-4 mr-3"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
             Log Out
           </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-full bg-stone-50 flex flex-col relative overflow-hidden">
      <Sidebar />

      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-stone-200 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-stone-600 hover:bg-stone-100 rounded-full">
             <Icon className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></Icon>
          </button>
          <h1 className="ml-3 font-bold text-stone-800 text-lg">{activeTab}</h1>
        </div>
        {status === 'Active' && (
            <div className="flex space-x-3">
            <button className="p-2 text-stone-500 hover:bg-stone-100 rounded-full relative">
                <Icon className="w-6 h-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Icon>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            </div>
        )}
      </header>

      {/* --- PENDING STATE VIEW --- */}
      {status === 'Pending' && activeTab === 'Overview' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col animate-fade-in">
              <div className="text-center mb-8 mt-4">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-amber-100">
                      <Icon className="w-10 h-10 text-amber-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Icon>
                  </div>
                  <h2 className="text-2xl font-bold text-stone-800">Application Processing</h2>
                  <p className="text-stone-500 mt-2 max-w-xs mx-auto text-sm">We are reviewing your application. Nothing to show here yet, but we're excited to have you onboard soon!</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
                  <h3 className="font-bold text-stone-800 mb-4 flex items-center">
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-2">ACTION REQUIRED</span>
                      Pending Tasks
                  </h3>
                  <div className="space-y-4">
                      <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full border-2 border-stone-300 mr-3 flex-shrink-0"></div>
                          <div className="flex-1">
                              <p className="text-sm font-bold text-stone-700">Upload PhilSys ID</p>
                              <p className="text-xs text-stone-500 mb-2">Government issued ID is required for verification.</p>
                              <button className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded-lg">Upload Now</button>
                          </div>
                      </div>
                      <div className="w-full h-px bg-stone-100"></div>
                      <div className="flex items-start">
                           <div className="w-5 h-5 rounded-full border-2 border-stone-300 mr-3 flex-shrink-0"></div>
                           <div className="flex-1">
                              <p className="text-sm font-bold text-stone-700">Capacity Building Workshop</p>
                              <p className="text-xs text-stone-500 mb-2">Attend the LGU tourism orientation.</p>
                              <button className="text-xs border border-stone-300 text-stone-600 px-3 py-1.5 rounded-lg">View Schedule</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- ACTIVE STATE VIEW --- */}
      {status === 'Active' && (
        <main className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            
            {/* OVERVIEW */}
            {activeTab === 'Overview' && (
            <div className="space-y-6 animate-fade-in">
                {/* Hero Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                    <h2 className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-4">Performance (Oct)</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-3xl font-bold text-stone-800">₱18,600</p>
                            <p className="text-xs text-emerald-600 font-bold mt-1">Earned</p>
                        </div>
                        <div className="border-l border-stone-100 pl-6">
                            <p className="text-3xl font-bold text-stone-800">4.8</p>
                            <div className="flex items-center text-xs text-stone-500 mt-1">
                                <Icon className="w-3 h-3 text-yellow-400 fill-current mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Icon>
                                Overall Rating
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-stone-800">Reservations</h3>
                        <a href="#" className="text-xs font-bold text-emerald-600">All (3)</a>
                    </div>
                    <div className="space-y-3">
                         {MOCK_BOOKINGS.filter(b => b.status === 'Check-In').map(b => (
                            <div key={b.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100">
                                <div>
                                    <span className="text-[10px] font-bold text-stone-400 uppercase">Checking In Today</span>
                                    <p className="font-bold text-stone-800">{b.guestName}</p>
                                    <p className="text-xs text-stone-500">{b.listingName}</p>
                                </div>
                                <div className="text-right">
                                    <img src={b.guestAvatar} className="w-8 h-8 rounded-full ml-auto mb-1" />
                                </div>
                            </div>
                         ))}
                    </div>
                </div>
            </div>
            )}

            {/* LISTINGS */}
            {activeTab === 'Listings' && (
                <div className="space-y-4 animate-fade-in">
                     {MOCK_LISTINGS.map(listing => (
                        <div key={listing.id} className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 bg-stone-200 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${listing.id}/200/200)` }}></div>
                                <div>
                                    <h3 className="font-bold text-stone-800">{listing.title}</h3>
                                    <p className="text-xs text-stone-500">₱{listing.price} / night</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${
                                        listing.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {listing.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-stone-300 text-stone-500 font-bold rounded-xl text-sm">
                        + Add Another Listing
                    </button>
                </div>
            )}

            {/* CALENDAR */}
            {activeTab === 'Calendar' && (
                <div className="animate-fade-in">
                     <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 text-center mb-4">
                        <h2 className="font-bold text-lg text-stone-800 mb-4">October 2023</h2>
                        <div className="grid grid-cols-7 gap-2 text-sm font-medium">
                            {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                                const isBooked = [20,21,22,24,25,26,28,29,30].includes(day);
                                return (
                                <div key={day} className={`aspect-square flex items-center justify-center rounded-lg ${isBooked ? 'bg-emerald-600 text-white font-bold' : 'text-stone-600 bg-stone-50'}`}>
                                    {day}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* EARNINGS */}
            {activeTab === 'Earnings' && (
                <div className="space-y-6 animate-fade-in pb-10">
                    <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                        <p className="text-stone-400 text-xs font-bold uppercase mb-1">Available Payout</p>
                        <h1 className="text-4xl font-bold mb-4">₱{MOCK_EARNINGS.available.toLocaleString()}</h1>
                        <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2 rounded-lg text-sm font-bold w-full">Claim Payout</button>
                    </div>

                    <div>
                        <h3 className="font-bold text-stone-800 mb-3">Transaction History</h3>
                        <div className="space-y-2">
                             {MOCK_BOOKINGS.map(booking => (
                                <div key={booking.id} className="bg-white p-3 rounded-xl border border-stone-100 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-stone-800">{booking.guestName}</p>
                                        <p className="text-xs text-stone-500">{booking.listingName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-stone-800 text-sm">+ ₱{(booking.price - booking.tax - booking.commission).toFixed(2)}</p>
                                        <p className="text-[10px] text-emerald-600 font-bold">{booking.paymentStatus}</p>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            )}

             {/* SETTINGS */}
             {activeTab === 'Settings' && (
                 <div className="space-y-3 animate-fade-in">
                     {['Account', 'Security', 'Payments', 'Legal'].map(s => (
                         <div key={s} className="bg-white p-4 rounded-xl border border-stone-100 flex justify-between font-bold text-stone-700">
                             {s} <Icon className="w-4 h-4 text-stone-400"><path d="m9 18 6-6-6-6" /></Icon>
                         </div>
                     ))}
                 </div>
             )}

        </main>
      )}
    </div>
  );
};

export default HostDashboardScreen;
