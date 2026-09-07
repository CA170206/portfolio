import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Layers,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/icons/SocialIcons';
import { profileData } from '../data/profile';
import { socialLinks } from '../data/socials';

export const About: React.FC = () => {
  const github =
    socialLinks.find((s) => s.platform === 'GitHub')?.url || 'https://github.com/CA170206';

  const linkedin =
    socialLinks.find((s) => s.platform === 'LinkedIn')?.url || 'https://www.linkedin.com/in/chaitanya-anmulwar';

  const pillars = [
    {
      icon: GraduationCap,
      title: 'Final-Year Student',
      description:
        'Completing my undergraduate computer science degree with a strong foundation in software development and core CS concepts.',
    },
    {
      icon: Briefcase,
      title: '6-Month Internship',
      description:
        'Gaining hands-on industry experience while working with real development workflows and building software professionally.',
    },
    {
      icon: Layers,
      title: 'Continuous Learning',
      description:
        'Learning by building, experimenting, shipping projects, and continuously improving my development skills.',
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-slate-100/70 dark:bg-[#161b21] py-24 md:py-28 transition-colors duration-200"
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-[#d6a83a]" />

            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#b48316] dark:text-[#d6a83a]">
              About Me
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-900 dark:text-[#f1f3f5] sm:text-4xl md:text-5xl">
            Building with curiosity,
            <br className="hidden sm:block" />
            <span className="text-slate-500 dark:text-[#aeb6c0]"> learning through experience.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#a3acb6] sm:text-base">
            A little about my background, what I&apos;m currently working on,
            and how I approach software development.
          </p>
        </motion.div>

        {/* =================================================
            PROFILE + STORY
        ================================================== */}
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-16">

          {/* -------------------------------------------------
              PROFILE IMAGE
          -------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <div>
              {/* Image Frame with Gold Accent Corner */}
              <div className="relative">
                {/* Gold offset detail */}
                <div className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-16 w-16 border-b-2 border-l-2 border-[#d6a83a]/60" />

                <div className="relative overflow-hidden border border-slate-300 dark:border-[#39424b] bg-white dark:bg-[#1d2329] p-2 shadow-sm dark:shadow-none">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />

                    {/* Soft bottom gradient */}
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 dark:from-[#11151a]/70 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="relative z-10 mt-5 flex items-center gap-5">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-[#9ca6b0] transition-colors duration-200 hover:text-[#b48316] dark:hover:text-[#d6a83a] cursor-pointer"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="h-4 w-4 transition-colors duration-200 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                  <span className="transition-colors duration-200 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]">GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                </a>

                <span className="h-4 w-px bg-slate-300 dark:bg-[#3a424b]" />

                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-[#9ca6b0] transition-colors duration-200 hover:text-[#b48316] dark:hover:text-[#d6a83a] cursor-pointer"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="h-4 w-4 transition-colors duration-200 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                  <span className="transition-colors duration-200 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]">LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* -------------------------------------------------
              STORY + INFORMATION
          -------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="lg:col-span-8"
          >
            {/* Story */}
            <div className="max-w-3xl space-y-5 text-[15px] leading-7 text-slate-600 dark:text-[#aeb6c0] sm:text-base">
              {profileData.aboutStory.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* -------------------------------------------------
                THREE PILLARS
            -------------------------------------------------- */}
            <div className="mt-12 grid grid-cols-1 gap-0 border-y border-slate-200 dark:border-[#343d46] sm:grid-cols-3">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;

                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                    }}
                    className={`py-6 sm:px-5 ${
                      index !== 0 ? 'border-t border-slate-200 dark:border-[#343d46] sm:border-l sm:border-t-0' : ''
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                      <span className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-900 dark:text-[#dce0e4]">
                        {pillar.title}
                      </span>
                    </div>

                    <p className="text-xs leading-6 text-slate-600 dark:text-[#929ca7]">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* -------------------------------------------------
                QUICK STATS
            -------------------------------------------------- */}
            <div className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-[#707b86]">
                  At a glance
                </span>

                <span className="h-px flex-1 ml-5 bg-slate-200 dark:bg-[#343d46]" />
              </div>

              <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-x-8">
                {profileData.quickStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 dark:text-[#f1f3f5]">
                      {stat.value}
                    </div>

                    <div className="mt-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#b48316] dark:text-[#d6a83a]">
                      {stat.label}
                    </div>

                    <div className="mt-1.5 text-[11px] leading-5 text-slate-500 dark:text-[#7f8994]">
                      {stat.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Small external-link detail */}
            <div className="mt-10 flex items-center gap-2 text-xs text-slate-500 dark:text-[#6f7984]">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>More details throughout the portfolio</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};