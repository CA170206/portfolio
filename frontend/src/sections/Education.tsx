import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  ExternalLink,
  FileText,
  X,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';

interface ResultModalData {
  image?: string;
  title: string;
  label: string;
}

const ResultHighlight = ({ label }: { label?: string }) => {
  if (!label) return null;
  const parts = String(label).split('·');

  const semester =
    parts.find((part) =>
      part.trim().toLowerCase().startsWith('semester')
    )?.trim() || parts[0]?.trim() || '';

  const sgpa =
    parts.find((part) => part.trim().toLowerCase().startsWith('sgpa'))?.trim() ||
    parts[1]?.trim() || '';

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#d6a83a]/30 bg-[#d6a83a]/[0.08] px-3 py-1.5">
      <span className="text-xs font-bold tracking-tight text-slate-800 dark:text-[#f4f5f6]">
        {semester}
      </span>

      {sgpa && (
        <>
          <span className="h-3.5 w-px bg-[#d6a83a]/40" />
          <span className="text-xs font-extrabold tracking-tight text-[#a8780e] dark:text-[#d6a83a]">
            {sgpa}
          </span>
        </>
      )}
    </div>
  );
};

const Education = () => {
  const { education } = usePortfolioData();
  const [selectedResult, setSelectedResult] = useState<ResultModalData | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedResult(null);
      }
    };

    if (selectedResult) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedResult]);

  return (
    <>
      <section
        id="education"
        className="relative overflow-hidden bg-slate-50 py-24 transition-colors duration-200 dark:bg-[#12161b]"
      >
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#6b7280 1px, transparent 1px), linear-gradient(90deg, #6b7280 1px, transparent 1px)',
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
            className="mb-14"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d6a83a]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
                Education
              </span>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-4xl lg:text-5xl">
              Academic background.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-[#aeb6c0] sm:text-base">
              My academic journey and the foundation behind my approach to
              software development.
            </p>
          </motion.div>

          {/* Education Timeline */}
          <div className="relative max-w-5xl">
            <div className="absolute bottom-3 left-[7px] top-3 hidden w-px bg-slate-300 dark:bg-[#303841] sm:block" />

            <div className="space-y-6">
              {education.map((edu, index) => {
                const hasResult = Boolean(edu.resultImage);

                return (
                  <motion.article
                    key={edu.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.08,
                    }}
                    className="relative sm:pl-12"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-7 hidden h-[15px] w-[15px] items-center justify-center rounded-full border-2 border-[#d6a83a] bg-slate-50 dark:bg-[#12161b] sm:flex">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#d6a83a]" />
                    </div>

                    {/* Education Card */}
                    <div
                      className={`rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:border-[#303841] dark:bg-[#181c21] dark:shadow-none dark:hover:border-[#47525f] ${hasResult ? 'p-5 sm:p-6' : 'p-6 sm:p-7'
                        }`}
                    >
                      {hasResult ? (
                        <div className="grid gap-7 lg:grid-cols-[1.35fr_0.65fr] lg:gap-8">
                          {/* Education Information */}
                          <div>
                            <div className="border-b border-slate-200 pb-6 dark:border-[#303841]">
                              <div className="flex flex-col gap-5">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-50 dark:border-[#39434d] dark:bg-[#20262d]">
                                    <GraduationCap className="h-5 w-5 text-[#b48316] dark:text-[#d6a83a]" />
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-xl">
                                      {edu.degree}
                                    </h3>

                                    <p className="mt-1 text-sm text-[#b48316] dark:text-[#d6a83a] sm:text-base">
                                      {edu.field}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-600 dark:text-[#aeb6c0]">
                                      {edu.institution}
                                    </p>
                                  </div>
                                </div>

                                {/* Year */}
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#aeb6c0] sm:text-sm">
                                    <Calendar className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                                    <span>
                                      {edu.startYear} — {edu.endYear}
                                    </span>
                                  </div>

                                  {edu.grade && (
                                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-[#3a444e] dark:bg-[#20262d]">
                                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-[#707b87]">
                                        {edu.gradeLabel}
                                      </span>

                                      <span className="text-sm font-semibold text-[#b48316] dark:text-[#d6a83a]">
                                        {edu.grade}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-[#b7bec7]">
                              {edu.description}
                            </p>

                            {/* Coursework */}
                            {edu.coursework &&
                              edu.coursework.length > 0 && (
                                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-[#303841]">
                                  <div className="mb-4 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-[#707b87]">
                                      Relevant Coursework
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2">
                                    {edu.coursework.map((course) => (
                                      <div
                                        key={course}
                                        className="flex items-center gap-3 border-b border-slate-100 py-2.5 dark:border-[#252c33]"
                                      >
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a83a]" />

                                        <span className="text-sm text-slate-700 dark:text-[#c4cad1]">
                                          {course}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* B.Tech Result */}
                          <div className="flex flex-col lg:border-l lg:border-slate-200 lg:pl-7 dark:lg:border-[#303841]">
                            <div className="mb-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b48316] dark:text-[#d6a83a]">
                                  Academic Result
                                </span>
                              </div>

                              <h4 className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                                {edu.resultTitle || 'B.Tech Result'}
                              </h4>
                            </div>

                            {/* Result Preview */}
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedResult({
                                  image: edu.resultImage || '',
                                  title:
                                    edu.resultTitle || 'B.Tech Result',
                                  label:
                                    edu.resultLabel ||
                                    'Semester 6 · SGPA 8.45',
                                })
                              }
                              className="group/result block w-full text-left"
                              aria-label="Preview B.Tech result"
                            >
                              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm transition-all duration-300 group-hover/result:-translate-y-1 dark:border-[#39434d] dark:bg-[#20262d]">
                                <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-950">
                                  {edu.resultImage && (
                                    <img
                                      src={edu.resultImage}
                                      alt="B.Tech Semester 6 Result"
                                      className="block h-auto w-full transition-transform duration-500 group-hover/result:scale-[1.025]"
                                    />
                                  )}

                                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition-opacity duration-300 group-hover/result:opacity-100 dark:bg-[rgba(18,22,27,0.72)]">
                                    <span className="inline-flex items-center gap-2 bg-[#d6a83a] px-3.5 py-2 text-xs font-semibold text-[#12161b]">
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      Preview Result
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>

                            {/* Result Caption — HIGHLIGHTED */}
                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div>
                                <ResultHighlight
                                  label={edu.resultLabel || 'Semester 6 · SGPA 8.45'}
                                />

                                <p className="mt-2 text-[11px] text-slate-500 dark:text-[#707b87]">
                                  Click to preview
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedResult({
                                    image: edu.resultImage || '',
                                    title: edu.resultTitle || 'B.Tech Result',
                                    label: edu.resultLabel || 'Semester 6 · SGPA 8.45',
                                  })
                                }
                                className="shrink-0 text-[#b48316] transition-colors hover:text-[#d6a83a] dark:text-[#d6a83a]"
                                aria-label="Preview B.Tech result"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-[#303841] lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-50 dark:border-[#39434d] dark:bg-[#20262d]">
                                  <GraduationCap className="h-5 w-5 text-[#b48316] dark:text-[#d6a83a]" />
                                </div>

                                <div>
                                  <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-xl">
                                    {edu.degree}
                                  </h3>

                                  <p className="mt-1 text-sm text-[#b48316] dark:text-[#d6a83a] sm:text-base">
                                    {edu.field}
                                  </p>

                                  <p className="mt-1 text-sm text-slate-600 dark:text-[#aeb6c0]">
                                    {edu.institution}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3 lg:justify-end">
                              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#aeb6c0] sm:text-sm">
                                <Calendar className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                                <span>
                                  {edu.startYear} — {edu.endYear}
                                </span>
                              </div>

                              {edu.grade && (
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-[#3a444e] dark:bg-[#20262d]">
                                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-[#707b87]">
                                    {edu.gradeLabel}
                                  </span>

                                  <span className="text-sm font-semibold text-[#b48316] dark:text-[#d6a83a]">
                                    {edu.grade}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-[#b7bec7]">
                            {edu.description}
                          </p>

                          {edu.coursework &&
                            edu.coursework.length > 0 && (
                              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-[#303841]">
                                <div className="mb-4 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

                                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-[#707b87]">
                                    Relevant Coursework
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2">
                                  {edu.coursework.map((course) => (
                                    <div
                                      key={course}
                                      className="flex items-center gap-3 border-b border-slate-100 py-2.5 dark:border-[#252c33]"
                                    >
                                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6a83a]" />

                                      <span className="text-sm text-slate-700 dark:text-[#c4cad1]">
                                        {course}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Result Preview Modal */}
      <AnimatePresence>
        {selectedResult && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedResult(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm dark:bg-black/80"
            />

            <div className="relative flex h-screen items-start justify-center overflow-hidden px-3 pb-4 pt-[82px] sm:px-5 sm:pt-[88px]">
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
                        Academic Result
                      </p>

                      <h3 className="mt-1 truncate text-sm font-semibold text-[#20242a] dark:text-[#f4f5f6] sm:text-base">
                        {selectedResult.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedResult(null)}
                    className="ml-4 shrink-0 rounded-md border border-[#cfd3d7] p-2 text-[#69737e] transition-colors hover:border-[#b48316] hover:text-[#b48316] dark:border-[#303841] dark:text-[#7f8995] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a]"
                    aria-label="Close result preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Image */}
                <div className="min-h-0 flex-1 overflow-auto bg-[#e9e8e4] p-4 dark:bg-[#181d23] sm:p-6">
                  <div className="flex min-h-full items-center justify-center">
                    {selectedResult.image && (
                      <img
                        src={selectedResult.image}
                        alt={selectedResult.title}
                        className="block h-auto w-auto max-w-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Modal Footer — HIGHLIGHTED */}
                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-[#d7d9dc] bg-[#eeede9] px-4 py-3.5 dark:border-[#303841] dark:bg-[#181d23] sm:px-6 sm:py-4">
                  <div className="min-w-0">
                    <ResultHighlight
                      label={
                        selectedResult.label || 'Semester 6 · SGPA 8.45'
                      }
                    />

                    <p className="mt-2 text-[11px] text-[#69737e] dark:text-[#707b87]">
                      Academic record
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedResult(null)}
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

export { Education };
export default Education;