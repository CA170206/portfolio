import React, { useEffect, useState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Briefcase,
  Users,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { LinkedinIcon } from '../../components/icons/SocialIcons';
import apiClient from '../api/client';

interface LinkedinFormData {
  id?: string;
  profileUrl: string;
  followers: string;
  connections: string;
  role: string;
  company: string;
  location: string;
  education: string;
  updatedAt?: string;
}

const inputClass =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

export const LinkedInManager: React.FC = () => {
  const [formData, setFormData] = useState<LinkedinFormData>({
    profileUrl: 'https://linkedin.com/in/chaitanya-anmulwar',
    followers: '1000+',
    connections: '500+',
    role: 'Web Development Intern',
    company: 'Labmentix',
    location: 'Greater Nashik Area',
    education: 'B.Tech CSE',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchLinkedinConfig = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await apiClient.get<LinkedinFormData>('/linkedin');
      if (res.success && res.data) {
        setFormData({
          id: res.data.id,
          profileUrl: res.data.profileUrl || 'https://linkedin.com/in/chaitanya-anmulwar',
          followers: res.data.followers || '1000+',
          connections: res.data.connections || '500+',
          role: res.data.role || 'Web Development Intern',
          company: res.data.company || 'Labmentix',
          location: res.data.location || 'Greater Nashik Area',
          education: res.data.education || 'B.Tech CSE',
          updatedAt: res.data.updatedAt,
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to load LinkedIn settings from server.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedinConfig();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.profileUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'LinkedIn profile URL is required.' });
      return;
    }

    if (!formData.followers.trim()) {
      setStatusMessage({ type: 'error', text: 'Followers count is required.' });
      return;
    }

    if (!formData.connections.trim()) {
      setStatusMessage({ type: 'error', text: 'Connections count is required.' });
      return;
    }

    if (!formData.role.trim()) {
      setStatusMessage({ type: 'error', text: 'Role is required.' });
      return;
    }

    if (!formData.company.trim()) {
      setStatusMessage({ type: 'error', text: 'Company is required.' });
      return;
    }

    if (!formData.location.trim()) {
      setStatusMessage({ type: 'error', text: 'Location is required.' });
      return;
    }

    if (!formData.education.trim()) {
      setStatusMessage({ type: 'error', text: 'Education is required.' });
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiClient.put<LinkedinFormData>('/linkedin', {
        profileUrl: formData.profileUrl.trim(),
        followers: formData.followers.trim(),
        connections: formData.connections.trim(),
        role: formData.role.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        education: formData.education.trim(),
      });

      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          ...res.data,
        }));
        setStatusMessage({
          type: 'success',
          text: 'LinkedIn settings saved successfully and updated across public portfolio.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to save LinkedIn settings.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving settings.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-[#7f8995]">
          <Loader2 className="h-6 w-6 animate-spin text-[#d6a83a]" />
          <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
            Loading LinkedIn settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-300 pb-5 dark:border-[#303841] sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#d6a83a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47d18] dark:text-[#d6a83a]">
              LinkedIn Integration
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            LinkedIn CMS
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
            Manually maintain your professional headline, metrics, and highlights displayed in the
            approved LinkedIn portfolio section.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-[#c49830] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Status Feedback */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-start gap-3 border px-4 py-3 text-xs ${
            statusMessage.type === 'success'
              ? 'border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300'
              : 'border-red-500/25 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
          )}
          <span className="leading-5">{statusMessage.text}</span>
        </div>
      )}

      {/* Live Preview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-slate-300 bg-[#faf9f6] p-4 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-2 text-slate-500 dark:text-[#7f8995]">
            <Users className="h-3.5 w-3.5 text-[#0a66c2]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Network Reach</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
            {formData.followers} followers · {formData.connections} connections
          </p>
        </div>

        <div className="border border-slate-300 bg-[#faf9f6] p-4 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-2 text-slate-500 dark:text-[#7f8995]">
            <Briefcase className="h-3.5 w-3.5 text-[#0a66c2]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Current Role</span>
          </div>
          <p className="mt-2 truncate text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
            {formData.role} at {formData.company}
          </p>
        </div>

        <div className="border border-slate-300 bg-[#faf9f6] p-4 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-2 text-slate-500 dark:text-[#7f8995]">
            <ExternalLink className="h-3.5 w-3.5 text-[#0a66c2]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Profile Link</span>
          </div>
          <a
            href={formData.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block truncate text-sm font-semibold text-[#0a66c2] hover:underline dark:text-[#388bfd]"
          >
            {formData.profileUrl}
          </a>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Link & Metrics Section */}
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <div className="flex items-center gap-3">
              <LinkedinIcon className="h-4 w-4 text-[#0a66c2]" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                  Profile & Audience Statistics
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                  Public URL and audience count display values
                </p>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-[0.14em] text-slate-400 dark:text-[#4b5560]">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
            <div className="md:col-span-3">
              <label
                htmlFor="profileUrl"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                LinkedIn Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                id="profileUrl"
                name="profileUrl"
                type="url"
                value={formData.profileUrl}
                onChange={handleChange}
                placeholder="e.g. https://linkedin.com/in/chaitanya-anmulwar"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="followers"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                Followers <span className="text-red-500">*</span>
              </label>
              <input
                id="followers"
                name="followers"
                type="text"
                value={formData.followers}
                onChange={handleChange}
                placeholder="e.g. 1000+"
                required
                className={inputClass}
              />
              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#6a737d]">
                Text or formatted count (e.g. "1000+"). Displayed verbatim.
              </p>
            </div>

            <div>
              <label
                htmlFor="connections"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                Connections <span className="text-red-500">*</span>
              </label>
              <input
                id="connections"
                name="connections"
                type="text"
                value={formData.connections}
                onChange={handleChange}
                placeholder="e.g. 500+"
                required
                className={inputClass}
              />
              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#6a737d]">
                Display value (e.g. "500+").
              </p>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Greater Nashik Area"
                  required
                  className={inputClass}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#6a737d]">
                Geographic location on LinkedIn card.
              </p>
            </div>
          </div>
        </section>

        {/* Professional Details Section */}
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-[#d6a83a]" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                  Professional Details
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                  Experience title, organization, and academic qualifications
                </p>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-[0.14em] text-slate-400 dark:text-[#4b5560]">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                Role / Title <span className="text-red-500">*</span>
              </label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Web Development Intern"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Labmentix"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="education"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                Education <span className="text-red-500">*</span>
              </label>
              <input
                id="education"
                name="education"
                type="text"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g. B.Tech CSE"
                required
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Security & Anti-Scraping Policy */}
        <section className="border border-slate-300 bg-[#faf9f6] p-5 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-800 dark:text-[#f4f5f6]">
                Safe Manual Maintenance
              </h3>
              <p className="text-[11px] leading-5 text-slate-500 dark:text-[#7f8995]">
                LinkedIn statistics are maintained manually by the administrator. The platform does not
                perform automated scraping, does not store or request LinkedIn credentials, and does
                not attempt to bypass third-party access policies.
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end border-t border-slate-300 pt-5 dark:border-[#303841]">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-[#c49830] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LinkedInManager;
