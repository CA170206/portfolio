import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

interface AdminPlaceholderProps {
  title: string;
  description?: string;
}

export const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({
  title,
  description = 'The CRUD management interface for this section will be implemented in Milestone 7.',
}) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-zinc-800/80 bg-[#11161f] p-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-800 bg-[#0c1017] text-[#d6a83a]">
        <Construction className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-400">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#141b24] px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
