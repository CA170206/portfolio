import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Layers3, Server, Database } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/icons/SocialIcons';
import { usePortfolioData } from '../context/PortfolioDataContext';

export const Hero: React.FC = () => {
  const { profile, socialLinks } = usePortfolioData();

  const github =
    socialLinks.find((s) => s.platform.toLowerCase() === 'github')?.url || '#';

  const linkedin =
    socialLinks.find((s) => s.platform.toLowerCase() === 'linkedin')?.url || '#';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#12161b] pt-28 pb-16 md:pt-36 md:pb-20 transition-colors duration-200"
    >
      {/* -------------------------------------------------
          BACKGROUND GRID
      -------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Very subtle warm ambient light */}
      <div className="pointer-events-none absolute left-[42%] top-[22%] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#d6a83a]/[0.08] dark:bg-[#d6a83a]/[0.045] blur-[130px]" />

      {/* -------------------------------------------------
          MAIN CONTENT
      -------------------------------------------------- */}
      <div className="relative mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-5 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12">

          {/* =================================================
              LEFT — INTRO
          ================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="lg:col-span-7"
          >
            {/* Small introduction line */}
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-9 bg-[#d6a83a]" />

              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#b48316] dark:text-[#d6a83a]">
                {profile?.roleBadge}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="max-w-4xl text-[2.9rem] font-semibold leading-[1.04] tracking-[-0.045em] text-slate-900 dark:text-[#f4f5f6] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
              Hi, I&apos;m{' '}
              <span className="text-[#b48316] dark:text-[#d6a83a]">
                {profile?.name}
              </span>
              .
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 dark:text-[#aeb6c0] sm:text-lg sm:leading-8">
              {profile?.shortBio || ''}
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="group inline-flex items-center gap-2.5 rounded-md bg-[#d6a83a] px-5 py-3 text-sm font-semibold text-[#111418] shadow-[0_4px_20px_rgba(214,168,58,0.18)] transition-all duration-200 hover:bg-[#e1b84b] hover:shadow-[0_6px_24px_rgba(214,168,58,0.25)]"
              >
                View My Projects

                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-[#39414a] bg-white dark:bg-[#1a1f25] px-5 py-3 text-sm font-medium text-slate-700 dark:text-[#d2d7dc] transition-all duration-200 hover:border-slate-400 dark:hover:border-[#535d68] hover:bg-slate-100 dark:hover:bg-[#20262d] hover:text-slate-950 dark:hover:text-white shadow-sm dark:shadow-none"
              >
                <Mail className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                Get In Touch
              </button>
            </div>

            {/* Social Links */}
            <div className="mt-10 flex items-center gap-5 border-t border-slate-200 dark:border-[#303841] pt-6">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex items-center gap-2 text-sm text-slate-600 dark:text-[#8e98a3] transition-colors duration-200 hover:text-[#b48316] dark:hover:text-[#d6a83a] cursor-pointer"
              >
                <GithubIcon className="h-4 w-4 transition-colors duration-200 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                <span>GitHub</span>
              </a>

              <span className="h-3.5 w-px bg-slate-300 dark:bg-[#39414a]" />

              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex items-center gap-2 text-sm text-slate-600 dark:text-[#8e98a3] transition-colors duration-200 hover:text-[#b48316] dark:hover:text-[#d6a83a] cursor-pointer"
              >
                <LinkedinIcon className="h-4 w-4 transition-colors duration-200 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                <span>LinkedIn</span>
              </a>
            </div>
          </motion.div>

          {/* =================================================
              RIGHT — TECH STACK
          ================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">

              {/* Section label */}
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-[#77818c]">
                  What I Build With
                </span>

                <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#77818c]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d6a83a]" />
                  Stack
                </span>
              </div>

              {/* Stack cards */}
              <div className="relative">

                {/* Connecting line */}
                <div className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-[#d6a83a]/60 via-slate-300 dark:via-[#56606b]/50 to-transparent" />

                {/* -----------------------------------------
                    FRONTEND
                ------------------------------------------ */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="relative mb-3 border border-slate-200 dark:border-[#343c45] bg-white dark:bg-[#1a2026] px-5 py-5 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-[#d6a83a]/40 dark:border-[#8f7024] bg-amber-50 dark:bg-[#20262d] text-[#b48316] dark:text-[#d6a83a]">
                      <Layers3 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-[#7f8994]">
                        Interface
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-[#e4e7ea]">
                        React · JavaScript · Tailwind
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-[#9aa4ae]">
                        Responsive interfaces built around real user needs.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* -----------------------------------------
                    BACKEND
                ------------------------------------------ */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="relative mb-3 ml-7 border border-slate-200 dark:border-[#343c45] bg-white dark:bg-[#1a2026] px-5 py-5 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 dark:border-[#3d4650] bg-slate-50 dark:bg-[#20262d] text-slate-600 dark:text-[#aeb7c1]">
                      <Server className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-[#7f8994]">
                        Application
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-[#e4e7ea]">
                        Node.js · Express · REST APIs
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-[#9aa4ae]">
                        Backend services designed for maintainable
                        applications.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* -----------------------------------------
                    DATABASE
                ------------------------------------------ */}
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="relative ml-14 border border-slate-200 dark:border-[#343c45] bg-white dark:bg-[#1a2026] px-5 py-5 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 dark:border-[#3d4650] bg-slate-50 dark:bg-[#20262d] text-slate-600 dark:text-[#aeb7c1]">
                      <Database className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-[#7f8994]">
                        Data
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-[#e4e7ea]">
                        PostgreSQL · Neon Postgres
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-[#9aa4ae]">
                        Structured data models with reliable persistence.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom note */}
              <div className="mt-6 flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-[#77818c]">
                <span className="h-px w-8 bg-slate-300 dark:bg-[#3a424b]" />
                <span>Design · Build · Iterate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-[#68727d] md:flex">
        <span className="h-px w-10 bg-slate-300 dark:bg-[#343c45]" />

        Scroll to explore

        <span className="h-px w-10 bg-slate-300 dark:bg-[#343c45]" />
      </div>
    </section>
  );
};