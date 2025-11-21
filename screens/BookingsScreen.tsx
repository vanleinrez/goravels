
import React from 'react';
import Icon from '../components/Icon';

const BookingsScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
       <div className="p-4 bg-blue-100 rounded-full mb-4">
        <Icon className="w-12 h-12 text-blue-600">
             <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </Icon>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
      <p className="mt-2 text-gray-500">Your upcoming and past adventures will appear here.</p>
    </div>
  );
};

export default BookingsScreen;
