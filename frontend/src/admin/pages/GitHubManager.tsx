import React, { useEffect, useState } from 'react';
import {
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Calendar,
  ShieldAlert,
  GitBranch,
} from 'lucide-react';
import { GithubIcon } from '../../components/icons/SocialIcons';
import apiClient from '../api/client';

interface GithubFormData {
  id?: string;
  username: string;
  profileUrl: string;
  totalContributions?: number;
  lastSyncedAt?: string | null;
  updatedAt?: string;
}

const inputClass =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

const formatTimestamp = (isoString?: string | null): string => {
  if (!isoString) return 'Not synced yet.';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return 'Not synced yet.';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const GitHubManager: React.FC = () => {
  const [formData, setFormData] = useState<GithubFormData>({
    username: 'CA170206',
    profileUrl: 'https://github.com/CA170206',
    totalContributions: 0,
    lastSyncedAt: null,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchGithubConfig = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await apiClient.get<GithubFormData>('/github');
      if (res.success && res.data) {
        setFormData({
          id: res.data.id,
          username: res.data.username || 'CA170206',
          profileUrl: res.data.profileUrl || 'https://github.com/CA170206',
          totalContributions: res.data.totalContributions ?? 0,
          lastSyncedAt: res.data.lastSyncedAt || null,
          updatedAt: res.data.updatedAt,
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to load GitHub configuration from backend.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGithubConfig();
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

    if (!formData.username.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'GitHub username is required.',
      });
      return;
    }

    if (!formData.profileUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'GitHub profile URL is required.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await apiClient.put<GithubFormData>('/github', {
        username: formData.username.trim(),
        profileUrl: formData.profileUrl.trim(),
      });

      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          username: res.data?.username || prev.username,
          profileUrl: res.data?.profileUrl || prev.profileUrl,
          updatedAt: res.data?.updatedAt,
        }));
        setStatusMessage({
          type: 'success',
          text: 'GitHub configuration saved successfully.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to save configuration.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving GitHub configuration.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);

    try {
      const res = await apiClient.post<GithubFormData>('/github/sync');
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          totalContributions: res.data?.totalContributions ?? prev.totalContributions,
          lastSyncedAt: res.data?.lastSyncedAt || new Date().toISOString(),
          updatedAt: res.data?.updatedAt,
        }));
        setStatusMessage({
          type: 'success',
          text: res.message || 'GitHub activity synchronized successfully.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to synchronize GitHub activity.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Synchronization failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-[#7f8995]">
          <Loader2 className="h-6 w-6 animate-spin text-[#d6a83a]" />
          <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
            Loading GitHub configuration
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
              GitHub Integration
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            GitHub CMS
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
            Configure your GitHub profile details and synchronize activity and contribution data
            for the public portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing || isSaving}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-[#d6a83a] hover:text-[#a47d18] dark:border-[#303841] dark:bg-[#181d23] dark:text-[#f4f5f6] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#d6a83a]' : ''}`} />
            <span>{isSyncing ? 'Fetching Activity...' : 'Fetch GitHub Activity'}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isSyncing}
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
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>
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

      {/* Sync Status Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-slate-300 bg-[#faf9f6] p-4 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-2 text-slate-500 dark:text-[#7f8995]">
            <Calendar className="h-3.5 w-3.5 text-[#d6a83a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Last Synced</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
            {formatTimestamp(formData.lastSyncedAt)}
          </p>
        </div>

        <div className="border border-slate-300 bg-[#faf9f6] p-4 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-2 text-slate-500 dark:text-[#7f8995]">
            <GitBranch className="h-3.5 w-3.5 text-[#d6a83a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              Contributions (Last Year)
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
            {formData.totalContributions !== undefined
              ? `${formData.totalContributions.toLocaleString()} contributions`
              : '0 contributions'}
          </p>
        </div>

        <div className="border border-slate-300 bg-[#faf9f6] p-4 dark:border-[#303841] dark:bg-[#181d23] sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-slate-500 dark:text-[#7f8995]">
            <ExternalLink className="h-3.5 w-3.5 text-[#d6a83a]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Active Profile</span>
          </div>
          <a
            href={formData.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block truncate text-sm font-semibold text-[#a47d18] hover:underline dark:text-[#d6a83a]"
          >
            @{formData.username}
          </a>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <div className="flex items-center gap-3">
              <GithubIcon className="h-4 w-4 text-[#d6a83a]" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                  Profile Settings
                </h2>
                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                  Public handle and profile link for portfolio visitors
                </p>
              </div>
            </div>
            <span className="text-[9px] uppercase tracking-[0.14em] text-slate-400 dark:text-[#4b5560]">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                GitHub Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. CA170206"
                required
                className={inputClass}
              />
              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#6a737d]">
                Used for activity queries and profile badge display.
              </p>
            </div>

            <div>
              <label
                htmlFor="profileUrl"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
              >
                GitHub Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                id="profileUrl"
                name="profileUrl"
                type="url"
                value={formData.profileUrl}
                onChange={handleChange}
                placeholder="e.g. https://github.com/CA170206"
                required
                className={inputClass}
              />
              <p className="mt-1 text-[10px] text-slate-400 dark:text-[#6a737d]">
                Full URL for external links throughout the portfolio.
              </p>
            </div>
          </div>
        </section>

        {/* Security & Architectural Notice */}
        <section className="border border-slate-300 bg-[#faf9f6] p-5 dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#a47d18] dark:text-[#d6a83a]" />
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-slate-800 dark:text-[#f4f5f6]">
                Secure Backend Synchronization
              </h3>
              <p className="text-[11px] leading-5 text-slate-500 dark:text-[#7f8995]">
                Activity is synchronized safely via the backend server and cached in the database.
                If you wish to use authenticated GitHub GraphQL API calls to avoid rate limits,
                configure a personal access token environment variable directly on Render.
                Personal access tokens are strictly server-side and never exposed to the browser.
              </p>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-slate-300 pt-5 dark:border-[#303841]">
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing || isSaving}
            className="inline-flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:border-[#d6a83a] hover:text-[#a47d18] dark:border-[#303841] dark:bg-[#181d23] dark:text-[#f4f5f6] dark:hover:border-[#d6a83a] dark:hover:text-[#d6a83a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#d6a83a]' : ''}`} />
            <span>Fetch GitHub Activity</span>
          </button>

          <button
            type="submit"
            disabled={isSaving || isSyncing}
            className="inline-flex items-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-[#c49830] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GitHubManager;
