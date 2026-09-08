import React from 'react';
import { Menu, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
}) => {
  const { admin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800/80 bg-[#0d1219]/90 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            Portfolio Content Management
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Admin Info Badge */}
        <div className="flex items-center gap-2.5 rounded-lg border border-zinc-800/80 bg-[#121721] px-3 py-1.5">
          <UserCircle className="h-4 w-4 text-[#d6a83a]" />
          <div className="text-left">
            <span className="block text-xs font-medium text-zinc-200">
              {admin?.name || 'Administrator'}
            </span>
            <span className="block text-[10px] text-zinc-500">
              {admin?.email || 'admin'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#121721] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          title="Sign out of Admin CMS"
          aria-label="Sign out of Admin CMS"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
