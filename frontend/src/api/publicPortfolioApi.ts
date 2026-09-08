/**
 * Public Portfolio API Client & Data Adapters
 *
 * Centralizes all public (unauthenticated) portfolio data fetching from the backend API.
 * Uses VITE_API_URL environment variable with fallback to http://localhost:5000/api.
 * Includes asset resolution for Vite-bundled local images and database URLs.
 */

import type {
  ProfileData,
  Project,
  ProjectCaseStudy,
  CertificateItem,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  SocialLink,
} from '../types/portfolio';

// Dynamic Vite asset resolver for local assets bundled during build
const assetModules = import.meta.glob('/src/assets/**/*.{png,jpg,jpeg,svg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/**
 * Resolves an image URL:
 * - If external (http://, https://, data:), returns as-is
 * - If references a local asset (/src/assets/...), resolves through Vite bundled assets
 * - Otherwise returns the string as provided
 */
export const resolveAsset = (url: string | null | undefined, fallback: string = ''): string => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Normalize path with leading slash
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (assetModules[normalized]) {
    return assetModules[normalized];
  }

  // Try path prefixed with /src/assets/
  const stripped = trimmed.replace(/^\/?(src\/assets\/)?/, '');
  const candidate = `/src/assets/${stripped}`;
  if (assetModules[candidate]) {
    return assetModules[candidate];
  }

  return trimmed;
};

import { buildApiUrl, getApiBaseUrl } from './apiClient';
export { buildApiUrl, getApiBaseUrl };

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchPublicJson<T>(endpoint: string): Promise<T | null> {
  const url = buildApiUrl(endpoint);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[publicPortfolioApi] GET ${url} returned status ${res.status}`);
      return null;
    }

    const json: ApiResponse<T> = await res.json();
    if (json.success && json.data !== undefined) {
      return json.data;
    }
    return null;
  } catch (err) {
    console.warn(`[publicPortfolioApi] Network error fetching ${url}:`, err);
    return null;
  }
}

// ==================== RAW API TYPES ====================

export interface RawProfile {
  name: string;
  headline: string;
  shortBio: string;
  about: string;
  location: string;
  email: string;
  phone: string | null;
  profileImage: string | null;
  resumeUrl: string | null;
}

export interface RawProjectImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface RawProjectCaseStudy {
  problem: string;
  solution: string;
  keyFeatures: string[];
  architectureOverview: string;
  challenges: string[];
  learnings: string[];
  futureImprovements: string[];
}

export interface RawProject {
  id: string;
  title: string;
  tagline: string | null;
  shortDescription: string;
  detailedDescription: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  sortOrder: number;
  thumbnail: string | null;
  images: RawProjectImage[];
  technologies: string[];
  caseStudy: RawProjectCaseStudy | null;
}

export interface RawCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  imageUrl: string | null;
  verificationUrl: string | null;
  credentialId: string | null;
  skills: string[];
  sortOrder: number;
}

export interface RawExperience {
  id: string;
  company: string;
  position: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  description: string[];
  technologies: string[];
  offerLetterUrl: string | null;
  sortOrder: number;
}

export interface RawEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  grade: string | null;
  gradeLabel: string | null;
  resultLabel: string | null;
  resultTitle: string | null;
  resultImageUrl: string | null;
  description: string | null;
  coursework: string[];
  sortOrder: number;
}

export interface RawSkill {
  id: string;
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOLS';
  highlight: boolean;
  sortOrder: number;
}

export interface RawSocialLink {
  id: string;
  platform: string;
  url: string;
  username: string | null;
  icon: string | null;
  sortOrder: number;
}

// ==================== DATA ADAPTERS ====================

export const adaptProfile = (raw: RawProfile | null): ProfileData | null => {
  if (!raw) return null;

  // Split about content by double newlines into clean paragraphs
  const aboutStory = raw.about
    ? raw.about
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return {
    name: raw.name || '',
    roleBadge: raw.headline || '',
    headline: raw.headline || '',
    shortBio: raw.shortBio || '',
    aboutStory,
    avatar: resolveAsset(raw.profileImage, ''),
    email: raw.email || '',
    location: raw.location || '',
    status: raw.shortBio || '',
    resumeUrl: raw.resumeUrl || '#contact',
    quickStats: [],
  };
};

export const adaptProjects = (rawList: RawProject[] | null): Project[] => {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((p) => {
    const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
    const resolvedThumbnail = resolveAsset(p.thumbnail || primaryImg?.imageUrl, '');

    const resolvedImages = Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((img) => resolveAsset(img.imageUrl, ''))
      : resolvedThumbnail ? [resolvedThumbnail] : [];

    const caseStudy: ProjectCaseStudy = {
      problem: p.caseStudy?.problem || '',
      solution: p.caseStudy?.solution || '',
      keyFeatures: Array.isArray(p.caseStudy?.keyFeatures) ? p.caseStudy.keyFeatures : [],
      techStackDetails: [],
      architectureOverview: p.caseStudy?.architectureOverview || '',
      challenges: Array.isArray(p.caseStudy?.challenges) ? p.caseStudy.challenges : [],
      learnings: Array.isArray(p.caseStudy?.learnings) ? p.caseStudy.learnings : [],
      futureImprovements: Array.isArray(p.caseStudy?.futureImprovements) ? p.caseStudy.futureImprovements : [],
    };

    return {
      id: p.id,
      title: p.title,
      tagline: p.tagline || '',
      shortDescription: p.shortDescription || '',
      detailedDescription: p.detailedDescription || '',
      thumbnail: resolvedThumbnail,
      images: resolvedImages,
      tags: Array.isArray(p.technologies) ? p.technologies : [],
      liveUrl: p.liveUrl || undefined,
      githubUrl: p.githubUrl || '',
      featured: Boolean(p.featured),
      caseStudy,
    };
  });
};

export const adaptCertificates = (rawList: RawCertificate[] | null): CertificateItem[] => {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((c) => ({
    id: c.id,
    name: c.title,
    issuer: c.issuer,
    issueDate: c.issueDate,
    credentialId: c.credentialId || undefined,
    verificationUrl: c.verificationUrl || '',
    image: resolveAsset(c.imageUrl, ''),
    description: c.description || '',
    skills: Array.isArray(c.skills) ? c.skills : [],
  }));
};

export const adaptExperience = (rawList: RawExperience[] | null): (ExperienceItem & { offerLetterUrl?: string })[] => {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((exp) => ({
    id: exp.id,
    company: exp.company,
    position: exp.position,
    employmentType: exp.employmentType,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate || (exp.currentlyWorking ? 'Present' : ''),
    isCurrent: Boolean(exp.currentlyWorking),
    description: Array.isArray(exp.description) ? exp.description : [],
    technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
    offerLetterUrl: resolveAsset(exp.offerLetterUrl, ''),
  }));
};

export const adaptEducation = (
  rawList: RawEducation[] | null
): (EducationItem & {
  gradeLabel?: string;
  grade?: string;
  resultImage?: string | null;
  resultTitle?: string;
  resultLabel?: string;
})[] => {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((edu) => ({
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    field: edu.fieldOfStudy || '',
    startYear: edu.startDate,
    endYear: edu.endDate || '',
    grade: edu.grade || '',
    gradeLabel: edu.gradeLabel || 'CGPA',
    resultLabel: edu.resultLabel || '',
    resultTitle: edu.resultTitle || '',
    resultImage: edu.resultImageUrl ? resolveAsset(edu.resultImageUrl, '') : null,
    description: edu.description || '',
    coursework: Array.isArray(edu.coursework) ? edu.coursework : [],
  }));
};

const CATEGORY_CONFIG: Record<
  'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOLS',
  { id: string; title: string; description: string }
> = {
  FRONTEND: {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Building responsive, fast, and accessible user interfaces with modern component architectures.',
  },
  BACKEND: {
    id: 'backend',
    title: 'Backend Development',
    description: 'Designing RESTful APIs, business logic, authentication services, and server architectures.',
  },
  DATABASE: {
    id: 'database',
    title: 'Database Systems',
    description: 'Modeling relational schemas, query optimization, and structured persistence.',
  },
  TOOLS: {
    id: 'tools',
    title: 'Tools & DevOps',
    description: 'Version control, collaborative workflows, developer tooling, and modern cloud deployment.',
  },
};

export const adaptSkills = (rawList: RawSkill[] | null): SkillCategory[] => {
  if (!Array.isArray(rawList)) return [];

  const order: Array<'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOLS'> = [
    'FRONTEND',
    'BACKEND',
    'DATABASE',
    'TOOLS',
  ];

  return order
    .map((catKey) => {
      const config = CATEGORY_CONFIG[catKey];
      const matchingSkills = rawList
        .filter((s) => s.category === catKey)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((s) => ({
          name: s.name,
          highlight: Boolean(s.highlight),
        }));

      return {
        id: config.id,
        title: config.title,
        description: config.description,
        skills: matchingSkills,
      };
    })
    .filter((cat) => cat.skills.length > 0);
};

export const adaptSocialLinks = (rawList: RawSocialLink[] | null): SocialLink[] => {
  if (!Array.isArray(rawList)) return [];

  return rawList.map((s) => ({
    platform: s.platform as SocialLink['platform'],
    url: s.url,
    username: s.username || '',
    icon: s.icon || s.platform.toLowerCase(),
  }));
};

export interface RawContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface RawGithubData {
  username: string;
  profileUrl: string;
  totalContributions: number;
  contributions: RawContributionDay[];
  lastSyncedAt: string | null;
}

export interface RawLinkedinData {
  profileUrl: string;
  followers: string;
  connections: string;
  role: string;
  company: string;
  location: string;
  education: string;
}

// ==================== PUBLIC API METHODS ====================

export const publicPortfolioApi = {
  getProfile: async () => adaptProfile(await fetchPublicJson<RawProfile>('/api/profile/public')),
  getProjects: async () => adaptProjects(await fetchPublicJson<RawProject[]>('/api/projects/public')),
  getCertificates: async () => adaptCertificates(await fetchPublicJson<RawCertificate[]>('/api/certificates/public')),
  getExperience: async () => adaptExperience(await fetchPublicJson<RawExperience[]>('/api/experience/public')),
  getEducation: async () => adaptEducation(await fetchPublicJson<RawEducation[]>('/api/education/public')),
  getSkills: async () => adaptSkills(await fetchPublicJson<RawSkill[]>('/api/skills/public')),
  getSocialLinks: async () => adaptSocialLinks(await fetchPublicJson<RawSocialLink[]>('/api/social-links/public')),
  getGithub: async () => fetchPublicJson<RawGithubData>('/api/github/public'),
  getLinkedin: async () => fetchPublicJson<RawLinkedinData>('/api/linkedin/public'),
};

export default publicPortfolioApi;

