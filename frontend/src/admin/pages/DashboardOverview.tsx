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
  ArrowRight,
  Sparkles,
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
  const [isLoadingCounts, setIsLoadingCounts] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCounts = async () => {
      try {
        const [projRes, certRes, expRes, eduRes, skillRes, socRes] =
          await Promise.allSettled([
            apiClient.get<unknown[]>('/projects'),
            apiClient.get<unknown[]>('/certificates'),
            apiClient.get<unknown[]>('/experience'),
            apiClient.get<unknown[]>('/education'),
            apiClient.get<unknown[]>('/skills'),
            apiClient.get<unknown[]>('/social-links'),
          ]);

        if (isMounted) {
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
        }
      } catch {
        // Leave counts as 0 on failure
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

  const resourceCards = [
    {
      label: 'Projects',
      count: counts.projects,
      to: '/admin/projects',
      icon: FolderKanban,
      description: 'Showcase applications and case studies',
    },
    {
      label: 'Certificates',
      count: counts.certificates,
      to: '/admin/certificates',
      icon: Award,
      description: 'Professional credentials and accreditations',
    },
    {
      label: 'Experience',
      count: counts.experience,
      to: '/admin/experience',
      icon: Briefcase,
      description: 'Career positions, internships, and roles',
    },
    {
      label: 'Education',
      count: counts.education,
      to: '/admin/education',
      icon: GraduationCap,
      description: 'Academic background and coursework',
    },
    {
      label: 'Skills',
      count: counts.skills,
      to: '/admin/skills',
      icon: Code2,
      description: 'Categorized technical capabilities',
    },
    {
      label: 'Social Links',
      count: counts.socialLinks,
      to: '/admin/social-links',
      icon: Share2,
      description: 'Public profile and contact links',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-[#111722] via-[#0f141d] to-[#121822] p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#d6a83a]/30 bg-[#d6a83a]/10 px-2.5 py-1 text-[11px] font-medium text-[#e2b94f]">
            <Sparkles className="h-3 w-3" />
            <span>Admin Console</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Welcome back, {admin?.name || 'Administrator'}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-400">
            Manage your portfolio content, projects, experience, and personal
            profile from one central place.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/admin/profile"
              className="inline-flex items-center gap-2 rounded-lg bg-[#d6a83a] px-3.5 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-[#e2b94f]"
            >
              <User className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#141b24] px-3.5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
            >
              <span>View Live Portfolio</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Resource Count Cards Grid */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Portfolio Resources
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Real-time counts</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resourceCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                to={card.to}
                className="group rounded-xl border border-zinc-800/80 bg-[#11161f] p-5 transition-all hover:border-[#d6a83a]/40 hover:bg-[#131923] hover:shadow-lg hover:shadow-black/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-[#0c1017] text-[#d6a83a] group-hover:border-[#d6a83a]/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-white">
                    {isLoadingCounts ? (
                      <span className="inline-block h-6 w-8 animate-pulse rounded bg-zinc-800" />
                    ) : (
                      card.count ?? 0
                    )}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-[#e2b94f] transition-colors">
                    {card.label}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 line-clamp-1">
                    {card.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200">
                  <span>Manage {card.label.toLowerCase()}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
