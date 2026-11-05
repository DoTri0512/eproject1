import React from "react";
import { Link } from "react-router-dom";

export const DestinationRelatedSection = ({ relatedList }) => {
  if (!relatedList || relatedList.length === 0) return null;

  return (
    <section className="mt-16 mb-12">
      <div className="mb-6">
        <span className="text-xs font-bold text-primary tracking-wider uppercase">
          GỢI Ý THÊM
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Điểm Đến Cùng Khu Vực Nên Ghé Thăm
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedList.map((rel, idx) => {
          const target = typeof rel === "object" ? rel : null;
          if (!target) return null;
          return (
            <Link
              key={target._id || idx}
              to={`/destinations/${target.slug || target._id}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={target.image}
                  alt={target.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-primary">
                  {target.region || "Việt Nam"}
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base line-clamp-1 mb-1">
                  {target.name}
                </h4>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    location_on
                  </span>
                  <span className="truncate">{target.location}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default DestinationRelatedSection;

