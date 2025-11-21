
import React from 'react';
import type { Listing } from '../types';
import Icon from './Icon';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="flex-shrink-0 w-64 mr-4 bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img className="h-40 w-full object-cover" src={listing.imageUrl} alt={listing.title} />
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
        <p className="text-sm text-gray-500 truncate">{listing.location}</p>
        <div className="flex items-center mt-2">
          <Icon className="w-4 h-4 text-yellow-500 fill-current">
             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </Icon>
          <span className="ml-1 text-sm font-semibold">{listing.rating.toFixed(1)}</span>
          <span className="ml-2 text-sm text-gray-400">({listing.reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
