import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import publicPortfolioApi from '../api/publicPortfolioApi';
import type {
  ProfileData,
  Project,
  CertificateItem,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  SocialLink,
} from '../types/portfolio';

import { profileData as defaultProfile } from '../data/profile';
import { projectsData as defaultProjects } from '../data/projects';
import { certificatesData as defaultCertificates } from '../data/certificates';
import { experienceData as defaultExperience } from '../data/experience';
import { educationData as defaultEducation } from '../data/education';
import { skillsData as defaultSkills } from '../data/skills';
import { socialLinks as defaultSocials } from '../data/socials';

export type PortfolioEducationItem = EducationItem & {
  gradeLabel?: string;
  grade?: string;
  resultImage?: string | null;
  resultTitle?: string;
  resultLabel?: string;
};

export interface PortfolioDataContextType {
  profile: ProfileData | null;
  projects: Project[];
  certificates: CertificateItem[];
  experience: (ExperienceItem & { offerLetterUrl?: string })[];
  education: PortfolioEducationItem[];
  skills: SkillCategory[];
  socialLinks: SocialLink[];
  isLoading: boolean;
  error: string | null;
  errors: Record<string, string | null>;
  refresh: () => Promise<void>;
}

const CACHE_KEY = 'portfolio_cms_cache_v2';

interface CachedPortfolioSnapshot {
  profile?: ProfileData;
  projects?: Project[];
  certificates?: CertificateItem[];
  experience?: (ExperienceItem & { offerLetterUrl?: string })[];
  education?: PortfolioEducationItem[];
  skills?: SkillCategory[];
  socialLinks?: SocialLink[];
}

const readCachedSnapshot = (): CachedPortfolioSnapshot | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      return JSON.parse(raw) as CachedPortfolioSnapshot;
    }
  } catch {
    // Ignore parse or storage errors
  }
  return null;
};

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialCache = readCachedSnapshot();

  const [profile, setProfile] = useState<ProfileData | null>(
    () => initialCache?.profile || (defaultProfile as unknown as ProfileData)
  );
  const [projects, setProjects] = useState<Project[]>(
    () =>
      initialCache?.projects && initialCache.projects.length > 0
        ? initialCache.projects
        : defaultProjects
  );
  const [certificates, setCertificates] = useState<CertificateItem[]>(
    () =>
      initialCache?.certificates && initialCache.certificates.length > 0
        ? initialCache.certificates
        : (defaultCertificates as unknown as CertificateItem[])
  );
  const [experience, setExperience] = useState<(ExperienceItem & { offerLetterUrl?: string })[]>(
    () =>
      initialCache?.experience && initialCache.experience.length > 0
        ? initialCache.experience
        : defaultExperience
  );
  const [education, setEducation] = useState<PortfolioEducationItem[]>(
    () =>
      initialCache?.education && initialCache.education.length > 0
        ? initialCache.education
        : (defaultEducation as unknown as PortfolioEducationItem[])
  );
  const [skills, setSkills] = useState<SkillCategory[]>(
    () =>
      initialCache?.skills && initialCache.skills.length > 0
        ? initialCache.skills
        : defaultSkills
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    () =>
      initialCache?.socialLinks && initialCache.socialLinks.length > 0
        ? initialCache.socialLinks
        : (defaultSocials as unknown as SocialLink[])
  );

  // Initial render has complete data immediately with zero lag
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const loadAll = useCallback(async () => {
    const [
      profileRes,
      projectsRes,
      certsRes,
      expRes,
      eduRes,
      skillsRes,
      socialsRes,
    ] = await Promise.allSettled([
      publicPortfolioApi.getProfile(),
      publicPortfolioApi.getProjects(),
      publicPortfolioApi.getCertificates(),
      publicPortfolioApi.getExperience(),
      publicPortfolioApi.getEducation(),
      publicPortfolioApi.getSkills(),
      publicPortfolioApi.getSocialLinks(),
    ]);

    const newErrors: Record<string, string | null> = {};
    let currentProfile: ProfileData | null = null;
    let currentProjects: Project[] | null = null;
    let currentCerts: CertificateItem[] | null = null;
    let currentExp: (ExperienceItem & { offerLetterUrl?: string })[] | null = null;
    let currentEdu: PortfolioEducationItem[] | null = null;
    let currentSkills: SkillCategory[] | null = null;
    let currentSocials: SocialLink[] | null = null;

    if (profileRes.status === 'fulfilled' && profileRes.value) {
      setProfile(profileRes.value);
      currentProfile = profileRes.value;
    } else {
      newErrors.profile = 'Failed to load profile';
    }

    if (projectsRes.status === 'fulfilled' && projectsRes.value) {
      setProjects(projectsRes.value);
      currentProjects = projectsRes.value;
    } else {
      newErrors.projects = 'Failed to load projects';
    }

    if (certsRes.status === 'fulfilled' && certsRes.value) {
      setCertificates(certsRes.value);
      currentCerts = certsRes.value;
    } else {
      newErrors.certificates = 'Failed to load certificates';
    }

    if (expRes.status === 'fulfilled' && expRes.value) {
      setExperience(expRes.value);
      currentExp = expRes.value;
    } else {
      newErrors.experience = 'Failed to load experience';
    }

    if (eduRes.status === 'fulfilled' && eduRes.value) {
      setEducation(eduRes.value);
      currentEdu = eduRes.value;
    } else {
      newErrors.education = 'Failed to load education';
    }

    if (skillsRes.status === 'fulfilled' && skillsRes.value) {
      setSkills(skillsRes.value);
      currentSkills = skillsRes.value;
    } else {
      newErrors.skills = 'Failed to load skills';
    }

    if (socialsRes.status === 'fulfilled' && socialsRes.value) {
      setSocialLinks(socialsRes.value);
      currentSocials = socialsRes.value;
    } else {
      newErrors.socialLinks = 'Failed to load social links';
    }

    setErrors(newErrors);
    setIsLoading(false);

    // Save updated data to cache
    try {
      const existingRaw = localStorage.getItem(CACHE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          ...existing,
          ...(currentProfile ? { profile: currentProfile } : {}),
          ...(currentProjects ? { projects: currentProjects } : {}),
          ...(currentCerts ? { certificates: currentCerts } : {}),
          ...(currentExp ? { experience: currentExp } : {}),
          ...(currentEdu ? { education: currentEdu } : {}),
          ...(currentSkills ? { skills: currentSkills } : {}),
          ...(currentSocials ? { socialLinks: currentSocials } : {}),
        })
      );
    } catch {
      // Ignore quota/storage errors
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const globalError = useMemo(() => Object.values(errors).find(Boolean) || null, [errors]);

  const contextValue = useMemo<PortfolioDataContextType>(
    () => ({
      profile,
      projects,
      certificates,
      experience,
      education,
      skills,
      socialLinks,
      isLoading,
      error: globalError,
      errors,
      refresh: loadAll,
    }),
    [
      profile,
      projects,
      certificates,
      experience,
      education,
      skills,
      socialLinks,
      isLoading,
      errors,
      loadAll,
      globalError,
    ]
  );

  return (
    <PortfolioDataContext.Provider value={contextValue}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = (): PortfolioDataContextType => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
};

export default PortfolioDataContext;
