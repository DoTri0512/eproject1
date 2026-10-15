import React, { useState, useEffect, useRef } from 'react';
import useDebounce from '../../../../hooks/useDebounce';

export const DestinationSearch = ({ value, onChange, placeholder = 'Tìm kiếm điểm đến theo tên, từ khóa hoặc vị trí...' }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const onChangeRef = useRef(onChange);

  // Keep ref up-to-date without adding onChange to the effect deps
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    onChangeRef.current(debouncedSearch);
  }, [debouncedSearch]);

  // Sync controlled value from parent (e.g. filter reset) without causing loop
  const prevValueRef = useRef(value);
  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setSearchTerm(value || '');
    }
  }, [value]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <span className="material-symbols-outlined absolute left-4 text-[22px] text-slate-400 pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Xóa tìm kiếm"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DestinationSearch;
