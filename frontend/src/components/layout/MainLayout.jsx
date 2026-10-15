import React from 'react';
import { Outlet } from 'react-router-dom';
import UnifiedHeader from './UnifiedHeader';
import UnifiedFooter from './UnifiedFooter';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-700">
      <UnifiedHeader />
      <main className="flex-1 pt-[72px]">
        <Outlet />
      </main>
      <UnifiedFooter />
    </div>
  );
};

export default MainLayout;
