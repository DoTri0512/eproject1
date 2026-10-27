import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import Input from '../../../../components/common/Input';
import Button from '../../../../components/common/Button';

export const CollectionFormModal = ({
  isOpen,
  onClose,
  collection,
  onSave,
  isLoading = false,
}) => {
  const isEditing = !!collection;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || '',
      });
      setErrors({});
    } else {
      setFormData({
        name: '',
        description: '',
      });
      setErrors({});
    }
  }, [collection, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên bộ sưu tập';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Chỉnh Sửa Bộ Sưu Tập' : 'Thêm Mới Bộ Sưu Tập'}
      subtitle={
        isEditing
          ? `Cập nhật thông tin cho bộ sưu tập "${collection?.name}"`
          : 'Tạo mới bộ sưu tập điểm đến theo mùa hoặc chủ đề'
      }
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-1">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tên bộ sưu tập <span className="text-rose-500">*</span>
          </label>
          <Input
            name="name"
            placeholder="VD: Kỳ Nghỉ Cuối Tuần, Hành Trình Di Sản, Mùa Thu Hà Nội..."
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Mô tả bộ sưu tập
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả ý nghĩa, cảm hứng và đối tượng du khách của bộ sưu tập này..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Lưu Thay Đổi' : 'Tạo Mới Bộ Sưu Tập'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CollectionFormModal;
