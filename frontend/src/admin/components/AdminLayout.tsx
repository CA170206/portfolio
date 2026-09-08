import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-[#faf9f6] text-slate-900 transition-colors duration-200 dark:bg-[#12161b] dark:text-[#f4f5f6]">
      {/* Subtle technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 opacity-[0.018] dark:opacity-[0.028]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminHeader
          onToggleSidebar={() =>
            setSidebarOpen((prev) => !prev)
          }
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;