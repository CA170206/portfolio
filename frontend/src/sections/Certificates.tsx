import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Calendar,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import type { CertificateItem } from '../types/portfolio';

interface CertificatesProps {
  onSelectCertificate: (certificate: CertificateItem) => void;
}

export const Certificates: React.FC<CertificatesProps> = ({ onSelectCertificate }) => {
  const { certificates } = usePortfolioData();
  return (
    <section
      id="certificates"
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
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#d6a83a]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
              Credentials
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Certificates & learning.
          </h2>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-[#aeb6c0]">
            Professional certifications, course completions, and practical
            learning experiences from recognized organizations.
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-[#303841] bg-white dark:bg-[#181c21] shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-[#47525f]"
            >
              {/* Certificate Image */}
              <button
                type="button"
                onClick={() => onSelectCertificate(cert)}
                className="relative block w-full overflow-hidden cursor-pointer text-left bg-slate-100 dark:bg-[#20262d]"
                aria-label={`View ${cert.name}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]"
                  />

                  {/* Image overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/60 dark:bg-[rgba(18,22,27,0.68)]">
                    <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#d6a83a] text-[#12161b]">
                      <Eye className="w-4 h-4" />
                      View Certificate
                    </span>
                  </div>

                  {/* Certificate number */}
                  <div className="absolute top-4 left-4 flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-[#404a54] bg-white/90 dark:bg-[rgba(18,22,27,0.88)] text-xs font-semibold text-[#b48316] dark:text-[#d6a83a]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              </button>

              {/* Content */}
              <div className="p-6">

                {/* Issuer + Date */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="text-sm font-semibold text-[#b48316] dark:text-[#d6a83a]">
                    {cert.issuer}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#89939f]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{cert.issueDate}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-[#f4f5f6] transition-colors duration-300 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]">
                  {cert.name}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#aeb6c0]">
                  {cert.description}
                </p>

                {/* Skills */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-slate-200 dark:border-[#303841]">
                    <p className="mb-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-400 dark:text-[#707b87]">
                      Skills & Topics
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs text-slate-700 dark:text-[#c4cad1]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Credential Information */}
                <div className="mt-5 pt-5 border-t border-slate-200 dark:border-[#303841]">
                  {cert.credentialId ? (
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#b48316] dark:text-[#d6a83a]" />

                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-400 dark:text-[#707b87]">
                          Credential ID
                        </p>

                        <p className="mt-1 text-xs font-mono break-all text-slate-700 dark:text-[#c4cad1]">
                          {cert.credentialId}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-slate-400 dark:text-[#59636e]" />

                      <span className="text-xs text-slate-500 dark:text-[#707b87]">
                        Credential ID not provided
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6">

                  {/* View */}
                  <button
                    type="button"
                    onClick={() => onSelectCertificate(cert)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-[#d6a83a] text-[#12161b] hover:bg-[#e2b84a] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Certificate
                  </button>

                  {/* Verify */}
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-[#3b454f] text-slate-700 dark:text-[#c4cad1] hover:bg-slate-50 dark:hover:bg-white/[0.04] text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Verify Credential
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};