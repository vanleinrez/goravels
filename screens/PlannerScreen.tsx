import React from 'react';
import Icon from '../components/Icon';
import { mockTrips } from '../constants';

const PlannerScreen: React.FC = () => {
  return (
    <div className="p-4 min-h-full bg-stone-50">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Your Planner</h1>
      
      <div className="space-y-6">
        {/* Itinerary Builder CTA */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-stone-800">Create New Trip</h3>
                <p className="text-xs text-stone-500 mt-1">Use AI to build your rural itinerary</p>
            </div>
            <button className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white hover:bg-stone-700">
                <Icon className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Icon>
            </button>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-emerald-100 ml-3 space-y-8 pl-6 py-2">
             {mockTrips.map((trip) => (
                 <div key={trip.id} className="relative">
                     <span className={`absolute -left-[31px] top-2 w-4 h-4 rounded-full border-2 border-white ${trip.status === 'Upcoming' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`}></span>
                     <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
                         <div className="flex space-x-4">
                             <img src={trip.imageUrl} alt={trip.title} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                             <div className="flex-1">
                                 <div className="flex justify-between items-start">
                                     <h3 className="font-bold text-stone-800">{trip.title}</h3>
                                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${trip.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
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