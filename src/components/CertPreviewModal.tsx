import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Award,
} from 'lucide-react';
import type { CertificateItem } from '../types/portfolio';

interface CertPreviewModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertPreviewModal = ({ certificate, onClose }: CertPreviewModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (certificate) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [certificate, onClose]);

  if (!certificate) {
    return null;
  }

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
          className="relative z-10 w-full max-w-3xl overflow-hidden border border-[#d7d9dc] bg-[#f5f4f0] text-[#20242a] shadow-2xl transition-colors dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#d7d9dc] bg-[#f5f4f0] px-6 py-4 dark:border-[#303841] dark:bg-[#12161b]">
            <div className="flex min-w-0 items-center gap-3">
              <Award className="h-4 w-4 shrink-0 text-[#b48316] dark:text-[#d6a83a]" />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                  Certificate
                </p>

                <h3 className="mt-1 truncate text-sm font-semibold text-[#20242a] dark:text-[#f4f5f6] sm:text-base">
                  {certificate.name}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="ml-4 shrink-0 border border-[#d7d9dc] p-2 text-[#69737e] transition-colors hover:border-[#b48316] hover:text-[#b48316] dark:border-[#303841] dark:text-[#7f8995] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-8 p-6 sm:p-8">
            {/* Certificate Image */}
            <div className="flex items-center justify-center overflow-hidden border border-[#d7d9dc] bg-[#e9e8e4] dark:border-[#303841] dark:bg-[#181d23]">
              <img
                src={certificate.image}
                alt={certificate.name}
                className="max-h-[480px] w-full object-contain"
              />
            </div>

            {/* Details */}
            <div>
              <div className="grid grid-cols-1 gap-6 border-y border-[#d7d9dc] py-6 dark:border-[#303841] sm:grid-cols-2">
                {/* Issuer */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#69737e] dark:text-[#7f8995]">
                    Issuing Organization
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#20242a] dark:text-[#f4f5f6]">
                    {certificate.issuer}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#b48316] dark:text-[#d6a83a]" />

                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#69737e] dark:text-[#7f8995]">
                      Issue Date
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-[#4f5862] dark:text-[#aeb6c0]">
                    {certificate.issueDate}
                  </p>
                </div>

                {/* Credential ID */}
                {certificate.credentialId && (
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#69737e] dark:text-[#7f8995]">
                      Credential ID
                    </p>

                    <p className="mt-2 break-all font-mono text-xs text-[#b48316] dark:text-[#d6a83a]">
                      {certificate.credentialId}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="mt-6 text-sm leading-7 text-[#4f5862] dark:text-[#aeb6c0]">
                {certificate.description}
              </p>

              {/* Skills */}
              <div className="mt-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#69737e] dark:text-[#7f8995]">
                  Verified Competencies
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-2 text-xs text-[#4f5862] dark:text-[#aeb6c0]"
                    >
                      <span className="h-1.5 w-1.5 bg-[#d6a83a]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-5 border-t border-[#d7d9dc] bg-[#eeede9] px-6 py-5 dark:border-[#303841] dark:bg-[#181d23] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-[#69737e] dark:text-[#8f99a5]">
              <ShieldCheck className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

              <span>Credential available for verification</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={certificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-[#303841] px-4 py-2.5 text-xs font-semibold text-[#4f5862] transition-colors hover:border-[#b48316] hover:text-[#b48316] dark:border-[#3a424b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a]"
              >
                Verify on Issuer Site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center bg-[#d6a83a] px-5 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f]"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};