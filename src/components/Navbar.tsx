import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './icons/SocialIcons';
import { profileData } from '../data/profile';
import { socialLinks } from '../data/socials';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const sections = [
        'hero',
        'about',
        'projects',
        'experience',
        'skills',
        'certificates',
        'education',
        'contact',
      ];

      const scrollPosition = window.scrollY + 140;

      for (const section of sections) {
        const el = document.getElementById(section);

        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (
            scrollPosition >= top &&
            scrollPosition < top + height
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const githubLink =
    socialLinks.find((s) => s.platform === 'GitHub')?.url || 'https://github.com/CA170206';

  const linkedinLink =
    socialLinks.find((s) => s.platform === 'LinkedIn')?.url || 'https://www.linkedin.com/in/chaitanya-anmulwar';

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${
          isScrolled
            ? isDark
              ? 'nav-scrolled-dark backdrop-blur-md'
              : 'nav-scrolled-light backdrop-blur-md'
            : 'bg-transparent'
        }
      `}
    >
      <div
        className="
          max-w-7xl mx-auto
          px-6 lg:px-10
          h-[72px]
          flex items-center justify-between
        "
      >
        {/* Brand */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="
            group
            flex items-center gap-2.5
            shrink-0
          "
          aria-label="Go to homepage"
        >
          <span
            className="
              w-2 h-2
              rounded-[2px]
              bg-[#d6a83a]
              transition-transform duration-300
              group-hover:scale-125
            "
          />

          <div className="flex items-baseline gap-1">
            <span
              className={`
                text-[15px]
                font-semibold
                tracking-[-0.02em]
                transition-colors duration-200
                ${isDark ? 'text-[#f1f0ec]' : 'text-[#12161b]'}
              `}
            >
              {profileData.name}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          className="
            hidden lg:flex
            items-center
            gap-7
            h-full
            absolute
            left-1/2
            -translate-x-1/2
          "
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const sectionId = item.href.replace('#', '');
            const isActive = activeSection === sectionId;

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`
                  relative
                  h-full
                  flex items-center
                  text-[13px]
                  font-medium
                  tracking-[-0.01em]
                  transition-colors duration-200
                  ${
                    isActive
                      ? isDark
                        ? 'text-[#f1f0ec] font-semibold'
                        : 'text-[#0f172a] font-semibold'
                      : isDark
                        ? 'text-[#8f99a5] hover:text-[#d6a83a]'
                        : 'text-[#475569] hover:text-[#b48316]'
                  }
                `}
              >
                <span>{item.label}</span>

                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="
                      absolute
                      left-0 right-0
                      bottom-[20px]
                      h-[2px]
                      bg-[#d6a83a]
                    "
                    transition={{
                      type: 'spring',
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`
              w-9 h-9
              rounded-md
              flex items-center justify-center
              transition-all duration-200
              ${
                isDark
                  ? 'text-[#8f99a5] hover:text-[#d6a83a] hover:bg-white/[0.08]'
                  : 'text-[#64748b] hover:text-[#b48316] hover:bg-slate-100'
              }
            `}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px] text-[#8f99a5] hover:text-[#d6a83a] transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-[#64748b] hover:text-[#b48316] transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          <span className={`h-4 w-px mx-1 ${isDark ? 'bg-[#303841]' : 'bg-slate-200'}`} />

          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-9 h-9
              flex items-center justify-center
              transition-all duration-200
              ${
                isDark
                  ? 'text-[#8f99a5] hover:text-[#f1f0ec]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }
            `}
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-[17px] h-[17px]" />
          </a>

          <a
            href={linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-9 h-9
              flex items-center justify-center
              transition-all duration-200
              ${
                isDark
                  ? 'text-[#8f99a5] hover:text-[#f1f0ec]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }
            `}
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-[17px] h-[17px]" />
          </a>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className={`
              ml-2
              h-9
              px-4
              flex items-center justify-center
              text-[12px]
              font-medium
              transition-all duration-200
              ${
                isDark
                  ? 'border border-[#39424b] bg-[#181d23]/80 text-[#d2d7dc] hover:border-[#d6a83a] hover:text-[#d6a83a] hover:bg-[#d6a83a]/10'
                  : 'border border-slate-300 bg-white/80 text-[#1e293b] hover:border-[#d6a83a] hover:text-[#b48316] hover:bg-[#d6a83a]/10'
              }
            `}
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-1">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`
              w-9 h-9
              flex items-center justify-center
              transition-colors
              ${
                isDark
                  ? 'text-[#8f99a5] hover:text-[#d6a83a]'
                  : 'text-[#64748b] hover:text-[#b48316]'
              }
            `}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
          </button>

          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-9 h-9
              flex items-center justify-center
              transition-colors
              ${
                isDark
                  ? 'text-[#8f99a5] hover:text-[#f1f0ec]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }
            `}
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-[17px] h-[17px]" />
          </a>

          <a
            href={linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              w-9 h-9
              flex items-center justify-center
              transition-colors
              ${
                isDark
                  ? 'text-[#8f99a5] hover:text-[#f1f0ec]'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }
            `}
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-[17px] h-[17px]" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`
              ml-1
              w-9 h-9
              flex items-center justify-center
              border
              transition-all duration-200
              ${
                isDark
                  ? 'border-[#39424b] text-[#8f99a5] hover:text-[#f1f0ec] hover:border-[#535d68]'
                  : 'border-slate-300 text-slate-700 hover:text-slate-950 hover:border-slate-400'
              }
            `}
            aria-label={
              mobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-[18px] h-[18px]" />
            ) : (
              <Menu className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.22,
              ease: 'easeOut',
            }}
            className={`
              lg:hidden
              overflow-hidden
              shadow-lg
              ${isDark ? 'nav-drawer-dark backdrop-blur-xl' : 'nav-drawer-light backdrop-blur-xl'}
            `}
          >
            <nav
              className="
                px-6
                py-4
                flex flex-col
              "
              aria-label="Mobile navigation"
            >
              {navItems.map((item) => {
                const sectionId = item.href.replace('#', '');
                const isActive = activeSection === sectionId;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`
                      relative
                      py-3.5
                      text-[14px]
                      font-medium
                      transition-colors duration-200
                      ${isDark ? 'border-b border-[#252c34]' : 'border-b border-slate-100'}
                      ${
                        isActive
                          ? isDark
                            ? 'text-[#f1f0ec] font-semibold'
                            : 'text-[#0f172a] font-semibold'
                          : isDark
                            ? 'text-[#8f99a5] hover:text-[#d6a83a]'
                            : 'text-[#475569] hover:text-[#b48316]'
                      }
                    `}
                  >
                    {item.label}

                    {isActive && (
                      <span
                        className="
                          absolute
                          left-0
                          bottom-[-1px]
                          w-8
                          h-[2px]
                          bg-[#d6a83a]
                        "
                      />
                    )}
                  </a>
                );
              })}

              <div className={`mt-4 flex items-center justify-between py-2 border-b ${isDark ? 'border-[#252c34]' : 'border-slate-100'}`}>
                <span className={`text-sm font-medium ${isDark ? 'text-[#8f99a5]' : 'text-slate-600'}`}>
                  Theme
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium border ${
                    isDark
                      ? 'border-[#39424b] text-[#d2d7dc] bg-[#181d23]'
                      : 'border-slate-200 text-slate-700 bg-white'
                  }`}
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#d6a83a]" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className={`
                  mt-4
                  h-11
                  flex items-center justify-center
                  text-[13px]
                  font-medium
                  transition-colors duration-200
                  ${
                    isDark
                      ? 'border border-[#39424b] bg-[#181d23] text-[#d6a83a] hover:border-[#d6a83a]'
                      : 'border border-[#d6a83a] bg-white text-[#b48316] hover:bg-[#d6a83a]/10'
                  }
                `}
              >
                Get In Touch
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};