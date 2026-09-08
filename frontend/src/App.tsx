import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PortfolioRoute } from './components/PortfolioRoute';
import { CaseStudyModal } from './components/CaseStudyModal';
import { CertPreviewModal } from './components/CertPreviewModal';
import { Toast } from './components/ui/Toast';

import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Experience } from './sections/Experience';
import { Skills } from './sections/Skills';
import { Certificates } from './sections/Certificates';
import { Education } from './sections/Education';
import { GitHubSection } from './sections/GitHubSection';
import { LinkedInSection } from './sections/LinkedInSection';
import { Contact } from './sections/Contact';

import type { Project, CertificateItem } from './types/portfolio';

function AppContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(
    null
  );
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'info' = 'success'
  ) => {
    setToast({ message, type });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-900 transition-colors duration-200 selection:bg-[#d6a83a]/25 selection:text-[#946914] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:selection:text-[#e2b94f]">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <Navbar />

      <PortfolioRoute />

      <main className="relative z-10">
        <Hero />

        <About />

        <Projects
          onSelectProject={(project) => setSelectedProject(project)}
        />

        <Experience />

        <Skills />

        <Certificates
          onSelectCertificate={(certificate) =>
            setSelectedCert(certificate)
          }
        />

        <Education />

        <GitHubSection />

        <LinkedInSection />

        <Contact onShowToast={showToast} />
      </main>

      <Footer />

      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CertPreviewModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      <Toast
        message={toast ? toast.message : null}
        type={toast ? toast.type : 'success'}
        onClose={() => setToast(null)}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;