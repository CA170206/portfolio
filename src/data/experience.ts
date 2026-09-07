import type { ExperienceItem } from '../types/portfolio';

export const experienceData: ExperienceItem[] = [
  {
    id: "exp-1",
    company: "Labmentix",
    position: "Web Development Intern",
    employmentType: "Remote Internship",
    location: "Remote",
    startDate: "August 2026",
    endDate: "February 2027 (Present)",
    isCurrent: true,
    description: [
      "Contributing to the development and enhancement of production web applications using React, Node.js, and TypeScript.",
      "Collaborating closely with senior engineers in an agile sprint workflow, participating in daily standups, code reviews, and architectural discussions.",
      "Developing and testing RESTful API endpoints, optimizing database queries in PostgreSQL, and integrating client-side state management.",
      "Implementing responsive UI components adhering to strict design systems and accessibility guidelines."
    ],
    technologies: ["React", "JavaScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Git"]
  }
];
