import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  FileText,
  ExternalLink,
  X,
} from 'lucide-react';
import { experienceData } from '../data/experience';
import offerLetter from '../assets/experience/offer-letter.png';

const Experience = () => {
  const [showOfferLetter, setShowOfferLetter] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowOfferLetter(false);
      }
    };

    if (showOfferLetter) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showOfferLetter]);

  return (
    <>
      <section
        id="experience"
        className="relative overflow-hidden bg-slate-100/70 py-24 transition-colors duration-200 dark:bg-[#12161b]"
      >
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d6a83a]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
                Experience
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-4xl lg:text-5xl">
              Where I've worked.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#aeb6c0] sm:text-base">
              Professional experience, collaboration, and hands-on engineering
              work in real-world development environments.
            </p>
          </motion.div>

          {/* Main Experience + Offer Letter */}
          <div className="grid items-start gap-8 lg:grid-cols-[1.55fr_0.85fr]">
            {/* Experience */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute bottom-2 left-[7px] top-2 hidden w-px bg-slate-300 dark:bg-[#303841] sm:block" />

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
                  <div className="absolute left-0 top-1.5 hidden h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-[#d6a83a] bg-slate-100 dark:bg-[#12161b] sm:flex">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#d6a83a]" />
                  </div>

                  {/* Experience card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-[#303841] dark:bg-[#181c21] dark:shadow-none dark:hover:border-[#47525f] sm:p-8">
                    {/* Top section */}
                    <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-[#303841]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-2xl">
                            {item.position}
                          </h3>

                          {item.isCurrent && (
                            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-[#b48316] dark:text-[#d6a83a]">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d6a83a]" />
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-base font-medium text-[#b48316] dark:text-[#d6a83a] sm:text-lg">
                          {item.company}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-[#89939f] sm:text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                          <span>
                            {item.startDate} — {item.endDate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

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
                            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a83a]" />

                            <p className="text-sm leading-7 text-slate-600 dark:text-[#b7bec7] sm:text-[15px]">
                              {point}
                            </p>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div className="border-t border-slate-200 pt-5 dark:border-[#303841]">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-[#707b87]">
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

                      <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-[#59636e]" />
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
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                      Documentation
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-[#f4f5f6]">
                    Offer Letter
                  </h3>
                </div>
              </div>

              {/* Document preview trigger */}
              <button
                type="button"
                onClick={() => setShowOfferLetter(true)}
                className="group block w-full text-left"
                aria-label="Preview offer letter"
              >
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition-all duration-300 group-hover:-translate-y-1 dark:border-[#303841] dark:bg-[#181c21]">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-950">
                    <img
                      src={offerLetter}
                      alt="Offer Letter"
                      className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.025]"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-[rgba(18,22,27,0.72)]">
                      <div className="flex items-center gap-2 bg-[#d6a83a] px-4 py-2.5 text-sm font-medium text-[#12161b]">
                        <ExternalLink className="h-4 w-4" />
                        Preview Offer Letter
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Caption */}
              <div className="mt-4 flex items-center justify-between px-1">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-[#d7dce1]">
                    Web Development
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-[#707b87]">
                    Labmentix · 6 Month Internship
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOfferLetter(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#b48316] transition-colors hover:text-[#d6a83a] dark:text-[#d6a83a]"
                >
                  Open
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Offer Letter Preview Modal */}
      <AnimatePresence>
        {showOfferLetter && (
          <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfferLetter(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm dark:bg-black/80"
            />

            {/* Safe modal area below navbar */}
            <div className="relative flex h-screen items-start justify-center overflow-hidden px-3 pb-4 pt-[82px] sm:px-5 sm:pt-[88px]">
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 15 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                }}
                className="relative flex h-full max-h-[calc(100vh-98px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#cfd3d7] bg-[#f5f4f0] shadow-2xl dark:border-[#303841] dark:bg-[#12161b] sm:max-h-[calc(100vh-106px)]"
              >
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#d7d9dc] bg-[#f5f4f0] px-4 py-3.5 dark:border-[#303841] dark:bg-[#12161b] sm:px-6 sm:py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-4 w-4 shrink-0 text-[#b48316] dark:text-[#d6a83a]" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                        Documentation
                      </p>

                      <h3 className="mt-1 truncate text-sm font-semibold text-[#20242a] dark:text-[#f4f5f6] sm:text-base">
                        Offer Letter
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOfferLetter(false)}
                    className="ml-4 shrink-0 rounded-md border border-[#cfd3d7] p-2 text-[#69737e] transition-colors hover:border-[#b48316] hover:text-[#b48316] dark:border-[#303841] dark:text-[#7f8995] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a]"
                    aria-label="Close offer letter preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Image Area */}
                <div className="min-h-0 flex-1 overflow-auto bg-[#e9e8e4] p-4 dark:bg-[#181d23] sm:p-6">
                  <div className="flex min-h-full items-center justify-center">
                    <img
                      src={offerLetter}
                      alt="Offer Letter"
                      className="block h-auto w-auto max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#d7d9dc] bg-[#eeede9] px-4 py-3.5 dark:border-[#303841] dark:bg-[#181d23] sm:px-6 sm:py-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#20242a] dark:text-[#f4f5f6]">
                      Web Development
                    </p>

                    <p className="mt-1 text-[11px] text-[#69737e] dark:text-[#707b87]">
                      Labmentix · 6 Month Internship
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOfferLetter(false)}
                    className="shrink-0 rounded-md bg-[#d6a83a] px-5 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f]"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export { Experience };
export default Experience;