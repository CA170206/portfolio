import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  CheckCircle,
  Cpu,
  AlertTriangle,
  Lightbulb,
  Rocket,
  Database,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GithubIcon } from './icons/SocialIcons';
import { usePortfolioData } from '../context/PortfolioDataContext';
import type { Project } from '../types/portfolio';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
}) => {
  const { profile } = usePortfolioData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDirection, setImageDirection] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (!project) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousImage();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextImage();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setImageDirection(0);
  }, [project]);

  if (!project) {
    return null;
  }

  const { caseStudy } = project;

  /*
   * Support the new multi-image gallery while remaining
   * compatible with the existing Project type.
   */
  const projectImages =
    (project as Project & { images?: string[] }).images?.length
      ? (project as Project & { images?: string[] }).images!
      : [project.thumbnail];

  const totalImages = projectImages.length;

  const handlePreviousImage = () => {
    setImageDirection(-1);

    setCurrentImageIndex((current) =>
      current === 0
        ? totalImages - 1
        : current - 1
    );
  };

  const handleNextImage = () => {
    setImageDirection(1);

    setCurrentImageIndex((current) =>
      current === totalImages - 1
        ? 0
        : current + 1
    );
  };

  const currentImage =
    projectImages[currentImageIndex] || project.thumbnail;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm dark:bg-black/80"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300,
          }}
          className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-[#d7d9dc] bg-[#f5f4f0] text-[#20242a] shadow-2xl transition-colors dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6]"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#d7d9dc] bg-[#f5f4f0]/95 px-6 py-4 backdrop-blur-xl dark:border-[#303841] dark:bg-[#12161b]/95">
            <div className="flex min-w-0 items-center gap-4">
              <span className="hidden h-px w-8 shrink-0 bg-[#d6a83a] sm:block" />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                  Case Study
                </p>

                <h3 className="mt-1 truncate text-base font-semibold tracking-tight text-[#20242a] dark:text-[#f4f5f6]">
                  {project.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-4 shrink-0 border border-[#d7d9dc] p-2 text-[#69737e] transition-colors hover:border-[#b48316] hover:text-[#b48316] dark:border-[#303841] dark:text-[#7f8995] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a]"
              aria-label="Close case study"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-10 p-6 sm:p-8">
            {/* Project heading */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#d6a83a]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                  Full-Stack Project
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#20242a] dark:text-[#f4f5f6] sm:text-4xl">
                {project.title}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#69737e] dark:text-[#8f99a5]">
                {project.tagline}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {project.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-[#69737e] dark:text-[#8f99a5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ------------------------------------------
                PROJECT IMAGE GALLERY
            ------------------------------------------- */}
            <div className="relative overflow-hidden border border-[#d7d9dc] bg-[#e9e8e4] dark:border-[#303841] dark:bg-[#181d23]">
              {/* Image */}
              <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[360px]">
                <AnimatePresence
                  initial={false}
                  custom={imageDirection}
                  mode="wait"
                >
                  <motion.img
                    key={`${project.id}-${currentImageIndex}`}
                    src={currentImage}
                    alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                    custom={imageDirection}
                    initial={{
                      opacity: 0,
                      x:
                        imageDirection > 0
                          ? 30
                          : -30,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x:
                        imageDirection > 0
                          ? -30
                          : 30,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: 'easeOut',
                    }}
                    className="max-h-[420px] w-full object-cover"
                  />
                </AnimatePresence>

                {/* Previous button */}
                {totalImages > 1 && (
                  <button
                    type="button"
                    onClick={handlePreviousImage}
                    aria-label="Previous project image"
                    className="
                      absolute
                      left-3
                      top-1/2
                      z-10
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      border
                      border-white/30
                      bg-black/45
                      text-white
                      backdrop-blur-sm
                      transition-all
                      hover:border-[#d6a83a]
                      hover:bg-black/65
                      hover:text-[#e2b94f]
                    "
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Next button */}
                {totalImages > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next project image"
                    className="
                      absolute
                      right-3
                      top-1/2
                      z-10
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      border
                      border-white/30
                      bg-black/45
                      text-white
                      backdrop-blur-sm
                      transition-all
                      hover:border-[#d6a83a]
                      hover:bg-black/65
                      hover:text-[#e2b94f]
                    "
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

                {/* Bottom controls */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-16">
                  {/* Image counter */}
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
                    {String(currentImageIndex + 1).padStart(2, '0')}
                    <span className="mx-2 text-white/40">
                      /
                    </span>
                    {String(totalImages).padStart(2, '0')}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f]"
                      >
                        Live Demo
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}

                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/30 bg-black/40 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#d6a83a] hover:text-[#e2b94f]"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      View Source Code
                    </a>
                  </div>
                </div>
              </div>

              {/* Thumbnail navigation */}
              {totalImages > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto border-t border-[#d7d9dc] bg-[#eeede9] px-4 py-3 dark:border-[#303841] dark:bg-[#181d23]">
                  {projectImages.map(
                    (image, index) => (
                      <button
                        key={`${project.id}-thumbnail-${index}`}
                        type="button"
                        onClick={() => {
                          setImageDirection(
                            index > currentImageIndex
                              ? 1
                              : -1
                          );
                          setCurrentImageIndex(index);
                        }}
                        aria-label={`View project image ${index + 1}`}
                        className={`
                          relative
                          h-14
                          w-20
                          shrink-0
                          overflow-hidden
                          border
                          transition-all
                          ${
                            index === currentImageIndex
                              ? 'border-[#d6a83a] ring-1 ring-[#d6a83a]/30'
                              : 'border-[#d7d9dc] opacity-60 hover:opacity-100 dark:border-[#303841]'
                          }
                        `}
                      >
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                        />

                        {index ===
                          currentImageIndex && (
                          <span className="absolute inset-0 bg-[#d6a83a]/10" />
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Problem / Solution */}
            <div className="grid grid-cols-1 gap-8 border-y border-[#d7d9dc] py-8 dark:border-[#303841] md:grid-cols-2">
              <div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#69737e] dark:text-[#8f99a5]">
                    The Problem
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4f5862] dark:text-[#aeb6c0]">
                  {caseStudy.problem}
                </p>
              </div>

              <div className="border-t border-[#d7d9dc] pt-8 dark:border-[#303841] md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#69737e] dark:text-[#8f99a5]">
                    The Solution
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#4f5862] dark:text-[#aeb6c0]">
                  {caseStudy.solution}
                </p>
              </div>
            </div>

            {/* Architecture */}
            <div className="border border-[#d7d9dc] bg-[#eeede9] p-6 dark:border-[#303841] dark:bg-[#181d23]">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#69737e] dark:text-[#8f99a5]">
                  System Architecture
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[#4f5862] dark:text-[#aeb6c0]">
                {caseStudy.architectureOverview}
              </p>
            </div>

            {/* Key Features */}
            <div>
              <div className="flex items-center gap-3">
                <Cpu className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#20242a] dark:text-[#f4f5f6]">
                  Key Engineered Capabilities
                </h4>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {caseStudy.keyFeatures.map(
                  (
                    feature: string,
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 border-b border-[#d7d9dc] py-3 dark:border-[#303841]"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#b48316] dark:text-[#d6a83a]" />

                      <span className="text-xs leading-6 text-[#4f5862] dark:text-[#aeb6c0] sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#20242a] dark:text-[#f4f5f6]">
                  Detailed Technology Stack
                </h4>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {caseStudy.techStackDetails.map(
                  (
                    group: {
                      category: string;
                      technologies: string[];
                    },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="border-b border-[#d7d9dc] pb-5 dark:border-[#303841]"
                    >
                      <h5 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#69737e] dark:text-[#7f8995]">
                        {group.category}
                      </h5>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                        {group.technologies.map(
                          (
                            technology: string
                          ) => (
                            <span
                              key={technology}
                              className="text-xs text-[#4f5862] dark:text-[#aeb6c0]"
                            >
                              {technology}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Challenges / Learnings */}
            <div className="grid grid-cols-1 gap-8 border-t border-[#d7d9dc] pt-8 dark:border-[#303841] md:grid-cols-2">
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#69737e] dark:text-[#8f99a5]">
                  Technical Challenges
                </h4>

                <div className="mt-4 space-y-3">
                  {caseStudy.challenges.map(
                    (
                      challenge: string,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border-l border-[#d6a83a] pl-4 text-xs leading-6 text-[#4f5862] dark:text-[#aeb6c0] sm:text-sm"
                      >
                        {challenge}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#69737e] dark:text-[#8f99a5]">
                  Key Takeaways
                </h4>

                <div className="mt-4 space-y-3">
                  {caseStudy.learnings.map(
                    (
                      learning: string,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="border-l border-[#d6a83a] pl-4 text-xs leading-6 text-[#4f5862] dark:text-[#aeb6c0] sm:text-sm"
                      >
                        {learning}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Future Roadmap */}
            <div className="border border-[#d6a83a]/30 bg-[#d6a83a]/5 p-6 dark:border-[#d6a83a]/25 dark:bg-[#d6a83a]/[0.04]">
              <div className="flex items-center gap-3">
                <Rocket className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                  Future Roadmap & Improvements
                </span>
              </div>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-6 text-[#4f5862] dark:text-[#aeb6c0] sm:text-sm">
                {caseStudy.futureImprovements.map(
                  (
                    improvement: string,
                    index: number
                  ) => (
                    <li key={index}>
                      {improvement}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex flex-col gap-4 border-t border-[#d7d9dc] bg-[#eeede9] px-6 py-5 dark:border-[#303841] dark:bg-[#181d23] sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-[#69737e] dark:text-[#7f8995]">
              {profile?.roleBadge}
            </span>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center border border-[#303841] px-5 py-2.5 text-xs font-semibold text-[#4f5862] transition-colors hover:border-[#b48316] hover:text-[#b48316] dark:border-[#3a424b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a]"
            >
              Close Case Study
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};