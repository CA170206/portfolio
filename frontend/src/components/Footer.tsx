import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons/SocialIcons';
import { usePortfolioData } from '../context/PortfolioDataContext';

export const Footer: React.FC = () => {
  const { profile, socialLinks } = usePortfolioData();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const github =
    socialLinks.find((item) => item.platform.toLowerCase() === 'github')?.url || '#';

  const linkedin =
    socialLinks.find((item) => item.platform.toLowerCase() === 'linkedin')?.url || '#';

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 dark:border-[#303841] bg-slate-50 dark:bg-[#12161b] text-slate-600 dark:text-[#aeb6c0] transition-colors duration-200">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Main footer row */}
        <div className="flex flex-col gap-8 border-b border-slate-200 dark:border-[#303841] pb-8 md:flex-row md:items-center md:justify-between">
          {/* Brand */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 bg-[#d6a83a]" />

              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                {profile?.name}
              </span>
            </div>

            <p className="mt-3 max-w-lg text-xs leading-6 text-slate-500 dark:text-[#7f8995] sm:text-sm">
              Full-stack developer building practical web applications
              with clean and scalable architecture.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#8f99a5] transition-colors hover:text-slate-900 dark:hover:text-[#f4f5f6]"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="h-4 w-4" />

              <span>GitHub</span>
            </a>

            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#8f99a5] transition-colors hover:text-slate-900 dark:hover:text-[#f4f5f6]"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="h-4 w-4" />

              <span>LinkedIn</span>
            </a>

            <a
              href={profile?.email ? `mailto:${profile.email}` : '#contact'}
              className="group inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#8f99a5] transition-colors hover:text-slate-900 dark:hover:text-[#f4f5f6]"
              aria-label="Email Me"
            >
              <Mail className="h-4 w-4" />

              <span>Email</span>
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-2 border-l border-slate-200 dark:border-[#303841] pl-5 text-xs font-medium text-slate-500 dark:text-[#8f99a5] transition-colors hover:text-[#b48316] dark:hover:text-[#d6a83a]"
              aria-label="Back to top"
            >
              <span>Back to top</span>

              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col gap-3 pt-6 text-[11px] text-slate-400 dark:text-[#69737e] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile?.name}. All rights
            reserved.
          </p>

          <p className="tracking-wide">
         
          </p>
        </div>
      </div>
    </footer>
  );
};