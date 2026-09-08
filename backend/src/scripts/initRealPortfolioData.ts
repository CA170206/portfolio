import prisma from '../config/prisma';
import { SkillCategory } from '@prisma/client';

async function seedRealData() {
  console.log('=== Initializing Real Portfolio Data in Neon PostgreSQL ===\n');

  // 1. Projects
  const realProjects = [
    {
      title: 'TryQuizzers',
      tagline: 'Full-Stack Quiz Management & Assessment Platform',
      shortDescription:
        'A full-stack quiz management platform built for creating, managing, attempting, and evaluating quizzes with separate flows for administrators and students.',
      detailedDescription:
        'TryQuizzers provides a complete quiz workflow from authentication and quiz management to timed student attempts, automatic evaluation, result analysis, difficulty-based questions, explanations, and leaderboards. The application uses a React frontend with a Node.js and Express backend, PostgreSQL for data persistence, and Neon Postgres for the hosted database.',
      liveUrl: 'https://try-quizzers.vercel.app',
      githubUrl: 'https://github.com/CA170206/quiz-management-platform.git',
      featured: true,
      sortOrder: 1,
      isVisible: true,
      technologies: ['React', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL', 'Neon Postgres'],
      images: [
        { imageUrl: '/src/assets/projects/tryquizzers.jpg', altText: 'TryQuizzers Dashboard', isPrimary: true, sortOrder: 0 },
        { imageUrl: '/src/assets/projects/tryquizzers-2.jpg', altText: 'TryQuizzers Quiz Attempt', isPrimary: false, sortOrder: 1 },
        { imageUrl: '/src/assets/projects/tryquizzers-3.jpg', altText: 'TryQuizzers Leaderboard', isPrimary: false, sortOrder: 2 },
        { imageUrl: '/src/assets/projects/tryquizzers-4.jpg', altText: 'TryQuizzers Result Analysis', isPrimary: false, sortOrder: 3 },
      ],
      caseStudy: {
        problem:
          'Managing quizzes involves more than simply displaying questions. The platform needed to handle authentication, quiz management, timed attempts, automatic evaluation, result analysis, question difficulty, explanations, and competitive elements such as leaderboards in one complete workflow.',
        solution:
          'Built a full-stack quiz management platform using React on the frontend and Node.js with Express on the backend. PostgreSQL is used for persistent application data with Neon Postgres providing the hosted database. The platform connects the complete flow from authentication and quiz management through student attempts, evaluation, results, and leaderboards.',
        keyFeatures: [
          'Authentication and role-based application flows',
          'Quiz creation and management',
          'Timed student quiz attempts',
          'Automatic quiz evaluation',
          'Result analysis after quiz completion',
          'Difficulty-based question handling',
          'Question explanations',
          'Leaderboard functionality',
        ],
        architectureOverview:
          'The application follows a full-stack architecture where the React frontend communicates with a Node.js and Express backend. Application data is persisted using PostgreSQL, with Neon Postgres used as the hosted database service.',
        challenges: [
          'Connecting the complete quiz lifecycle from authentication and quiz management to timed attempts and automatic evaluation.',
          'Designing the application flow to handle student results and analysis after quiz completion.',
        ],
        learnings: [
          'Gained hands-on experience building a complete full-stack application with React, Node.js, Express, and PostgreSQL.',
          'Learned how to structure quiz workflows involving authentication, timed attempts, evaluation, result analysis, and leaderboards.',
        ],
        futureImprovements: [],
      },
    },
    {
      title: 'CloudDrive',
      tagline: 'Full-Stack Cloud Storage Platform',
      shortDescription:
        'A full-stack cloud storage platform for securely uploading, organizing, managing, previewing, downloading, sharing, and versioning files.',
      detailedDescription:
        'CloudDrive is a full-stack cloud storage platform that provides users with a complete file management workflow. Users can upload and organize files, manage folders, preview and download files, restore previous versions, recover deleted files from trash, share files with permissions, and generate public share links. The platform also includes file search, recent files, storage usage statistics, and a responsive web interface.',
      liveUrl: 'https://clouddrive-new.vercel.app',
      githubUrl: 'https://github.com/CA170206/cloud-drive-frontend.git',
      featured: true,
      sortOrder: 2,
      isVisible: true,
      technologies: ['Next.js', 'React', 'Node.js', 'Express.js', 'PostgreSQL', 'Vercel Blob', 'Vercel'],
      images: [
        { imageUrl: '/src/assets/projects/clouddrive.jpg', altText: 'CloudDrive Dashboard', isPrimary: true, sortOrder: 0 },
        { imageUrl: '/src/assets/projects/clouddrive-2.jpg', altText: 'CloudDrive File Explorer', isPrimary: false, sortOrder: 1 },
        { imageUrl: '/src/assets/projects/clouddrive-3.jpg', altText: 'CloudDrive File Preview', isPrimary: false, sortOrder: 2 },
        { imageUrl: '/src/assets/projects/clouddrive-4.jpg', altText: 'CloudDrive Sharing & Trash', isPrimary: false, sortOrder: 3 },
      ],
      caseStudy: {
        problem:
          'Users need a convenient way to store, organize, access, and share files through the web while also being able to recover deleted files and manage previous file versions.',
        solution:
          'Developed a full-stack cloud storage platform with Next.js and React on the frontend and Node.js and Express on the backend. Built structured endpoints for uploading, previewing, and managing files and folders while maintaining clean UI interactions.',
        keyFeatures: [
          'File and folder organization',
          'File preview and download',
          'Version history and restore capabilities',
          'Soft-delete and trash recovery',
          'File search and filtering',
          'Responsive user interface',
        ],
        architectureOverview:
          'The system uses Next.js and React on the client side to provide an interactive dashboard that communicates with backend services for file metadata management, storage handling, and secure link generation.',
        challenges: [
          'Designing an intuitive file management interface that remains fast and responsive across folder navigation and file previews.',
          'Implementing version restoration and soft deletion without compromising data consistency.',
        ],
        learnings: [
          'Strengthened understanding of full-stack file handling architectures and responsive web dashboard design.',
          'Practiced structuring file metadata, permission models, and modular backend APIs.',
        ],
        futureImprovements: [],
      },
    },
  ];

  for (const p of realProjects) {
    const existing = await prisma.project.findFirst({ where: { title: p.title } });
    if (!existing) {
      const created = await prisma.project.create({
        data: {
          title: p.title,
          tagline: p.tagline,
          shortDescription: p.shortDescription,
          detailedDescription: p.detailedDescription,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
          featured: p.featured,
          sortOrder: p.sortOrder,
          isVisible: p.isVisible,
        },
      });

      // Add images
      for (const img of p.images) {
        await prisma.projectImage.create({
          data: {
            projectId: created.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          },
        });
      }

      // Add technologies
      for (const techName of p.technologies) {
        const tech = await prisma.technology.upsert({
          where: { name: techName },
          update: {},
          create: { name: techName },
        });
        await prisma.projectTechnology.create({
          data: {
            projectId: created.id,
            technologyId: tech.id,
          },
        });
      }

      // Add case study
      await prisma.projectCaseStudy.create({
        data: {
          projectId: created.id,
          problem: p.caseStudy.problem,
          solution: p.caseStudy.solution,
          keyFeatures: p.caseStudy.keyFeatures,
          architectureOverview: p.caseStudy.architectureOverview,
          challenges: p.caseStudy.challenges,
          learnings: p.caseStudy.learnings,
          futureImprovements: p.caseStudy.futureImprovements,
        },
      });

      console.log(`[CREATED] Project: ${p.title} (ID: ${created.id})`);
    } else {
      console.log(`[EXISTS] Project: ${p.title}`);
    }
  }

  // 2. Certificates
  const realCertificates = [
    {
      title: 'Software Engineering Job Simulation',
      issuer: 'JPMorgan Chase & Co.',
      issueDate: 'July 29, 2026',
      credentialId: null,
      verificationUrl:
        'https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_6a685e4c871865d389c8608c_1785323909540_completion_certificate.pdf',
      imageUrl: '/src/assets/certificates/jpmorgan.jpg',
      description:
        'Completed a practical software engineering job simulation through Forage, working through hands-on development tasks.',
      skills: ['Software Engineering', 'REST APIs', 'Web Development'],
      sortOrder: 1,
      isVisible: true,
    },
    {
      title: 'Technology Job Simulation',
      issuer: 'Deloitte',
      issueDate: 'July 28, 2026',
      credentialId: null,
      verificationUrl:
        'https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_6a685e4c871865d389c8608c_1785229463028_completion_certificate.pdf',
      imageUrl: '/src/assets/certificates/deloitte.jpg',
      description:
        'Completed a practical technology job simulation through Forage, gaining hands-on exposure to technology-focused tasks.',
      skills: ['Technology', 'Coding', 'Development'],
      sortOrder: 2,
      isVisible: true,
    },
    {
      title: 'What is Data Science?',
      issuer: 'IBM',
      issueDate: 'September 6, 2025',
      credentialId: 'D4A34JEPPH4M',
      verificationUrl: 'https://www.coursera.org/account/accomplishments/records/D4A34JEPPH4M',
      imageUrl: '/src/assets/certificates/ibm-data-science.jpg',
      description: 'Completed the IBM course What is Data Science? through Coursera.',
      skills: ['Data Science', 'Data Analysis'],
      sortOrder: 3,
      isVisible: true,
    },
    {
      title: 'Introduction to Back-End Development',
      issuer: 'Meta',
      issueDate: 'September 6, 2025',
      credentialId: 'ON3NYGBAWM6L',
      verificationUrl: 'https://www.coursera.org/account/accomplishments/records/ON3NYGBAWM6L',
      imageUrl: '/src/assets/certificates/meta-backend.jpg',
      description:
        'Completed Meta’s Introduction to Back-End Development course through Coursera, covering back-end and full-stack development fundamentals.',
      skills: ['Back-End Development', 'Web Development'],
      sortOrder: 4,
      isVisible: true,
    },
  ];

  for (const c of realCertificates) {
    const existing = await prisma.certificate.findFirst({ where: { title: c.title, issuer: c.issuer } });
    if (!existing) {
      const created = await prisma.certificate.create({ data: c });
      console.log(`[CREATED] Certificate: ${c.title} (ID: ${created.id})`);
    } else {
      console.log(`[EXISTS] Certificate: ${c.title}`);
    }
  }

  // 3. Experience
  const realExperiences = [
    {
      company: 'Labmentix',
      position: 'Web Development Intern',
      employmentType: 'Remote Internship',
      location: 'Remote',
      startDate: 'August 2026',
      endDate: 'February 2027 (Present)',
      currentlyWorking: true,
      description: [
        'Contributing to the development and enhancement of production web applications using React, Node.js, and TypeScript.',
        'Collaborating closely with senior engineers in an agile sprint workflow, participating in daily standups, code reviews, and architectural discussions.',
        'Developing and testing RESTful API endpoints, optimizing database queries in PostgreSQL, and integrating client-side state management.',
        'Implementing responsive UI components adhering to strict design systems and accessibility guidelines.',
      ],
      technologies: ['React', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Git'],
      offerLetterUrl: '/src/assets/experience/offer-letter.png',
      sortOrder: 1,
      isVisible: true,
    },
  ];

  for (const exp of realExperiences) {
    const existing = await prisma.experience.findFirst({ where: { company: exp.company, position: exp.position } });
    if (!existing) {
      const created = await prisma.experience.create({ data: exp });
      console.log(`[CREATED] Experience: ${exp.company} - ${exp.position} (ID: ${created.id})`);
    } else {
      console.log(`[EXISTS] Experience: ${exp.company} - ${exp.position}`);
    }
  }

  // 4. Education
  const realEducation = [
    {
      institution: 'Sandip University, Nashik, India',
      degree: 'Bachelor of Technology (B.Tech)',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2023',
      endDate: '2027 (Expected)',
      gradeLabel: 'CGPA',
      grade: null,
      resultTitle: 'B.Tech Result',
      resultLabel: 'Semester 6 · SGPA 8.45',
      resultImageUrl: '/src/assets/education/btech-result.png',
      description:
        'Currently in the final year of studies, maintaining strong academic standing with primary emphasis on software engineering, data structures, relational database management systems, and modern web application development.',
      coursework: [
        'Data Structures & Algorithms',
        'Database Management Systems (DBMS)',
        'Object-Oriented Programming (OOP)',
        'Computer Networks & Protocols',
        'Operating Systems & Systems Architecture',
        'Software Engineering & Agile Methodologies',
      ],
      sortOrder: 1,
      isVisible: true,
    },
    {
      institution: 'Gurukul English School, Beed, India',
      degree: 'XII Standard (Higher Secondary)',
      fieldOfStudy: 'PCM (Physics, Chemistry, Mathematics)',
      startDate: '2022',
      endDate: '2023',
      gradeLabel: 'Percentage',
      grade: null,
      resultTitle: null,
      resultLabel: null,
      resultImageUrl: null,
      description: 'Completed the XII Standard (Higher Secondary) with a focus on Physics, Chemistry, and Mathematics.',
      coursework: ['Physics', 'Chemistry', 'Mathematics'],
      sortOrder: 2,
      isVisible: true,
    },
    {
      institution: 'Gurukul English School, Beed, India',
      degree: 'X Standard (Secondary)',
      fieldOfStudy: 'General Education',
      startDate: '2020',
      endDate: '2021',
      gradeLabel: 'Percentage',
      grade: null,
      resultTitle: null,
      resultLabel: null,
      resultImageUrl: null,
      description: 'Completed the X Standard (Secondary) with a focus on general education.',
      coursework: [],
      sortOrder: 3,
      isVisible: true,
    },
  ];

  for (const edu of realEducation) {
    const existing = await prisma.education.findFirst({ where: { institution: edu.institution, degree: edu.degree } });
    if (!existing) {
      const created = await prisma.education.create({ data: edu });
      console.log(`[CREATED] Education: ${edu.institution} - ${edu.degree} (ID: ${created.id})`);
    } else {
      console.log(`[EXISTS] Education: ${edu.institution} - ${edu.degree}`);
    }
  }

  // 5. Skills
  const realSkills: { name: string; category: SkillCategory; highlight: boolean; sortOrder: number }[] = [
    // Frontend
    { name: 'React', category: SkillCategory.FRONTEND, highlight: true, sortOrder: 1 },
    { name: 'JavaScript (ES6+)', category: SkillCategory.FRONTEND, highlight: true, sortOrder: 2 },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND, highlight: true, sortOrder: 3 },
    { name: 'HTML5 & Semantic Markup', category: SkillCategory.FRONTEND, highlight: false, sortOrder: 4 },
    { name: 'CSS3 & Modern Layouts', category: SkillCategory.FRONTEND, highlight: false, sortOrder: 5 },
    { name: 'Responsive Web Design', category: SkillCategory.FRONTEND, highlight: false, sortOrder: 6 },
    // Backend
    { name: 'Node.js', category: SkillCategory.BACKEND, highlight: true, sortOrder: 1 },
    { name: 'Express.js', category: SkillCategory.BACKEND, highlight: true, sortOrder: 2 },
    { name: 'RESTful API Architecture', category: SkillCategory.BACKEND, highlight: true, sortOrder: 3 },
    { name: 'JSON Web Tokens (JWT)', category: SkillCategory.BACKEND, highlight: false, sortOrder: 4 },
    { name: 'API Security & Validation', category: SkillCategory.BACKEND, highlight: false, sortOrder: 5 },
    { name: 'Middleware Design', category: SkillCategory.BACKEND, highlight: false, sortOrder: 6 },
    // Database
    { name: 'PostgreSQL', category: SkillCategory.DATABASE, highlight: true, sortOrder: 1 },
    { name: 'SQL & Query Optimization', category: SkillCategory.DATABASE, highlight: true, sortOrder: 2 },
    { name: 'Neon Postgres', category: SkillCategory.DATABASE, highlight: false, sortOrder: 3 },
    // Tools
    { name: 'Git', category: SkillCategory.TOOLS, highlight: true, sortOrder: 1 },
    { name: 'GitHub & Git Workflow', category: SkillCategory.TOOLS, highlight: true, sortOrder: 2 },
    { name: 'Vercel / Render Deployment', category: SkillCategory.TOOLS, highlight: true, sortOrder: 3 },
    { name: 'Insomnia API Testing', category: SkillCategory.TOOLS, highlight: true, sortOrder: 4 },
    { name: 'Vite & Modern Bundlers', category: SkillCategory.TOOLS, highlight: false, sortOrder: 5 },
    { name: 'VS Code & Dev Environments', category: SkillCategory.TOOLS, highlight: false, sortOrder: 6 },
  ];

  for (const sk of realSkills) {
    const existing = await prisma.skill.findFirst({ where: { name: sk.name, category: sk.category } });
    if (!existing) {
      await prisma.skill.create({ data: sk });
      console.log(`[CREATED] Skill: ${sk.name} (${sk.category})`);
    } else {
      console.log(`[EXISTS] Skill: ${sk.name}`);
    }
  }

  // 6. Social Links
  const realSocials = [
    {
      platform: 'GitHub',
      url: 'https://github.com/CA170206',
      username: 'CA170206',
      icon: 'github',
      sortOrder: 1,
      isVisible: true,
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/chaitanya-anmulwar',
      username: 'chaitanya-anmulwar',
      icon: 'linkedin',
      sortOrder: 2,
      isVisible: true,
    },
    {
      platform: 'Email',
      url: 'mailto:chaitanyaanmulwar1702@gmail.com',
      username: 'chaitanyaanmulwar1702@gmail.com',
      icon: 'mail',
      sortOrder: 3,
      isVisible: true,
    },
  ];

  for (const sl of realSocials) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: sl.platform } });
    if (!existing) {
      const created = await prisma.socialLink.create({ data: sl });
      console.log(`[CREATED] SocialLink: ${sl.platform} (ID: ${created.id})`);
    } else {
      console.log(`[EXISTS] SocialLink: ${sl.platform}`);
    }
  }

  console.log('\n=== Real Portfolio Data Initialization Completed Successfully ===');
}

seedRealData()
  .catch((e) => {
    console.error('Failed to initialize real data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
