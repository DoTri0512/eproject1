import React, { useState, useEffect } from "react";
import Modal from "../../../../components/common/Modal";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

/**
 * DestinationFormModal - Form Quản trị CRUD Điểm Đến
 * Khớp 100% với Schema MongoDB Destination theo analyst.md:
 * - name (required), region (required), theme, budgetBand
 * - image, location, climate, overview
 * - attractions (String[]), activities (String[])
 * - bestSeason, visitDuration, transport
 * - gallery: [{ url, caption, alt, credit }]
 * - relatedDestinations: ObjectId[]
 */
export const DestinationFormModal = ({
  isOpen,
  onClose,
  destination,
  allDestinations = [],
  onSave,
  isLoading = false,
}) => {
  const isEditing = !!destination;

  const [activeTab, setActiveTab] = useState("basic"); // basic | details | gallery
  const [formData, setFormData] = useState({
    name: "",
    region: "Miền Bắc",
    theme: "Biển đảo",
    image: "",
    location: "",
    climate: "",
    overview: "",
    attractions: "",
    activities: "",
    bestSeason: "",
    visitDuration: "2 - 3 ngày",
    budgetBand: "Phổ thông",
    transport: "",
    gallery: [],
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    url: "",
    caption: "",
    alt: "",
    credit: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (destination) {
      setFormData({
        name: destination.name || "",
        region: destination.region || "Miền Bắc",
        theme: destination.theme || "Biển đảo",
        image: destination.image || "",
        location: destination.location || "",
        climate: destination.climate || "",
        overview: destination.overview || "",
        attractions: Array.isArray(destination.attractions)
          ? destination.attractions.join(", ")
          : destination.attractions || "",
        activities: Array.isArray(destination.activities)
          ? destination.activities.join(", ")
          : destination.activities || "",
        bestSeason: destination.bestSeason || "",
        visitDuration: destination.visitDuration || "2 - 3 ngày",
        budgetBand: destination.budgetBand || "Phổ thông",
        transport: destination.transport || "",
        gallery: Array.isArray(destination.gallery) ? destination.gallery : [],
      });
    } else {
      setFormData({
        name: "",
        region: "Miền Bắc",
        theme: "Biển đảo",
        image: "",
        location: "",
        climate: "",
        overview: "",
        attractions: "",
        activities: "",
        bestSeason: "",
        visitDuration: "2 - 3 ngày",
        budgetBand: "Phổ thông",
        transport: "",
        gallery: [],
      });
    }
    setNewGalleryItem({ url: "", caption: "", alt: "", credit: "" });
    setErrors({});
    setActiveTab("basic");
  }, [destination, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Gallery handlers
  const handleAddGalleryItem = () => {
    if (!newGalleryItem.url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          url: newGalleryItem.url.trim(),
          caption: newGalleryItem.caption.trim() || formData.name,
          alt: newGalleryItem.alt.trim() || formData.name,
          credit: newGalleryItem.credit.trim() || "TravelTrail",
        },
      ],
    }));
    setNewGalleryItem({ url: "", caption: "", alt: "", credit: "" });
  };

  const handleRemoveGalleryItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };



  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Vui lòng nhập tên điểm đến";
    if (!formData.region) errs.region = "Vui lòng chọn vùng miền";
    if (!formData.image.trim()) errs.image = "Vui lòng nhập URL ảnh đại diện";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setActiveTab("basic");
    }
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      name: formData.name.trim(),
      attractions: formData.attractions
        ? formData.attractions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      activities: formData.activities
        ? formData.activities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      gallery: formData.gallery.map((g) => ({
        url: g.url,
        caption: g.caption || formData.name,
        alt: g.alt || formData.name,
        credit: g.credit || "TravelTrail",
      })),
    };

    onSave(payload);
  };



  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing ? "Chỉnh Sửa Thông Tin Điểm Đến" : "Thêm Mới Điểm Đến Du Lịch"
      }
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
        {/* Navigation Tabs inside Modal */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-2">
          {[
            { id: "basic", label: "1. Thông tin chung", icon: "badge" },
            { id: "details", label: "2. Chi tiết & Trải nghiệm", icon: "explore" },
            { id: "gallery", label: `3. Gallery (${formData.gallery.length})`, icon: "photo_library" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: BASIC INFO */}
        {activeTab === "basic" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Vùng miền <span className="text-rose-500">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full h-11 px-3 text-sm rounded-xl bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Chủ đề du lịch
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full h-11 px-3 text-sm rounded-xl bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Phân khúc ngân sách (Budget Band)
                </label>
                <select
                  name="budgetBand"
                  value={formData.budgetBand}
                  onChange={handleChange}
                  className="w-full h-11 px-3 text-sm rounded-xl bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="Tiết kiệm">Tiết kiệm</option>
                  <option value="Phổ thông">Phổ thông</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Cao cấp">Cao cấp</option>
                </select>
              </div>
            </div>

            {/* Image URL & Preview */}
            <Input
              label="URL Hình ảnh đại diện chính (Primary Image)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              error={errors.image}
              required
            />

            {formData.image && (
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/60 text-white text-[11px] font-bold backdrop-blur-xs">
                  Xem trước ảnh đại diện
                </span>
              </div>
            )}

            {/* Overview TextArea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Mô tả tổng quan (Overview)
              </label>
              <textarea
                name="overview"
                rows="3"
                value={formData.overview}
                onChange={handleChange}
                placeholder="Nhập bài viết giới thiệu chi tiết về vẻ đẹp và trải nghiệm của điểm đến..."
                className="w-full p-3 text-sm rounded-xl bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB 2: DETAILS & EXPERIENCES */}
        {activeTab === "details" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            {/* Location & Climate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Vị trí chi tiết (Location)"
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
                placeholder="Nhiệt đới ẩm gió mùa, 4 mùa rõ rệt"
              />
            </div>

            {/* Best Season & Visit Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Mùa lý tưởng nhất trong năm (Best Season)"
                name="bestSeason"
                value={formData.bestSeason}
                onChange={handleChange}
                placeholder="Tháng 4 - Tháng 9"
              />

              <Input
                label="Thời gian lưu trú đề xuất (Visit Duration)"
                name="visitDuration"
                value={formData.visitDuration}
                onChange={handleChange}
                placeholder="2 - 3 ngày"
              />
            </div>

            {/* Attractions & Activities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Danh thắng nổi bật (phân cách bằng dấu phẩy)
                </label>
                <textarea
                  name="attractions"
                  rows="2"
                  value={formData.attractions}
                  onChange={handleChange}
                  placeholder="Đảo Ti Tốp, Hang Sửng Sốt, Làng chài Cửa Vạn"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Hoạt động trải nghiệm gợi ý (dấu phẩy)
                </label>
                <textarea
                  name="activities"
                  rows="2"
                  value={formData.activities}
                  onChange={handleChange}
                  placeholder="Chèo kayak, Tắm biển, Ngắm hoàng hôn trên vịnh"
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl bg-white border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                />
              </div>
            </div>

            {/* Transport */}
            <Input
              label="Phương tiện di chuyển (Transport)"
              name="transport"
              value={formData.transport}
              onChange={handleChange}
              placeholder="Cao tốc Hà Nội - Hải Phòng, Sân bay Vân Đồn..."
            />
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-150">
            <div className="bg-sky-50/60 border border-sky-100 p-3.5 rounded-2xl">
              <span className="text-xs font-bold text-primary block mb-2">
                + Thêm ảnh vào bộ sưu tập (Gallery)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="URL hình ảnh (bắt buộc)"
                  value={newGalleryItem.url}
                  onChange={(e) => setNewGalleryItem((p) => ({ ...p, url: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Chú thích ảnh (Caption)"
                  value={newGalleryItem.caption}
                  onChange={(e) => setNewGalleryItem((p) => ({ ...p, caption: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Mô tả alt text"
                  value={newGalleryItem.alt}
                  onChange={(e) => setNewGalleryItem((p) => ({ ...p, alt: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Nguồn / Credit (ví dụ: TravelTrail Photography)"
                  value={newGalleryItem.credit}
                  onChange={(e) => setNewGalleryItem((p) => ({ ...p, credit: e.target.value }))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
              <button
                type="button"
                onClick={handleAddGalleryItem}
                disabled={!newGalleryItem.url.trim()}
                className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                + Thêm ảnh này vào Gallery
              </button>
            </div>

            {formData.gallery.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-6">
                Chưa có ảnh nào trong bộ sưu tập. Thêm URL ở trên để làm phong phú trang chi tiết!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                {formData.gallery.map((item, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3]"
                  >
                    <img
                      src={item.url}
                      alt={item.alt || "Gallery"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                      <span className="text-[10px] line-clamp-2">{item.caption || "Không có chú thích"}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(idx)}
                        className="self-end px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}



        {/* Form Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            {isEditing ? `ID: ${destination?._id}` : "Tự động sinh slug URL thân thiện"}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {isEditing ? "Lưu Thay Đổi" : "Tạo Điểm Đến Mới"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DestinationFormModal;
