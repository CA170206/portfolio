import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { experienceData } from '../data/experience';
import offerLetter from '../assets/experience/offer-letter.png';

export const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      className="py-24 relative overflow-hidden bg-slate-100/70 dark:bg-[#12161b] transition-colors duration-200"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#d6a83a]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
              Experience
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Where I've worked.
          </h2>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-[#aeb6c0]">
            Professional experience, collaboration, and hands-on engineering
            work in real-world development environments.
          </p>
        </motion.div>

        {/* Main Experience + Offer Letter */}
        <div className="grid lg:grid-cols-[1.55fr_0.85fr] gap-8 items-start">

          {/* Experience */}
          <div className="relative">

            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px hidden sm:block bg-slate-300 dark:bg-[#303841]" />

            {experienceData.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative sm:pl-12"
              >
                {/* Timeline indicator */}
                <div className="hidden sm:flex absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full items-center justify-center bg-slate-100 dark:bg-[#12161b] border-2 border-[#d6a83a]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d6a83a]" />
                </div>

                {/* Experience card */}
                <div className="rounded-2xl border border-slate-200 dark:border-[#303841] bg-white dark:bg-[#181c21] p-6 sm:p-8 shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-[#47525f]">

                  {/* Top section */}
                  <div className="flex flex-col gap-5 pb-6 border-b border-slate-200 dark:border-[#303841]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                          {item.position}
                        </h3>

                        {item.isCurrent && (
                          <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#b48316] dark:text-[#d6a83a] bg-amber-500/10 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d6a83a] animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-base sm:text-lg font-medium text-[#b48316] dark:text-[#d6a83a]">
                        {item.company}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-500 dark:text-[#89939f]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#b48316] dark:text-[#d6a83a]" />
                        <span>
                          {item.startDate} — {item.endDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#b48316] dark:text-[#d6a83a]" />
                        <span>
                          {item.location} · {item.employmentType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="py-6">
                    <ul className="space-y-4">
                      {item.description.map((point, pointIndex) => (
                        <motion.li
                          key={pointIndex}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.15 + pointIndex * 0.08,
                          }}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0 bg-[#d6a83a]" />

                          <p className="text-sm sm:text-[15px] leading-7 text-slate-600 dark:text-[#b7bec7]">
                            {point}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="pt-5 border-t border-slate-200 dark:border-[#303841]">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <span className="text-[11px] uppercase tracking-[0.16em] font-semibold shrink-0 text-slate-500 dark:text-[#707b87]">
                        Technologies
                      </span>

                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-sm text-slate-700 dark:text-[#c4cad1]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-slate-400 dark:text-[#69737e]">
                      {item.employmentType}
                    </span>

                    <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#59636e]" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Offer Letter */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-28"
          >
            {/* Heading */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#b48316] dark:text-[#d6a83a]" />

                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                    Documentation
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-[#f4f5f6]">
                  Offer Letter
                </h3>
              </div>
            </div>

            {/* Document preview */}
            <a
              href={offerLetter}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              aria-label="View offer letter"
            >
              <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-[#303841] bg-white dark:bg-[#181c21] p-2 shadow-sm transition-all duration-300 group-hover:-translate-y-1">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-950">
                  <img
                    src={offerLetter}
                    alt="Offer Letter"
                    className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.025]"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/60 dark:bg-[rgba(18,22,27,0.72)]">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#d6a83a] text-[#12161b]">
                      <ExternalLink className="w-4 h-4" />
                      View Offer Letter
                    </div>
                  </div>
                </div>
              </div>
            </a>

            {/* Caption */}
            <div className="flex items-center justify-between mt-4 px-1">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-[#d7dce1]">
                  Web Development
                </p>

                <p className="text-xs mt-1 text-slate-500 dark:text-[#707b87]">
                  Labmentix · 6 Month Internship
                </p>
              </div>

              <a
                href={offerLetter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-[#b48316] dark:text-[#d6a83a] transition-colors"
              >
                Open
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};