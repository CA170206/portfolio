import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';
import { GithubIcon } from '../components/icons/SocialIcons';
import { projectsData } from '../data/projects';
import type { Project } from '../types/portfolio';

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectProject }) => {
  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#f8fafc] dark:bg-[#12171d] py-24 md:py-28 transition-colors duration-200"
    >
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mb-14 max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-[#d6a83a]" />

            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#b48316] dark:text-[#d6a83a]">
              Selected Work
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-900 dark:text-[#f1f3f5] sm:text-4xl md:text-5xl">
            Projects I&apos;ve built.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#a5afb9] sm:text-base">
            A collection of full-stack applications built to solve practical
            problems and explore different areas of software development.
          </p>
        </motion.div>

        {/* =================================================
            PROJECTS
        ================================================== */}
        <div className="space-y-20 md:space-y-28">
          {projectsData.map((project, index) => {
            const isReversed = index % 2 === 1;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                className="group"
              >
                <div
                  className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
                    isReversed ? 'lg:[&>*:first-child]:order-2' : ''
                  }`}
                >

                  {/* =================================================
                      PROJECT IMAGE
                  ================================================== */}
                  <div className="lg:col-span-7">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="group/image relative block w-full cursor-pointer text-left"
                      aria-label={`View ${project.title} case study`}
                    >
                      <div className="relative overflow-hidden border border-slate-300 dark:border-[#39424b] bg-white dark:bg-[#1b2127] p-2 shadow-md dark:shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:border-slate-400 dark:group-hover:border-[#59636e]">
                        <div className="relative overflow-hidden bg-slate-100 dark:bg-[#20262d]">
                          <img
                            src={project.thumbnail}
                            alt={`${project.title} preview`}
                            className="block h-auto max-h-[480px] w-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.025]"
                          />

                          {/* Hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 dark:bg-[#11151a]/65 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover/image:opacity-100">
                            <span className="inline-flex items-center gap-2 border border-[#d6a83a]/50 bg-white/95 dark:bg-[#161b21]/95 px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-[#f1f3f5] shadow-xl">
                              <BookOpen className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />
                              View Case Study
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Image number */}
                      <span className="absolute -bottom-3 -left-2 bg-[#f8fafc] dark:bg-[#12171d] px-2 text-[11px] font-medium tracking-[0.12em] text-slate-400 dark:text-[#68737e]">
                        0{index + 1}
                      </span>
                    </button>
                  </div>

                  {/* =================================================
                      PROJECT INFORMATION
                  ================================================== */}
                  <div className="lg:col-span-5">

                    {/* Project number / type */}
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                        Project {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="h-px w-8 bg-slate-300 dark:bg-[#424b54]" />

                      <span className="text-[11px] uppercase tracking-[0.15em] text-slate-500 dark:text-[#78838e]">
                        Full-Stack
                      </span>
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-3">
                      <h3 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-slate-900 dark:text-[#f0f2f4] sm:text-4xl">
                        {project.title}
                      </h3>

                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        aria-label={`Open ${project.title} case study`}
                        className="mt-1.5 shrink-0 text-slate-400 dark:text-[#7f8994] transition-colors hover:text-[#b48316] dark:hover:text-[#d6a83a]"
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Tagline */}
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-700 dark:text-[#b1bac3]">
                      {project.tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-[#969faa]">
                      {project.shortDescription}
                    </p>

                    {/* Technologies */}
                    <div className="mt-7">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-[#6f7a85]">
                        Built With
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-medium text-slate-600 dark:text-[#aeb7c0] transition-colors hover:text-[#b48316] dark:hover:text-[#d6a83a]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">

                      <button
                        type="button"
                        onClick={() => onSelectProject(project)}
                        className="group/button inline-flex items-center gap-2 bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12171d] shadow-sm transition-all duration-200 hover:bg-[#e2b84a]"
                      >
                        Case Study
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-slate-300 dark:border-[#3d4650] bg-white dark:bg-[#1b2127] px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-[#c3c9cf] shadow-sm dark:shadow-none transition-all duration-200 hover:border-slate-400 dark:hover:border-[#59636e] hover:bg-slate-50 dark:hover:bg-[#232a31] hover:text-slate-950 dark:hover:text-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Live Demo
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-2 py-2.5 text-xs font-medium text-slate-600 dark:text-[#8b96a1] transition-colors hover:text-slate-950 dark:hover:text-white"
                        >
                          <GithubIcon className="h-3.5 w-3.5" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < projectsData.length - 1 && (
                  <div className="mt-20 border-b border-slate-200 dark:border-[#303941] md:mt-28" />
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 flex items-center gap-4 text-xs text-slate-400 dark:text-[#68737e]"
        >
          <span className="h-px w-10 bg-slate-300 dark:bg-[#3a434c]" />
          <span>More projects and details available in the case studies</span>
        </motion.div>
      </div>
    </section>
  );
};