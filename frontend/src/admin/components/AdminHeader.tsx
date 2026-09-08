import React from 'react';
import {
  Menu,
  LogOut,
  UserCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
}) => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-300 bg-[#faf9f6] px-4 transition-colors dark:border-[#303841] dark:bg-[#12161b] md:px-6">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center border border-slate-300 text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6] md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 bg-[#d6a83a]" />

            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-[#7f8995]">
              Portfolio CMS
            </span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center border border-slate-300 text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
          title={
            isDark
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
          aria-label={
            isDark
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
        >
          {isDark ? (
            <Sun className="h-3.5 w-3.5 text-[#d6a83a]" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Admin Information */}
        <div className="hidden items-center gap-2 border-l border-slate-300 pl-3 dark:border-[#303841] sm:flex">
          <UserCircle className="h-4 w-4 text-[#d6a83a]" />

          <div className="min-w-0">
            <span className="block max-w-[150px] truncate text-[10px] font-medium text-slate-800 dark:text-[#f4f5f6]">
              {admin?.name || 'Administrator'}
            </span>

            <span className="block max-w-[180px] truncate text-[9px] text-slate-400 dark:text-[#7f8995]">
              {admin?.email || 'admin'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <span className="hidden h-5 w-px bg-slate-300 dark:bg-[#303841] sm:block" />

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          className="flex h-8 items-center gap-1.5 border border-slate-300 px-2.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-red-300 hover:text-red-600 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-red-500/30 dark:hover:text-red-400"
          title="Sign out of Admin CMS"
          aria-label="Sign out of Admin CMS"
        >
          <LogOut className="h-3 w-3" />

          <span className="hidden sm:inline">
            Sign Out
          </span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;