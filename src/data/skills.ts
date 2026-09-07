import type { SkillCategory } from '../types/portfolio';

export const skillsData: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Building responsive, fast, and accessible user interfaces with modern component architectures.",
    skills: [
      { name: "React", highlight: true },
      { name: "JavaScript (ES6+)", highlight: true },
      { name: "Tailwind CSS", highlight: true },
      { name: "HTML5 & Semantic Markup" },
      { name: "CSS3 & Modern Layouts" },
      { name: "Responsive Web Design" }
    ]
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Designing RESTful APIs, business logic, authentication services, and server architectures.",
    skills: [
      { name: "Node.js", highlight: true },
      { name: "Express.js", highlight: true },
      { name: "RESTful API Architecture", highlight: true },
      { name: "JSON Web Tokens (JWT)" },
      { name: "API Security & Validation" },
      { name: "Middleware Design" }
    ]
  },
  {
    id: "database",
    title: "Database Systems",
    description: "Modeling relational schemas, query optimization, and structured persistence.",
    skills: [
      { name: "PostgreSQL", highlight: true },
      { name: "SQL & Query Optimization", highlight: true },
      { name: "Neon Postgres" },
    ]
  },
  {
    id: "tools",
    title: "Tools & DevOps",
    description: "Version control, collaborative workflows, developer tooling, and modern cloud deployment.",
    skills: [
      { name: "Git", highlight: true },
      { name: "GitHub & Git Workflow", highlight: true },
      { name: "Vercel / Render Deployment", highlight: true },
      { name: "Insomnia API Testing" , highlight: true },
      { name: "Vite & Modern Bundlers" },
      { name: "VS Code & Dev Environments" }
    ]
  }
];
