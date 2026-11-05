import React from "react";

export const CollectionItem = ({
  collection,
  isSelected,
  onSelect,
}) => {
  if (!collection) return null;

  const count =
    collection.destinationsCount || collection.destinations?.length || 0;

  return (
    <div
      onClick={() => onSelect && onSelect(collection)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 p-6 flex flex-col justify-end min-h-[220px] shadow-sm hover:shadow-hover hover:-translate-y-1 ${
        isSelected
          ? "ring-4 ring-primary ring-offset-2"
          : "border border-slate-100 hover:border-slate-300"
      }`}
    >
      {/* Background Image */}
      <img
        src={
          collection.image ||
          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80"
        }
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

      {/* Badges & Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
            {count} điểm đến
          </span>
          {isSelected && (
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[16px]">
                check
              </span>
            </span>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors mb-1.5 leading-snug">
            {collection.name}
          </h3>
          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionItem;

