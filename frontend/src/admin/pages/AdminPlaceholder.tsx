import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

interface AdminPlaceholderProps {
  title: string;
  description?: string;
}

export const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({
  title,
  description = 'This section is not available yet.',
}) => {
  return (
    <section className="relative min-h-[60vh] overflow-hidden border border-slate-200 bg-[#f7f6f2] dark:border-[#303841] dark:bg-[#12161b]">
      {/* Subtle technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-slate-300 bg-white text-[#d6a83a] dark:border-[#303841] dark:bg-[#181d23]">
          <Construction className="h-5 w-5" strokeWidth={1.7} />
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6a83a]">
          CMS
        </p>

        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-[#aeb6c0]">
          {description}
        </p>

        <Link
          to="/admin"
          className="mt-7 inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#181d23] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default AdminPlaceholder;