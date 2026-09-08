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

export interface PortfolioDataContextType {
  profile: ProfileData | null;
  projects: Project[];
  certificates: CertificateItem[];
  experience: (ExperienceItem & { offerLetterUrl?: string })[];
  education: (EducationItem & {
    gradeLabel?: string;
    grade?: string;
    resultImage?: string | null;
    resultTitle?: string;
    resultLabel?: string;
  })[];
  skills: SkillCategory[];
  socialLinks: SocialLink[];
  isLoading: boolean;
  error: string | null;
  errors: Record<string, string | null>;
  refresh: () => Promise<void>;
}

const PortfolioDataContext = createContext<PortfolioDataContextType | undefined>(undefined);

export const PortfolioDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [experience, setExperience] = useState<(ExperienceItem & { offerLetterUrl?: string })[]>([]);
  const [education, setEducation] = useState<
    (EducationItem & {
      gradeLabel?: string;
      grade?: string;
      resultImage?: string | null;
      resultTitle?: string;
      resultLabel?: string;
    })[]
  >([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const loadAll = useCallback(async () => {
    setIsLoading(true);

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

    if (profileRes.status === 'fulfilled' && profileRes.value) {
      setProfile(profileRes.value);
    } else {
      newErrors.profile = 'Failed to load profile';
    }

    if (projectsRes.status === 'fulfilled' && projectsRes.value) {
      setProjects(projectsRes.value);
    } else {
      newErrors.projects = 'Failed to load projects';
    }

    if (certsRes.status === 'fulfilled' && certsRes.value) {
      setCertificates(certsRes.value);
    } else {
      newErrors.certificates = 'Failed to load certificates';
    }

    if (expRes.status === 'fulfilled' && expRes.value) {
      setExperience(expRes.value);
    } else {
      newErrors.experience = 'Failed to load experience';
    }

    if (eduRes.status === 'fulfilled' && eduRes.value) {
      setEducation(eduRes.value);
    } else {
      newErrors.education = 'Failed to load education';
    }

    if (skillsRes.status === 'fulfilled' && skillsRes.value) {
      setSkills(skillsRes.value);
    } else {
      newErrors.skills = 'Failed to load skills';
    }

    if (socialsRes.status === 'fulfilled' && socialsRes.value) {
      setSocialLinks(socialsRes.value);
    } else {
      newErrors.socialLinks = 'Failed to load social links';
    }

    setErrors(newErrors);
    setIsLoading(false);
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
