export interface ProjectCaseStudy {
  problem: string;
  solution: string;
  keyFeatures: string[];
  techStackDetails: {
    category: string;
    technologies: string[];
  }[];
  architectureOverview: string;
  challenges: string[];
  learnings: string[];
  futureImprovements: string[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  thumbnail: string;
  tags: string[];
  liveUrl?: string;
  githubUrl: string;
  featured: boolean;
  caseStudy: ProjectCaseStudy;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string[];
  technologies: string[];
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verificationUrl: string;
  image: string;
  description: string;
  skills: string[];
}

export interface SkillItem {
  name: string;
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: SkillItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  description: string;
  coursework: string[];
}

export interface SocialLink {
  platform: 'GitHub' | 'LinkedIn' | 'Email' | 'Twitter';
  url: string;
  username: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  roleBadge: string;
  headline: string;
  shortBio: string;
  aboutStory: string[];
  avatar: string;
  email: string;
  location: string;
  status: string;
  resumeUrl: string;
  quickStats: {
    label: string;
    value: string;
    description: string;
  }[];
}

export interface RepoPreview {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
  tags: string[];
}
