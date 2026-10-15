import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';

export const DestinationFormModal = ({
  isOpen,
  onClose,
  destination,
  onSave,
  isLoading = false,
}) => {
  const isEditing = !!destination;

  const [formData, setFormData] = useState({
    name: '',
    region: 'Miền Bắc',
    theme: 'Biển đảo',
    image: '',
    location: '',
    climate: '',
    overview: '',
    attractions: '',
    activities: '',
    bestSeason: '',
    visitDuration: '2 - 3 ngày',
    budgetBand: 'Trung bình',
    transport: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name || '',
        region: destination.region || 'Miền Bắc',
        theme: destination.theme || 'Biển đảo',
        image: destination.image || '',
        location: destination.location || '',
        climate: destination.climate || '',
        overview: destination.overview || '',
        attractions: Array.isArray(destination.attractions)
          ? destination.attractions.join(', ')
          : destination.attractions || '',
        activities: Array.isArray(destination.activities)
          ? destination.activities.join(', ')
          : destination.activities || '',
        bestSeason: destination.bestSeason || '',
        visitDuration: destination.visitDuration || '2 - 3 ngày',
        budgetBand: destination.budgetBand || 'Trung bình',
        transport: destination.transport || '',
      });
    } else {
      setFormData({
        name: '',
        region: 'Miền Bắc',
        theme: 'Biển đảo',
        image: '',
        location: '',
        climate: '',
        overview: '',
        attractions: '',
        activities: '',
        bestSeason: '',
        visitDuration: '2 - 3 ngày',
        budgetBand: 'Trung bình',
        transport: '',
      });
    }
    setErrors({});
  }, [destination, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Vui lòng nhập tên điểm đến';
    if (!formData.region) errs.region = 'Vui lòng chọn vùng miền';
    if (!formData.image.trim()) errs.image = 'Vui lòng nhập URL ảnh đại diện';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      name: formData.name.trim(),
      attractions: formData.attractions
        ? formData.attractions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      activities: formData.activities
        ? formData.activities.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    onSave(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Thông Tin Điểm Đến' : 'Thêm Mới Điểm Đến Du Lịch'}
      subtitle="Dữ liệu sẽ được lưu trữ trực tiếp vào cơ sở dữ liệu MongoDB Atlas"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
        {/* Row 1: Name & Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên điểm đến"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ví dụ: Vịnh Hạ Long, Hội An..."
            error={errors.name}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Vùng miền <span className="text-error">*</span>
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full h-11 px-3 text-sm rounded-lg bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="Miền Bắc">Miền Bắc</option>
              <option value="Miền Trung">Miền Trung</option>
              <option value="Miền Nam">Miền Nam</option>
              <option value="Tây Nguyên">Tây Nguyên</option>
            </select>
          </div>
        </div>

        {/* Row 2: Theme & Budget Band */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Chủ đề du lịch
            </label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full h-11 px-3 text-sm rounded-lg bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="Biển đảo">Biển đảo</option>
              <option value="Di sản">Di sản</option>
              <option value="Núi rừng">Núi rừng</option>
              <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
              <option value="Sinh thái">Sinh thái</option>
              <option value="Văn hóa">Văn hóa</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Phân khúc ngân sách
            </label>
            <select
              name="budgetBand"
              value={formData.budgetBand}
              onChange={handleChange}
              className="w-full h-11 px-3 text-sm rounded-lg bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="Tiết kiệm">Tiết kiệm</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao cấp">Cao cấp</option>
            </select>
          </div>
        </div>

        {/* Image URL & Preview */}
        <Input
          label="URL Hình ảnh đại diện"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/photo-..."
          error={errors.image}
          required
        />

        {formData.image && (
          <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
              Xem trước ảnh
            </span>
          </div>
        )}

        {/* Location & Climate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Địa điểm chi tiết (Location)"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="TP. Hạ Long, Quảng Ninh"
          />

          <Input
            label="Đặc điểm khí hậu"
            name="climate"
            value={formData.climate}
            onChange={handleChange}
            placeholder="Nhiệt đới ẩm, 4 mùa rõ rệt"
          />
        </div>

        {/* Best Season & Visit Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Mùa lý tưởng nhất"
            name="bestSeason"
            value={formData.bestSeason}
            onChange={handleChange}
            placeholder="Tháng 4 - Tháng 9"
          />

          <Input
            label="Thời gian đề xuất"
            name="visitDuration"
            value={formData.visitDuration}
            onChange={handleChange}
            placeholder="2 - 3 ngày"
          />
        </div>

        {/* Attractions & Activities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Danh thắng nổi bật (phân cách bằng dấu phẩy)"
            name="attractions"
            value={formData.attractions}
            onChange={handleChange}
            placeholder="Đảo Ti Tốp, Hang Sửng Sốt, Cửa Vạn"
          />

          <Input
            label="Hoạt động gợi ý (phân cách bằng dấu phẩy)"
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            placeholder="Chèo kayak, Tắm biển, Ngắm hoàng hôn"
          />
        </div>

        {/* Transport */}
        <Input
          label="Phương tiện di chuyển (Transport)"
          name="transport"
          value={formData.transport}
          onChange={handleChange}
          placeholder="Cao tốc Hà Nội - Hải Phòng, Sân bay Vân Đồn..."
        />

        {/* Overview TextArea */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Mô tả tổng quan (Overview)
          </label>
          <textarea
            name="overview"
            rows="3"
            value={formData.overview}
            onChange={handleChange}
            placeholder="Nhập bài viết giới thiệu chi tiết về vẻ đẹp và trải nghiệm của điểm đến..."
            className="w-full p-3 text-sm rounded-lg bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Lưu Thay Đổi' : 'Tạo Điểm Đến Mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DestinationFormModal;
