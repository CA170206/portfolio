import React from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  UserPlus,
} from 'lucide-react';
import { LinkedinIcon } from '../components/icons/SocialIcons';
import { usePortfolioData } from '../context/PortfolioDataContext';

const LINKEDIN_STATS = {
  connections: '500+',
  followers: 1000,
  role: 'Web Development Intern',
  company: 'Labmentix',
  education: 'B.Tech CSE',
  university: 'Sandip University',
  location: 'Greater Nashik Area',
};

export const LinkedInSection: React.FC = () => {
  const { profile, socialLinks, linkedin } = usePortfolioData();

  const linkedinStats = {
    connections: linkedin?.connections || LINKEDIN_STATS.connections,
    followers: linkedin?.followers ?? LINKEDIN_STATS.followers,
    role: linkedin?.role || LINKEDIN_STATS.role,
    company: linkedin?.company || LINKEDIN_STATS.company,
    education: linkedin?.education || LINKEDIN_STATS.education,
    university: LINKEDIN_STATS.university,
    location: linkedin?.location || LINKEDIN_STATS.location,
  };

  const linkedinUrl =
    linkedin?.profileUrl ||
    socialLinks.find((item) => item.platform.toLowerCase() === 'linkedin')?.url ||
    'https://linkedin.com';

  return (
    <section
      id="linkedin"
      className="relative bg-slate-100/70 dark:bg-[#12161b] py-20 transition-colors duration-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl border border-slate-300 dark:border-[#303841] bg-white dark:bg-[#181c21] shadow-xl transition-colors"
        >
          {/* LinkedIn Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#303841] px-5 py-3">
            <div className="flex items-center gap-2">
              <LinkedinIcon className="h-6 w-6 text-[#0a66c2]" />

              <span className="text-sm font-semibold text-slate-800 dark:text-[#f4f5f6]">
                LinkedIn
              </span>
            </div>

            <MoreHorizontal className="h-5 w-5 text-slate-400 dark:text-[#7f8995]" />
          </div>

          {/* Profile Cover */}
          <div className="relative h-28 bg-[#d9e2ec] dark:bg-[#1e2732] sm:h-36 transition-colors">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(10,102,194,0.18), transparent 55%), linear-gradient(45deg, transparent 60%, rgba(10,102,194,0.1))',
              }}
            />
          </div>

          {/* Profile Content */}
          <div className="relative px-5 pb-7 sm:px-8">
            {/* Profile Photo */}
            <div className="-mt-14 sm:-mt-16">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name || 'Profile'}
                  className="h-28 w-28 rounded-full border-4 border-white dark:border-[#181c21] bg-white dark:bg-[#181c21] object-cover shadow-md sm:h-32 sm:w-32 transition-colors"
                />
              ) : (
                <div className="h-28 w-28 rounded-full border-4 border-white dark:border-[#181c21] bg-slate-200 dark:bg-[#181c21] flex items-center justify-center sm:h-32 sm:w-32">
                  <span className="text-xl font-bold text-slate-400">{profile?.name?.charAt(0) || 'C'}</span>
                </div>
              )}
            </div>

            {/* Profile Header */}
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                  {profile?.name}
                </h2>

                <p className="mt-1 max-w-2xl text-base text-slate-600 dark:text-[#aeb6c0]">
                  {linkedinStats.role} at {linkedinStats.company}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-[#89939f]">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {linkedinStats.location}
                  </span>

                  <span className="hidden sm:inline">·</span>

                  <span>
                    {linkedinStats.connections} connections
                  </span>

                  <span className="hidden sm:inline">·</span>

                  <span className="font-medium text-[#0a66c2] dark:text-[#388bfd]">
                    {typeof linkedinStats.followers === 'string'
                      ? `${linkedinStats.followers} followers`
                      : `${linkedinStats.followers.toLocaleString()} followers`}
                  </span>
                </div>
              </div>

              {/* Profile Actions */}
              <div className="flex shrink-0 gap-2">
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0a66c2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004182]"
                >
                  <UserPlus className="h-4 w-4" />
                  Connect
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0a66c2] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#0a66c2] dark:text-[#388bfd] transition-colors hover:bg-[#0a66c2]/10"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="my-7 border-t border-slate-200 dark:border-[#303841]" />

            {/* Profile Details */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Experience */}
              <div className="flex gap-4 rounded-lg border border-slate-200 dark:border-[#303841] bg-slate-50 dark:bg-[#12161b] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white dark:bg-[#1c2229] text-[#0a66c2] dark:text-[#388bfd] shadow-sm">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#7f8995]">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                    {linkedinStats.role}
                  </p>

                  <p className="mt-0.5 text-sm text-slate-500 dark:text-[#89939f]">
                    {linkedinStats.company}
                  </p>
                </div>
              </div>

              {/* Education */}
              <div className="flex gap-4 rounded-lg border border-slate-200 dark:border-[#303841] bg-slate-50 dark:bg-[#12161b] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white dark:bg-[#1c2229] text-[#0a66c2] dark:text-[#388bfd] shadow-sm">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#7f8995]">
                    Education
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                    {linkedinStats.university}
                  </p>

                  <p className="mt-0.5 text-sm text-slate-500 dark:text-[#89939f]">
                    {linkedinStats.education}
                  </p>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mt-4 rounded-lg border border-slate-200 dark:border-[#303841] bg-slate-50/50 dark:bg-[#12161b]/50 p-5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                About
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-[#aeb6c0]">
                {profile?.shortBio}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 dark:border-[#303841] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#89939f]">
                <LinkedinIcon className="h-4 w-4 text-[#0a66c2]" />
                <span>Professional profile</span>
              </div>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#0a66c2] dark:text-[#388bfd] hover:underline"
              >
                View full LinkedIn profile →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};