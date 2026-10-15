import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useProfile from '../hooks/useProfile';
import ProfileHero from '../components/ProfileHero';
import PersonalInfoTab from '../components/PersonalInfoTab';
import CustomerInfoTab from '../components/CustomerInfoTab';
import SecurityTab from '../components/SecurityTab';

export const MyProfile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'personal';
  const [activeTab, setActiveTab] = useState(initialTab);

  const {
    user,
    customerProfile,
    stats,
    isLoading,
    isUpdatingUser,
    isSavingCustomer,
    isChangingPassword,
    isUploadingAvatar,
    toast,
    clearToast,
    handleUpdatePersonalInfo,
    handleUploadAvatarFile,
    handleSaveCustomerInfo,
    handleChangePassword,
  } = useProfile();

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const tabs = [
    {
      id: 'personal',
      label: 'Thông tin cá nhân',
      icon: 'person',
      badge: null,
    },
    {
      id: 'customer',
      label: 'Hồ sơ khách hàng',
      icon: 'badge',
      badge: 'Đặt tour',
    },
    {
      id: 'security',
      label: 'Đổi mật khẩu',
      icon: 'shield_lock',
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-500/95 text-white border-emerald-400'
                : 'bg-rose-500/95 text-white border-rose-400'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
            <button
              type="button"
              onClick={clearToast}
              className="ml-2 hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-800 font-bold">Hồ sơ cá nhân</span>
        </div>

        {/* Profile Hero with Avatar & Stats */}
        {isLoading ? (
          <div className="rounded-3xl bg-slate-200 h-64 animate-pulse mb-8" />
        ) : (
          <ProfileHero
            user={user}
            stats={stats}
            isUploadingAvatar={isUploadingAvatar}
            onUploadAvatar={handleUploadAvatarFile}
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
          />
        )}

        {/* Main Content: Left Nav Tabs + Right Tab Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Navigation Tabs & Quick Links */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-sky-500/20'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[20px]">
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-sky-50 text-primary'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pt-1 mb-1">
                Lối tắt tiện ích
              </h3>

              <Link
                to="/my-bookings"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-sky-500 group-hover:scale-110 transition-transform">
                    receipt_long
                  </span>
                  <span>Đơn đặt tour của tôi</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/favourites"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-rose-500 group-hover:scale-110 transition-transform">
                    favorite
                  </span>
                  <span>Điểm đến yêu thích</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/destinations"
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-cyan-600 group-hover:scale-110 transition-transform">
                    travel_explore
                  </span>
                  <span>Khám phá điểm đến</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Tab Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse space-y-6">
                <div className="h-6 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-slate-100 rounded-2xl" />
                  <div className="h-12 bg-slate-100 rounded-2xl" />
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'personal' && (
                  <PersonalInfoTab
                    user={user}
                    isUpdating={isUpdatingUser}
                    onSubmit={handleUpdatePersonalInfo}
                    isUploadingAvatar={isUploadingAvatar}
                    onUploadAvatar={handleUploadAvatarFile}
                  />
                )}

                {activeTab === 'customer' && (
                  <CustomerInfoTab
                    customer={customerProfile}
                    isSaving={isSavingCustomer}
                    onSubmit={handleSaveCustomerInfo}
                  />
                )}

                {activeTab === 'security' && (
                  <SecurityTab
                    isChanging={isChangingPassword}
                    onSubmit={handleChangePassword}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
