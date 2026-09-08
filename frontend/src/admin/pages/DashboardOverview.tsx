import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Code2,
  Share2,
  User,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

interface ResourceCounts {
  projects: number | null;
  certificates: number | null;
  experience: number | null;
  education: number | null;
  skills: number | null;
  socialLinks: number | null;
}

export const DashboardOverview: React.FC = () => {
  const { admin } = useAuth();

  const [counts, setCounts] = useState<ResourceCounts>({
    projects: null,
    certificates: null,
    experience: null,
    education: null,
    skills: null,
    socialLinks: null,
  });

  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const [
          projRes,
          certRes,
          expRes,
          eduRes,
          skillRes,
          socRes,
        ] = await Promise.allSettled([
          apiClient.get<unknown[]>('/projects'),
          apiClient.get<unknown[]>('/certificates'),
          apiClient.get<unknown[]>('/experience'),
          apiClient.get<unknown[]>('/education'),
          apiClient.get<unknown[]>('/skills'),
          apiClient.get<unknown[]>('/social-links'),
        ]);

        if (!isMounted) return;

        setCounts({
          projects:
            projRes.status === 'fulfilled' && projRes.value.success
              ? (projRes.value.data as unknown[])?.length ?? 0
              : 0,

          certificates:
            certRes.status === 'fulfilled' && certRes.value.success
              ? (certRes.value.data as unknown[])?.length ?? 0
              : 0,

          experience:
            expRes.status === 'fulfilled' && expRes.value.success
              ? (expRes.value.data as unknown[])?.length ?? 0
              : 0,

          education:
            eduRes.status === 'fulfilled' && eduRes.value.success
              ? (eduRes.value.data as unknown[])?.length ?? 0
              : 0,

          skills:
            skillRes.status === 'fulfilled' && skillRes.value.success
              ? (skillRes.value.data as unknown[])?.length ?? 0
              : 0,

          socialLinks:
            socRes.status === 'fulfilled' && socRes.value.success
              ? (socRes.value.data as unknown[])?.length ?? 0
              : 0,
        });
      } catch {
        if (isMounted) {
          setCounts({
            projects: 0,
            certificates: 0,
            experience: 0,
            education: 0,
            skills: 0,
            socialLinks: 0,
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingCounts(false);
        }
      }
    };

    fetchCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const resourceRows = [
    {
      label: 'Projects',
      count: counts.projects,
      to: '/admin/projects',
      icon: FolderKanban,
      description: 'Applications and case studies',
    },
    {
      label: 'Experience',
      count: counts.experience,
      to: '/admin/experience',
      icon: Briefcase,
      description: 'Internships and professional roles',
    },
    {
      label: 'Certificates',
      count: counts.certificates,
      to: '/admin/certificates',
      icon: Award,
      description: 'Credentials and certifications',
    },
    {
      label: 'Education',
      count: counts.education,
      to: '/admin/education',
      icon: GraduationCap,
      description: 'Academic history',
    },
    {
      label: 'Skills',
      count: counts.skills,
      to: '/admin/skills',
      icon: Code2,
      description: 'Technical skills and categories',
    },
    {
      label: 'Social Links',
      count: counts.socialLinks,
      to: '/admin/social-links',
      icon: Share2,
      description: 'Public profile links',
    },
  ];

  return (
    <div className="relative">
      {/* Very subtle technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.025] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <header className="border-b border-slate-200 pb-6 dark:border-[#303841]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d6a83a]">
                Portfolio CMS
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                Content Overview
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-[#aeb6c0]">
                Manage the content displayed across your portfolio.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#181d23] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
              >
                View Portfolio
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <Link
                to="/admin/profile"
                className="inline-flex items-center gap-2 bg-[#d6a83a] px-3.5 py-2 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f]"
              >
                <User className="h-3.5 w-3.5" />
                Edit Profile
              </Link>
            </div>
          </div>
        </header>

        {/* Admin identity / status row */}
        <section className="flex flex-col gap-3 border-b border-slate-200 pb-6 dark:border-[#303841] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-[#7f8995]">
              Signed in as
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800 dark:text-[#f4f5f6]">
              {admin?.name || 'Administrator'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#7f8995]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d6a83a]" />
            <span>CMS connected</span>
          </div>
        </section>

        {/* Content */}
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6a83a]">
                Content
              </p>

              <h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                Portfolio sections
              </h2>
            </div>

            <span className="hidden text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-[#7f8995] sm:block">
              Manage
            </span>
          </div>

          <div className="overflow-hidden border border-slate-200 bg-white dark:border-[#303841] dark:bg-[#181d23]">
            {resourceRows.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-[#1c2229] ${index !== resourceRows.length - 1
                      ? 'border-b border-slate-200 dark:border-[#303841]'
                      : ''
                    }`}
                >
                  {/* Icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b]">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-slate-900 transition-colors group-hover:text-[#a47d18] dark:text-[#f4f5f6] dark:group-hover:text-[#d6a83a]">
                        {item.label}
                      </h3>

                      <span className="font-mono text-[11px] text-slate-400 dark:text-[#7f8995]">
                        {isLoadingCounts ? '—' : item.count ?? 0}
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-[#7f8995]">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#d6a83a] dark:text-[#4b5560]"
                    strokeWidth={1.7}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Profile shortcut */}
        <section className="border border-slate-200 bg-slate-50/70 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d6a83a]">
                Profile
              </p>

              <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                Update the information shown on your portfolio
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
                Name, bio, profile image, location and other personal details.
              </p>
            </div>

            <Link
              to="/admin/profile"
              className="inline-flex shrink-0 items-center justify-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
            >
              Open Profile
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardOverview;