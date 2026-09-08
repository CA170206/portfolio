import React, { useEffect, useState } from 'react';
import {
  Share2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Mail,
  Globe,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
} from '../../components/icons/SocialIcons';
import apiClient from '../api/client';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  username: string | null;
  icon: string | null;
  sortOrder: number;
  isVisible: boolean;
}

const getPlatformIcon = (
  iconName: string | null,
  platform: string
) => {
  const normalized = (iconName || platform).toLowerCase();

  if (normalized.includes('github')) {
    return <GithubIcon className="h-4 w-4" />;
  }

  if (normalized.includes('linkedin')) {
    return <LinkedinIcon className="h-4 w-4" />;
  }

  if (
    normalized.includes('mail') ||
    normalized.includes('email')
  ) {
    return <Mail className="h-4 w-4" />;
  }

  return <Globe className="h-4 w-4" />;
};

const inputClass =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

export const SocialLinksManager: React.FC = () => {
  const [socialLinks, setSocialLinks] = useState<
    SocialLinkItem[]
  >([]);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] =
    useState<boolean>(false);

  const [editingLink, setEditingLink] =
    useState<SocialLinkItem | null>(null);

  const [isSaving, setIsSaving] =
    useState<boolean>(false);

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    username: '',
    icon: '',
    sortOrder: 0,
    isVisible: true,
  });

  const [deleteTarget, setDeleteTarget] =
    useState<SocialLinkItem | null>(null);

  const [isDeleting, setIsDeleting] =
    useState<boolean>(false);

  const fetchSocialLinks = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get<SocialLinkItem[]>(
        '/social-links'
      );

      if (res.success && res.data) {
        setSocialLinks(res.data);
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'Failed to load social links.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text:
          'Network error while loading social links.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const openAddModal = () => {
    setEditingLink(null);

    setFormData({
      platform: '',
      url: '',
      username: '',
      icon: '',
      sortOrder: socialLinks.length + 1,
      isVisible: true,
    });

    setIsFormModalOpen(true);
  };

  const openEditModal = (
    link: SocialLinkItem
  ) => {
    setEditingLink(link);

    setFormData({
      platform: link.platform,
      url: link.url,
      username: link.username || '',
      icon: link.icon || '',
      sortOrder: link.sortOrder,
      isVisible: link.isVisible,
    });

    setIsFormModalOpen(true);
  };

  const handleSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.platform.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Platform name is required.',
      });
      return;
    }

    if (!formData.url.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'URL is required.',
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const payload = {
      platform: formData.platform.trim(),
      url: formData.url.trim(),
      username:
        formData.username.trim() || null,
      icon: formData.icon.trim() || null,
      sortOrder:
        Number(formData.sortOrder) || 0,
      isVisible: formData.isVisible,
    };

    try {
      let res;

      if (editingLink) {
        res = await apiClient.put(
          `/social-links/${editingLink.id}`,
          payload
        );
      } else {
        res = await apiClient.post(
          '/social-links',
          payload
        );
      }

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: editingLink
            ? `Social link "${formData.platform}" updated successfully.`
            : `Social link "${formData.platform}" added successfully.`,
        });

        setIsFormModalOpen(false);

        await fetchSocialLinks();
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'Failed to save social link.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text:
          'Network error occurred while saving social link.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setStatusMessage(null);

    try {
      const res = await apiClient.delete(
        `/social-links/${deleteTarget.id}`
      );

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Social link "${deleteTarget.platform}" deleted successfully.`,
        });

        setDeleteTarget(null);

        await fetchSocialLinks();
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'Failed to delete social link.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error deleting social link.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {/* Subtle admin grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.025] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-300 pb-5 dark:border-[#303841] sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#d6a83a]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47d18] dark:text-[#d6a83a]">
              Social Links
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Social Links Management
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
            Manage the social profiles and contact links
            displayed across your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/30"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Social Link
        </button>
      </div>

      {/* Notification */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-start gap-3 border px-4 py-3 text-xs ${statusMessage.type === 'success'
              ? 'border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300'
              : 'border-red-500/25 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300'
            }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
          )}

          <span className="flex-1 leading-5">
            {statusMessage.text}
          </span>

          <button
            type="button"
            onClick={() =>
              setStatusMessage(null)
            }
            className="text-slate-400 transition-colors hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-[#7f8995]">
            <Loader2 className="h-6 w-6 animate-spin text-[#d6a83a]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
              Loading social links
            </p>
          </div>
        </div>
      ) : socialLinks.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-[#faf9f6] px-6 py-14 text-center dark:border-[#303841] dark:bg-[#181d23]">
          <Share2 className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-[#4b5560]" />

          <p className="text-sm font-medium text-slate-800 dark:text-[#f4f5f6]">
            No social links found
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
            Add a social profile or contact link to
            your portfolio.
          </p>
        </div>
      ) : (
        <div className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          {/* Table header */}
          <div className="hidden grid-cols-[52px_minmax(0,1fr)_220px_160px] items-center border-b border-slate-200 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995] sm:grid">
            <span>Order</span>
            <span>Platform</span>
            <span>Status</span>
            <span className="text-right">
              Actions
            </span>
          </div>

          {socialLinks
            .slice()
            .sort(
              (a, b) =>
                a.sortOrder - b.sortOrder
            )
            .map((link, index) => (
              <div
                key={link.id}
                className="border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-[#303841]"
              >
                <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[52px_minmax(0,1fr)_220px_160px] sm:items-center sm:gap-5">
                  {/* Order */}
                  <div className="hidden sm:block">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#7f8995]">
                      {String(
                        index + 1
                      ).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Platform */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d6a83a]/30 bg-[#d6a83a]/5 text-[#a47d18] dark:border-[#d6a83a]/25 dark:bg-[#d6a83a]/5 dark:text-[#d6a83a]">
                      {getPlatformIcon(
                        link.icon,
                        link.platform
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="truncate text-xs font-semibold text-slate-900 dark:text-[#f4f5f6]">
                          {link.platform}
                        </h3>

                        {link.username && (
                          <span className="truncate text-[10px] text-[#a47d18] dark:text-[#d6a83a]">
                            @{link.username}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 truncate font-mono text-[9px] text-slate-400 dark:text-[#7f8995]">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {link.isVisible ? (
                        <>
                          <Eye className="h-3.5 w-3.5 text-slate-400 dark:text-[#7f8995]" />

                          <span className="text-[10px] text-slate-600 dark:text-[#aeb6c0]">
                            Visible
                          </span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-slate-400 dark:text-[#7f8995]" />

                          <span className="text-[10px] text-slate-400 dark:text-[#7f8995]">
                            Hidden
                          </span>
                        </>
                      )}
                    </div>

                    <span className="hidden text-[10px] text-slate-300 dark:text-[#303841] md:inline">
                      |
                    </span>

                    <span className="hidden font-mono text-[9px] text-slate-400 dark:text-[#7f8995] md:inline">
                      Order {link.sortOrder}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-start gap-2 sm:justify-end">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                      title="Open Link"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Open
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(link)
                      }
                      className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                      title="Edit Link"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget(link)
                      }
                      className="inline-flex items-center justify-center border border-red-500/20 px-2.5 py-1.5 text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/5"
                      title="Delete Link"
                      aria-label={`Delete ${link.platform}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Mobile order */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2.5 sm:hidden dark:border-[#303841]">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-slate-400 dark:text-[#7f8995]">
                    Order {link.sortOrder}
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.1em] text-slate-400 dark:text-[#7f8995]">
                    {link.isVisible
                      ? 'Published'
                      : 'Hidden'}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative my-6 w-full max-w-lg border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-[#d6a83a]" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a47d18] dark:text-[#d6a83a]">
                    {editingLink
                      ? 'Edit Social Link'
                      : 'New Social Link'}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                  {editingLink
                    ? editingLink.platform
                    : 'Add Social Link'}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
                  Manage the profile or contact link
                  displayed on the portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsFormModalOpen(false)
                }
                className="text-slate-400 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="max-h-[75vh] overflow-y-auto"
            >
              {/* Link Information */}
              <div className="border-b border-slate-200 dark:border-[#303841]">
                <div className="px-5 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                    Link Information
                  </h4>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                    Define the platform and destination.
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-[#303841]">
                  <div className="p-5">
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                      Platform Name{' '}
                      <span className="text-[#d6a83a]">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          platform:
                            e.target.value,
                        })
                      }
                      placeholder="e.g. GitHub, LinkedIn, Email"
                      className={inputClass}
                    />
                  </div>

                  <div className="border-t border-slate-200 p-5 dark:border-[#303841]">
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                      Target URL{' '}
                      <span className="text-[#d6a83a]">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          url: e.target.value,
                        })
                      }
                      placeholder="https://... or mailto:..."
                      className={inputClass}
                    />

                    <p className="mt-1.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                      Enter the destination exactly as it
                      should be opened.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="border-t border-slate-200 p-5 dark:border-[#303841]">
                      <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        Username / Handle
                      </label>

                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            username:
                              e.target.value,
                          })
                        }
                        placeholder="e.g. CA170206"
                        className={inputClass}
                      />
                    </div>

                    <div className="border-t border-slate-200 p-5 dark:border-[#303841] sm:border-l">
                      <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        Icon Name
                      </label>

                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            icon: e.target.value,
                          })
                        }
                        placeholder="github, linkedin, mail"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Publishing */}
              <div className="border-b border-slate-200 dark:border-[#303841]">
                <div className="px-5 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                    Publishing
                  </h4>

                  <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                    Control visibility and ordering.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Visibility */}
                  <label className="flex cursor-pointer items-start gap-3 border-t border-slate-200 p-5 dark:border-[#303841]">
                    <input
                      type="checkbox"
                      checked={formData.isVisible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isVisible:
                            e.target.checked,
                        })
                      }
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 bg-white text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
                    />

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        {formData.isVisible ? (
                          <Eye className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />
                        ) : (
                          <EyeOff className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />
                        )}

                        Visible on Portfolio
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                        Hidden links remain available in
                        the CMS.
                      </p>
                    </div>
                  </label>

                  {/* Sort */}
                  <div className="border-t border-slate-200 p-5 dark:border-[#303841]">
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sortOrder:
                            Number(
                              e.target.value
                            ),
                        })
                      }
                      className={inputClass}
                    />

                    <p className="mt-1.5 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                      Lower numbers appear first.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setIsFormModalOpen(false)
                  }
                  className="border border-slate-300 bg-transparent px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:bg-[#12161b] dark:hover:text-[#f4f5f6]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-5 py-2 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}

                  {isSaving
                    ? 'Saving'
                    : editingLink
                      ? 'Update Link'
                      : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Social Link"
        itemName={
          deleteTarget?.platform || ''
        }
        itemType="social link"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() =>
          setDeleteTarget(null)
        }
      />
    </div>
  );
};

export default SocialLinksManager;