import React from 'react';

export const PassengerForm = ({ guests, onChange }) => {
  const handleGuestChange = (index, field, value) => {
    const updated = [...guests];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {guests.map((guest, idx) => {
        const isLeader = idx === 0;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 transition-all hover:border-sky-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[11px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>
                  {isLeader ? 'Hành khách 1 (Trưởng đoàn)' : `Hành khách ${idx + 1}`}
                </span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {guest.type === 'child' ? 'Trẻ em' : guest.type === 'infant' ? 'Em bé' : 'Người lớn'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Họ và tên đầy đủ *
                </label>
                <input
                  type="text"
                  required
                  value={guest.fullName || ''}
                  onChange={(e) => handleGuestChange(idx, 'fullName', e.target.value)}
                  placeholder="NGUYEN VAN A"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm uppercase font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Giới tính
                </label>
                <select
                  value={guest.gender || 'Nam'}
                  onChange={(e) => handleGuestChange(idx, 'gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isLeader ? 'Số CCCD / Hộ chiếu *' : 'Ngày sinh / Năm sinh'}
                </label>
                <input
                  type="text"
                  value={isLeader ? guest.idCardNumber || '' : guest.dob || ''}
                  onChange={(e) =>
                    handleGuestChange(
                      idx,
                      isLeader ? 'idCardNumber' : 'dob',
                      e.target.value
                    )
                  }
                  placeholder={isLeader ? '079095012345' : 'DD/MM/YYYY'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PassengerForm;
