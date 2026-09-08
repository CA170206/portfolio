import jpMorganImg from '../assets/certificates/jpmorgan.jpg';
import deloitteImg from '../assets/certificates/deloitte.jpg';
import ibmDataScienceImg from '../assets/certificates/ibm-data-science.jpg';
import metaBackendImg from '../assets/certificates/meta-backend.jpg';
// import nptelBusinessImg from '../assets/certificates/nptel-business.jpg';

export const certificatesData = [
  {
    id: 'cert-jpmorgan',
    name: 'Software Engineering Job Simulation',
    issuer: 'JPMorgan Chase & Co.',
    issueDate: 'July 29, 2026',
    credentialId: '',
    verificationUrl:
      'https://www.theforage.com/completion-certificates/Sj7temL583QAYpHXD/E6McHJDKsQYh79moz_Sj7temL583QAYpHXD_6a685e4c871865d389c8608c_1785323909540_completion_certificate.pdf',
    image: jpMorganImg,
    description:
      'Completed a practical software engineering job simulation through Forage, working through hands-on development tasks.',
    skills: [
      'Software Engineering',
      'REST APIs',
      'Web Development',
    ],
  },

  {
    id: 'cert-deloitte',
    name: 'Technology Job Simulation',
    issuer: 'Deloitte',
    issueDate: 'July 28, 2026',
    credentialId: '',
    verificationUrl:
      'https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/udmxiyHeqYQLkTPvf_9PBTqmSxAf6zZTseP_6a685e4c871865d389c8608c_1785229463028_completion_certificate.pdf',
    image: deloitteImg,
    description:
      'Completed a practical technology job simulation through Forage, gaining hands-on exposure to technology-focused tasks.',
    skills: [
      'Technology',
      'Coding',
      'Development',
    ],
  },

  {
    id: 'cert-ibm-data-science',
    name: 'What is Data Science?',
    issuer: 'IBM',
    issueDate: 'September 6, 2025',
    credentialId: 'D4A34JEPPH4M',
    verificationUrl:
      'https://www.coursera.org/account/accomplishments/records/D4A34JEPPH4M',
    image: ibmDataScienceImg,
    description:
      'Completed the IBM course What is Data Science? through Coursera.',
    skills: [
      'Data Science',
      'Data Analysis',
    ],
  },

  {
    id: 'cert-meta-backend',
    name: 'Introduction to Back-End Development',
    issuer: 'Meta',
    issueDate: 'September 6, 2025',
    credentialId: 'ON3NYGBAWM6L',
    verificationUrl:
      'https://www.coursera.org/account/accomplishments/records/ON3NYGBAWM6L',
    image: metaBackendImg,
    description:
      'Completed Meta’s Introduction to Back-End Development course through Coursera, covering back-end and full-stack development fundamentals.',
    skills: [
      'Back-End Development',
      'Web Development',
    ],
  },

  // {
  //   id: 'cert-nptel-business',
  //   name: 'Business Development: From Start to Scale',
  //   issuer: 'NPTEL · IIT Madras',
  //   issueDate: 'January–April 2026',
  //   credentialId: '',
  //   verificationUrl:
  //     'https://nptel.ac.in/noc/E_Certificate/NOC26MG50S26220126104443794',
  //   image: nptelBusinessImg,
  //   description:
  //     'Successfully completed the NPTEL course Business Development: From Start to Scale with a consolidated score of 73%.',
  //   skills: [
  //     'Business Development',
  //     'Business Strategy',
  //   ],
  // },
];