import type { Project } from '../types/portfolio';
import tryquizzersIMG from '../assets/projects/tryquizzers.jpg';
import cloudDriveImg from '../assets/projects/clouddrive.jpg';

export const projectsData: Project[] = [
{
  id: "tryquizzers",
  title: "TryQuizzers",
  tagline: "Full-Stack Quiz Management & Assessment Platform",

  shortDescription:
    "A full-stack quiz management platform built for creating, managing, attempting, and evaluating quizzes with separate flows for administrators and students.",

  detailedDescription:
    "TryQuizzers provides a complete quiz workflow from authentication and quiz management to timed student attempts, automatic evaluation, result analysis, difficulty-based questions, explanations, and leaderboards. The application uses a React frontend with a Node.js and Express backend, PostgreSQL for data persistence, and Neon Postgres for the hosted database.",

  thumbnail: tryquizzersIMG,

  tags: [
    "React",
    "JavaScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "Neon Postgres"
  ],

  liveUrl: "https://try-quizzers.vercel.app",

  githubUrl:
    "https://github.com/CA170206/quiz-management-platform.git",

  featured: true,

  caseStudy: {
    problem:
      "Managing quizzes involves more than simply displaying questions. The platform needed to handle authentication, quiz management, timed attempts, automatic evaluation, result analysis, question difficulty, explanations, and competitive elements such as leaderboards in one complete workflow.",

    solution:
      "Built a full-stack quiz management platform using React on the frontend and Node.js with Express on the backend. PostgreSQL is used for persistent application data with Neon Postgres providing the hosted database. The platform connects the complete flow from authentication and quiz management through student attempts, evaluation, results, and leaderboards.",

    keyFeatures: [
      "Authentication and role-based application flows",
      "Quiz creation and management",
      "Timed student quiz attempts",
      "Automatic quiz evaluation",
      "Result analysis after quiz completion",
      "Difficulty-based question handling",
      "Question explanations",
      "Leaderboard functionality"
    ],

    techStackDetails: [
      {
        category: "Frontend",
        technologies: [
          "React",
          "JavaScript"
        ]
      },
      {
        category: "Backend",
        technologies: [
          "Node.js",
          "Express"
        ]
      },
      {
        category: "Database",
        technologies: [
          "PostgreSQL",
          "Neon Postgres"
        ]
      }
    ],

    architectureOverview:
      "The application follows a full-stack architecture where the React frontend communicates with a Node.js and Express backend. Application data is persisted using PostgreSQL, with Neon Postgres used as the hosted database service.",

    challenges: [
      "Connecting the complete quiz lifecycle from authentication and quiz management to timed attempts and automatic evaluation.",
      "Designing the application flow to handle student results and analysis after quiz completion."
    ],

    learnings: [
      "Gained hands-on experience building a complete full-stack application with React, Node.js, Express, and PostgreSQL.",
      "Learned how to structure quiz workflows involving authentication, timed attempts, evaluation, result analysis, and leaderboards."
    ],

    futureImprovements: []
  }
},
  {
  id: "clouddrive",
  title: "CloudDrive",
  tagline: "Full-Stack Cloud Storage Platform",

  shortDescription:
    "A full-stack cloud storage platform for securely uploading, organizing, managing, previewing, downloading, sharing, and versioning files.",

  detailedDescription:
    "CloudDrive is a full-stack cloud storage platform that provides users with a complete file management workflow. Users can upload and organize files, manage folders, preview and download files, restore previous versions, recover deleted files from trash, share files with permissions, and generate public share links. The platform also includes file search, recent files, storage usage statistics, and a responsive web interface.",

  thumbnail: cloudDriveImg,

  tags: [
    "Next.js",
    "React",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Vercel Blob",
    "Vercel"
  ],

  liveUrl: "https://clouddrive-new.vercel.app",

  githubUrl:
    "https://github.com/CA170206/cloud-drive-frontend.git",

  featured: true,

  caseStudy: {
    problem:
      "Users need a convenient way to store, organize, access, and share files through the web while also being able to recover deleted files and manage previous file versions.",

    solution:
      "Built a full-stack cloud storage platform with a Next.js and React frontend, Node.js and Express.js backend, PostgreSQL database, and Vercel Blob for file storage. The platform combines file management, version control, recovery, sharing, public links, search, and storage statistics into a single responsive interface.",

    keyFeatures: [
      "Secure user authentication and authorization",
      "File and folder management",
      "Drag-and-drop file uploads",
      "File preview and download",
      "File versioning and restoration",
      "Trash and file recovery",
      "File sharing with permissions",
      "Public share links",
      "File search",
      "Recent files",
      "Storage usage statistics",
      "Responsive web interface"
    ],

    techStackDetails: [
      {
        category: "Frontend",
        technologies: [
          "Next.js",
          "React"
        ]
      },
      {
        category: "Backend",
        technologies: [
          "Node.js",
          "Express.js"
        ]
      },
      {
        category: "Database",
        technologies: [
          "PostgreSQL"
        ]
      },
      {
        category: "Storage & Deployment",
        technologies: [
          "Vercel Blob",
          "Vercel"
        ]
      }
    ],

    architectureOverview:
      "CloudDrive uses a full-stack architecture with a Next.js and React frontend communicating with a Node.js and Express.js backend. PostgreSQL handles application data while Vercel Blob is used for file storage and Vercel provides deployment.",

    challenges: [
      "Managing the complete lifecycle of files including uploads, organization, deletion, recovery, and version restoration.",
      "Implementing file sharing with permissions and public share links.",
      "Connecting application metadata stored in PostgreSQL with files stored through Vercel Blob."
    ],

    learnings: [
      "Gained hands-on experience building a complete full-stack cloud storage application.",
      "Learned how to integrate object storage with a PostgreSQL-backed application.",
      "Worked with file versioning, recovery, sharing permissions, and public access workflows."
    ],

    futureImprovements: []
  }
}
];
