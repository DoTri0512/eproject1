import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowUpRight } from 'lucide-react';

export const DestinationCard = ({ destination, onSelect }) => {
  if (!destination) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex items-center p-2.5 gap-3 w-[240px] shrink-0 text-left">
      <img
        src={destination.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80'}
        alt={destination.name}
        className="w-14 h-14 rounded-lg object-cover shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-slate-800 truncate mb-0.5">
          {destination.name}
        </h4>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mb-1">
          <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
          <span className="truncate">{destination.region || destination.location || 'Việt Nam'}</span>
        </div>
        <Link
          to={`/destinations/${destination.slug || destination._id}`}
          onClick={onSelect}
          className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-sky-600 hover:text-sky-700"
        >
          <span>Khám phá</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default DestinationCard;
