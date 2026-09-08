import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Share2,
  ExternalLink,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/admin/profile',
    label: 'Profile',
    icon: User,
  },
  {
    to: '/admin/projects',
    label: 'Projects',
    icon: FolderKanban,
  },
  {
    to: '/admin/certificates',
    label: 'Certificates',
    icon: Award,
  },
  {
    to: '/admin/experience',
    label: 'Experience',
    icon: Briefcase,
  },
  {
    to: '/admin/education',
    label: 'Education',
    icon: GraduationCap,
  },
  {
    to: '/admin/skills',
    label: 'Skills',
    icon: Code2,
  },
  {
    to: '/admin/social-links',
    label: 'Social Links',
    icon: Share2,
  },
];

export const AdminSidebar: React.FC<
  AdminSidebarProps
> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-slate-300 bg-[#faf9f6] transition-transform duration-200 ease-in-out dark:border-[#303841] dark:bg-[#12161b] md:static md:translate-x-0 ${isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-300 px-5 dark:border-[#303841]">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center border border-[#d6a83a]/40 bg-[#d6a83a]/5">
              <span className="font-mono text-[10px] font-bold text-[#a47d18] dark:text-[#d6a83a]">
                CA
              </span>
            </div>

            <div>
              <span className="block text-xs font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                CA Portfolio
              </span>

              <span className="mt-0.5 block text-[8px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-[#7f8995]">
                Admin CMS
              </span>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center border border-slate-300 text-slate-500 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#7f8995] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6] md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5">
          <div className="mb-2 px-5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-[#7f8995]">
              Content
            </span>
          </div>

          <div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 border-l-2 px-5 py-2.5 text-xs font-medium transition-colors ${isActive
                      ? 'border-[#d6a83a] bg-[#d6a83a]/5 text-slate-900 dark:bg-[#d6a83a]/5 dark:text-[#f4f5f6]'
                      : 'border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-100/70 hover:text-slate-900 dark:text-[#7f8995] dark:hover:border-[#303841] dark:hover:bg-[#181d23] dark:hover:text-[#aeb6c0]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 transition-colors ${isActive
                            ? 'text-[#a47d18] dark:text-[#d6a83a]'
                            : 'text-slate-400 group-hover:text-slate-600 dark:text-[#59636e] dark:group-hover:text-[#aeb6c0]'
                          }`}
                      />

                      <span>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Public Portfolio */}
        <div className="shrink-0 border-t border-slate-300 p-4 dark:border-[#303841]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between px-1 py-2 text-xs text-slate-500 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="h-3.5 w-3.5 text-[#a47d18] transition-colors group-hover:text-[#d6a83a] dark:text-[#d6a83a]" />

              <span>
                Public Portfolio
              </span>
            </span>

            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-slate-400 dark:text-[#59636e]">
              Live
            </span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;