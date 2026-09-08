import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  FileCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  ExternalLink,
} from 'lucide-react';
import apiClient from '../api/client';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { isValidAssetUrlOrPath } from '../utils/assetValidation';
import { resolveAsset } from '../../api/publicPortfolioApi';

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  employmentType: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  description: string[];
  technologies: string[];
  offerLetterUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
}

export const ExperienceManager: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    employmentType: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: '',
    technologies: '',
    offerLetterUrl: '',
    sortOrder: 0,
    isVisible: true,
  });

  const [deleteTarget, setDeleteTarget] =
    useState<ExperienceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchExperiences = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get<ExperienceItem[]>('/experience');

      if (res.success && res.data) {
        setExperiences(res.data);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to load experience records.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error while loading experience records.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);

    setFormData({
      company: '',
      position: '',
      employmentType: '',
      location: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
      technologies: '',
      offerLetterUrl: '',
      sortOrder: experiences.length + 1,
      isVisible: true,
    });

    setIsFormModalOpen(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp);

    setFormData({
      company: exp.company,
      position: exp.position,
      employmentType: exp.employmentType || '',
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      currentlyWorking: exp.currentlyWorking,
      description: exp.description ? exp.description.join('\n') : '',
      technologies: exp.technologies
        ? exp.technologies.join(', ')
        : '',
      offerLetterUrl: exp.offerLetterUrl || '',
      sortOrder: exp.sortOrder,
      isVisible: exp.isVisible,
    });

    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Company name is required.',
      });
      return;
    }

    if (!formData.position.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Position / Role title is required.',
      });
      return;
    }

    if (!formData.startDate.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Start date is required.',
      });
      return;
    }

    if (
      formData.offerLetterUrl.trim() &&
      !isValidAssetUrlOrPath(formData.offerLetterUrl)
    ) {
      setStatusMessage({
        type: 'error',
        text: 'Offer Letter Media URL must be a valid external URL (http/https) or local asset path (/src/assets/... or /assets/...).',
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const descArray = formData.description
      .split('\n')
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      company: formData.company.trim(),
      position: formData.position.trim(),
      employmentType:
        formData.employmentType.trim() || null,
      location: formData.location.trim() || null,
      startDate: formData.startDate.trim(),
      endDate: formData.currentlyWorking
        ? null
        : formData.endDate.trim() || null,
      currentlyWorking: formData.currentlyWorking,
      description: descArray,
      technologies: techArray,
      offerLetterUrl:
        formData.offerLetterUrl.trim() || null,
      sortOrder: Number(formData.sortOrder) || 0,
      isVisible: formData.isVisible,
    };

    try {
      let res;

      if (editingExp) {
        res = await apiClient.put(
          `/experience/${editingExp.id}`,
          payload
        );
      } else {
        res = await apiClient.post('/experience', payload);
      }

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: editingExp
            ? `Experience at "${formData.company}" updated successfully.`
            : `Experience at "${formData.company}" added successfully.`,
        });

        setIsFormModalOpen(false);
        await fetchExperiences();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to save experience.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error occurred while saving experience.',
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
        `/experience/${deleteTarget.id}`
      );

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Experience "${deleteTarget.company}" deleted successfully.`,
        });

        setDeleteTarget(null);
        await fetchExperiences();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to delete experience.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error deleting experience.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Subtle technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.02] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative z-10 space-y-7">
        {/* Header */}
        <header className="border-b border-slate-200 pb-6 dark:border-[#303841]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[#d6a83a]">
                <Briefcase
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Content / Experience
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                Experience
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#aeb6c0]">
                Manage work history, responsibilities, technologies and
                supporting documents displayed on your portfolio.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/40"
            >
              <Plus
                className="h-4 w-4"
                strokeWidth={1.8}
              />
              Add Experience
            </button>
          </div>
        </header>

        {/* Status */}
        {statusMessage && (
          <div
            className={`flex items-start gap-3 border px-4 py-3 text-xs ${statusMessage.type === 'success'
                ? 'border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300'
                : 'border-red-500/25 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300'
              }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}

            <span className="flex-1 font-medium">
              {statusMessage.text}
            </span>

            <button
              onClick={() => setStatusMessage(null)}
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-700 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Section heading */}
        <div className="flex items-end justify-between border-b border-slate-200 pb-3 dark:border-[#303841]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d6a83a]">
              Work history
            </p>

            <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
              {isLoading
                ? 'Experience'
                : `${experiences.length} ${experiences.length === 1
                  ? 'experience record'
                  : 'experience records'
                }`}
            </h2>
          </div>

          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-slate-400 dark:text-[#7f8995] sm:block">
            Edit / Delete
          </span>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex min-h-[35vh] items-center justify-center border border-slate-200 bg-white dark:border-[#303841] dark:bg-[#181d23]">
            <div className="flex items-center gap-3 text-slate-500 dark:text-[#7f8995]">
              <Loader2 className="h-4 w-4 animate-spin text-[#d6a83a]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.16em]">
                Loading experience
              </span>
            </div>
          </div>
        ) : experiences.length === 0 ? (
          /* Empty state */
          <div className="flex min-h-[30vh] flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 text-center dark:border-[#303841] dark:bg-[#181d23]">
            <Briefcase
              className="mb-4 h-8 w-8 text-slate-400 dark:text-[#7f8995]"
              strokeWidth={1.4}
            />

            <p className="text-sm font-medium text-slate-800 dark:text-[#f4f5f6]">
              No experience records yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
              Add a work experience record to display it in the Experience
              section of your portfolio.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Experience
            </button>
          </div>
        ) : (
          /* Experience list */
          <div className="overflow-hidden border border-slate-200 bg-white dark:border-[#303841] dark:bg-[#181d23]">
            {experiences.map((exp, index) => (
              <article
                key={exp.id}
                className={`group ${index !== experiences.length - 1
                    ? 'border-b border-slate-200 dark:border-[#303841]'
                    : ''
                  }`}
              >
                <div className="p-5">
                  {/* Main row */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                          {exp.position}
                        </h3>

                        <span className="text-xs font-medium text-[#a47d18] dark:text-[#d6a83a]">
                          @ {exp.company}
                        </span>

                        {exp.currentlyWorking && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Current role
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium ${exp.isVisible
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400 dark:text-[#7f8995]'
                            }`}
                        >
                          {exp.isVisible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}

                          {exp.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-[#7f8995]">
                        {exp.employmentType && (
                          <>
                            <span>{exp.employmentType}</span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}

                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />

                          {exp.startDate} –{' '}
                          {exp.currentlyWorking
                            ? 'Present'
                            : exp.endDate || 'N/A'}
                        </span>

                        {exp.location && (
                          <>
                            <span aria-hidden="true">·</span>

                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />
                              {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 dark:border-[#303841]">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="inline-flex items-center gap-1.5 border border-slate-200 px-2.5 py-2 text-[11px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="inline-flex items-center gap-1.5 border border-red-500/20 px-2.5 py-2 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  {exp.description &&
                    exp.description.length > 0 && (
                      <div className="mt-5 border-l border-[#d6a83a]/50 pl-4">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-[#7f8995]">
                          Responsibilities
                        </p>

                        <ul className="space-y-1.5">
                          {exp.description.map((item, idx) => (
                            <li
                              key={idx}
                              className="relative pl-3 text-xs leading-5 text-slate-600 before:absolute before:left-0 before:top-[8px] before:h-1 before:w-1 before:rounded-full before:bg-[#d6a83a] dark:text-[#aeb6c0]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Technologies / document */}
                  {(exp.technologies?.length > 0 ||
                    exp.offerLetterUrl) && (
                      <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between dark:border-[#303841]">
                        {exp.technologies?.length > 0 ? (
                          <div className="min-w-0">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-[#7f8995]">
                              Technologies
                            </p>

                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {exp.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] text-slate-500 before:mr-1.5 before:text-[#d6a83a] before:content-['•'] dark:text-[#7f8995]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}

                        <div className="flex shrink-0 items-center gap-4">
                          {exp.offerLetterUrl && (
                            <a
                              href={resolveAsset(exp.offerLetterUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#a47d18] transition-colors hover:text-slate-900 hover:underline dark:text-[#d6a83a] dark:hover:text-[#e2b94f]"
                            >
                              <FileCheck className="h-3.5 w-3.5" />
                              Offer Letter
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          )}

                          <span className="text-[10px] font-mono text-slate-400 dark:text-[#7f8995]">
                            Order {exp.sortOrder}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isFormModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col border border-slate-200 bg-white shadow-2xl dark:border-[#303841] dark:bg-[#181d23]">
            {/* Modal header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d6a83a]">
                  {editingExp ? 'Edit record' : 'New record'}
                </p>

                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                  {editingExp
                    ? `Edit Experience at "${editingExp.company}"`
                    : 'Add Work Experience'}
                </h3>
              </div>

              <button
                onClick={() => setIsFormModalOpen(false)}
                className="border border-slate-200 p-1.5 text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-800 dark:border-[#303841] dark:text-[#7f8995] dark:hover:border-[#4b5560] dark:hover:text-[#f4f5f6]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSave}
              className="min-h-0 overflow-y-auto px-5 py-5"
            >
              <div className="space-y-5">
                {/* Role */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Role information
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Company Name{' '}
                          <span className="text-[#d6a83a]">*</span>
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                          placeholder="e.g. Labmentix"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Position / Role Title{' '}
                          <span className="text-[#d6a83a]">*</span>
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.position}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              position: e.target.value,
                            })
                          }
                          placeholder="e.g. Web Development Intern"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Employment Type
                        </label>

                        <input
                          type="text"
                          value={formData.employmentType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              employmentType: e.target.value,
                            })
                          }
                          placeholder="e.g. Remote Internship, Full-time"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Location
                        </label>

                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          placeholder="e.g. Remote or Pune, India"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Start Date{' '}
                          <span className="text-[#d6a83a]">*</span>
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          placeholder="e.g. August 2026"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          End Date
                        </label>

                        <input
                          type="text"
                          disabled={formData.currentlyWorking}
                          value={
                            formData.currentlyWorking
                              ? 'Present'
                              : formData.endDate
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          placeholder="e.g. February 2027"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 text-xs text-slate-700 dark:text-[#aeb6c0]">
                      <input
                        id="currentlyWorking"
                        type="checkbox"
                        checked={formData.currentlyWorking}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentlyWorking: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded-none border-slate-300 bg-white text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
                      />

                      <span>
                        <span className="block font-medium text-slate-800 dark:text-[#f4f5f6]">
                          I currently work in this role
                        </span>

                        <span className="mt-0.5 block text-[10px] text-slate-400 dark:text-[#7f8995]">
                          The portfolio will display this role as ongoing.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Supporting document */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Supporting document
                  </p>

                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                    Offer Letter / Verification Media
                  </label>

                  <input
                    type="text"
                    value={formData.offerLetterUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offerLetterUrl: e.target.value,
                      })
                    }
                    placeholder="/src/assets/experience/offer-letter.png or https://..."
                    className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                  />

                  {formData.offerLetterUrl && (
                    <div className="mt-3">
                      <a
                        href={resolveAsset(formData.offerLetterUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#a47d18] hover:text-slate-900 hover:underline dark:text-[#d6a83a] dark:hover:text-[#e2b94f]"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Preview Offer Letter
                      </a>
                    </div>
                  )}
                </div>

                {/* Responsibilities */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Responsibilities & technologies
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        Technologies Used
                      </label>

                      <input
                        type="text"
                        value={formData.technologies}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            technologies: e.target.value,
                          })
                        }
                        placeholder="React, JavaScript, Node.js, Express, PostgreSQL"
                        className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                      />

                      <p className="mt-1.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                        Separate technologies with commas.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        Key Responsibilities & Contributions
                      </label>

                      <textarea
                        rows={6}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder={`Contributing to production web apps using React and TypeScript...
Collaborating in agile sprints and daily standups...
Developing and testing RESTful APIs...`}
                        className="w-full resize-y border border-slate-300 bg-white p-3 text-xs leading-5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                      />

                      <p className="mt-1.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                        Enter one responsibility per line.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Publishing */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Publishing
                  </p>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex cursor-pointer items-center gap-3 text-xs text-slate-700 dark:text-[#aeb6c0]">
                      <input
                        type="checkbox"
                        checked={formData.isVisible}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isVisible: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded-none border-slate-300 bg-white text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
                      />

                      <span>
                        <span className="block font-medium text-slate-800 dark:text-[#f4f5f6]">
                          Visible on portfolio
                        </span>

                        <span className="mt-0.5 block text-[10px] text-slate-400 dark:text-[#7f8995]">
                          Control whether visitors can see this experience
                          record.
                        </span>
                      </span>
                    </label>

                    <div className="flex items-center gap-3">
                      <label className="text-[10px] uppercase tracking-[0.12em] text-slate-400 dark:text-[#7f8995]">
                        Sort order
                      </label>

                      <input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sortOrder: Number(e.target.value),
                          })
                        }
                        className="w-20 border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4 dark:border-[#303841]">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="border border-slate-300 px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#4b5560] dark:hover:text-[#f4f5f6]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}

                  {isSaving
                    ? 'Saving...'
                    : editingExp
                      ? 'Update Experience'
                      : 'Add Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Experience Record"
        itemName={
          deleteTarget
            ? `${deleteTarget.position} @ ${deleteTarget.company}`
            : ''
        }
        itemType="experience"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ExperienceManager;