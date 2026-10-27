import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';

export const GuideFormModal = ({
  isOpen,
  onClose,
  guide,
  allDestinations = [],
  onSave,
  isLoading = false,
}) => {
  const isEditing = !!guide;

  const [formData, setFormData] = useState({
    name: '',
    specialisation: 'Văn hóa & Lịch sử',
    languages: 'Tiếng Việt, Tiếng Anh',
    background: '',
    biography: '',
    destinations: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (guide) {
      setFormData({
        name: guide.name || '',
        specialisation: guide.specialisation || 'Văn hóa & Lịch sử',
        languages: Array.isArray(guide.languages)
          ? guide.languages.join(', ')
          : guide.languages || 'Tiếng Việt',
        background: guide.background || '',
        biography: guide.biography || '',
        destinations: Array.isArray(guide.destinations)
          ? guide.destinations.map((d) => (typeof d === 'object' ? d._id : d))
          : [],
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        specialisation: 'Văn hóa & Lịch sử',
        languages: 'Tiếng Việt, Tiếng Anh',
        background: '',
        biography: '',
        destinations: [],
      });
      setErrors({});
    }
  }, [guide, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleToggleDestination = (destId) => {
    setFormData((prev) => {
      const current = prev.destinations || [];
      if (current.includes(destId)) {
        return { ...prev, destinations: current.filter((id) => id !== destId) };
      } else {
        return { ...prev, destinations: [...current, destId] };
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên hướng dẫn viên';
    }
    if (!formData.specialisation.trim()) {
      newErrors.specialisation = 'Vui lòng nhập chuyên môn';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      specialisation: formData.specialisation.trim(),
      languages: formData.languages
        ? formData.languages
            .split(',')
            .map((lang) => lang.trim())
            .filter(Boolean)
        : ['Tiếng Việt'],
      background: formData.background.trim(),
      biography: formData.biography.trim(),
      destinations: formData.destinations,
    };

    onSave(payload);
  };

  const commonSpecialisations = [
    'Văn hóa & Lịch sử',
    'Khám phá & Trekking',
    'Leo núi & Mạo hiểm',
    'Sinh thái & Thiên nhiên',
    'Nhiếp ảnh & Cảnh quan',
    'Ẩm thực & Đời sống địa phương',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Hồ Sơ Hướng Dẫn Viên' : 'Thêm Mới Hướng Dẫn Viên'}
      subtitle={
        isEditing
          ? `Cập nhật thông tin cho "${guide?.name}"`
          : 'Tạo mới hồ sơ hướng dẫn viên du lịch chuyên nghiệp'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-1">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <Input
              name="name"
              placeholder="VD: Nguyễn Văn An"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Lĩnh vực chuyên môn <span className="text-rose-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="specialisation"
                list="specialisations-list"
                value={formData.specialisation}
                onChange={handleChange}
                placeholder="Chọn hoặc nhập chuyên môn"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
              <datalist id="specialisations-list">
                {commonSpecialisations.map((spec) => (
                  <option key={spec} value={spec} />
                ))}
              </datalist>
            </div>
            {errors.specialisation && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.specialisation}
              </p>
            )}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Ngôn ngữ thành thạo (cách nhau bởi dấu phẩy)
          </label>
          <Input
            name="languages"
            placeholder="VD: Tiếng Việt, Tiếng Anh, Tiếng Pháp"
            value={formData.languages}
            onChange={handleChange}
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Gợi ý: Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Trung, Tiếng Nhật, Tiếng Hàn
          </p>
        </div>

        {/* Background & Bio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kinh nghiệm / Bối cảnh nghề nghiệp (Background)
            </label>
            <textarea
              name="background"
              rows={3}
              value={formData.background}
              onChange={handleChange}
              placeholder="VD: Cử nhân Du lịch - ĐH Khoa học Xã hội & Nhân văn, 8 năm kinh nghiệm dẫn đoàn quốc tế..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tiểu sử / Phong cách dẫn tour (Biography)
            </label>
            <textarea
              name="biography"
              rows={3}
              value={formData.biography}
              onChange={handleChange}
              placeholder="VD: Hăng hái, nhiệt huyết và am hiểu sâu sắc về kiến trúc, văn hóa bản địa vùng Tây Bắc..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Destinations selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Điểm đến phụ trách ({formData.destinations.length} điểm đã chọn)
            </label>
            <span className="text-xs text-slate-400">
              Nhấp chọn để thêm hoặc bỏ điểm đến
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {allDestinations.map((dest) => {
              const isSelected = formData.destinations.includes(dest._id);
              return (
                <div
                  key={dest._id}
                  onClick={() => handleToggleDestination(dest._id)}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 ${
                      isSelected ? 'text-primary' : 'text-slate-300'
                    }`}
                  >
                    {isSelected ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                  <div className="min-w-0 flex-1 text-xs truncate">
                    <span className="truncate block font-medium">{dest.name}</span>
                    <span className="text-[10px] text-slate-400 block">{dest.region}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Lưu Thay Đổi' : 'Tạo Mới Hướng Dẫn Viên'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GuideFormModal;
