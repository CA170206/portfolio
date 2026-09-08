import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Award,
  FileImage,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';
import apiClient from '../api/client';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { isValidAssetUrlOrPath } from '../utils/assetValidation';
import { resolveAsset } from '../../api/publicPortfolioApi';

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  grade: string | null;
  gradeLabel: string | null;
  resultLabel: string | null;
  resultTitle: string | null;
  resultImageUrl: string | null;
  description: string | null;
  coursework: string[];
  sortOrder: number;
  isVisible: boolean;
}

export const EducationManager: React.FC = () => {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
    gradeLabel: 'CGPA',
    resultTitle: '',
    resultLabel: '',
    resultImageUrl: '',
    description: '',
    coursework: '',
    sortOrder: 0,
    isVisible: true,
  });

  const [deleteTarget, setDeleteTarget] = useState<EducationItem | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchEducations = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get<EducationItem[]>('/education');

      if (res.success && res.data) {
        setEducations(res.data);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to load education records.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error while loading education records.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const openAddModal = () => {
    setEditingEdu(null);

    setFormData({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      grade: '',
      gradeLabel: 'CGPA',
      resultTitle: '',
      resultLabel: '',
      resultImageUrl: '',
      description: '',
      coursework: '',
      sortOrder: educations.length + 1,
      isVisible: true,
    });

    setIsFormModalOpen(true);
  };

  const openEditModal = (edu: EducationItem) => {
    setEditingEdu(edu);

    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      grade: edu.grade || '',
      gradeLabel: edu.gradeLabel || 'CGPA',
      resultTitle: edu.resultTitle || '',
      resultLabel: edu.resultLabel || '',
      resultImageUrl: edu.resultImageUrl || '',
      description: edu.description || '',
      coursework: edu.coursework ? edu.coursework.join('\n') : '',
      sortOrder: edu.sortOrder,
      isVisible: edu.isVisible,
    });

    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.institution.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Institution name is required.',
      });
      return;
    }

    if (!formData.degree.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Degree is required.',
      });
      return;
    }

    if (!formData.startDate.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Start year / date is required.',
      });
      return;
    }

    if (
      formData.resultImageUrl.trim() &&
      !isValidAssetUrlOrPath(formData.resultImageUrl)
    ) {
      setStatusMessage({
        type: 'error',
        text: 'Result Image URL must be a valid external URL (http/https) or local asset path (/src/assets/... or /assets/...).',
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const courseworkArray = formData.coursework
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const payload = {
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      fieldOfStudy: formData.fieldOfStudy.trim() || null,
      startDate: formData.startDate.trim(),
      endDate: formData.endDate.trim() || null,
      grade: formData.grade.trim() || null,
      gradeLabel: formData.gradeLabel.trim() || null,
      resultTitle: formData.resultTitle.trim() || null,
      resultLabel: formData.resultLabel.trim() || null,
      resultImageUrl: formData.resultImageUrl.trim() || null,
      description: formData.description.trim() || null,
      coursework: courseworkArray,
      sortOrder: Number(formData.sortOrder) || 0,
      isVisible: formData.isVisible,
    };

    try {
      let res;

      if (editingEdu) {
        res = await apiClient.put(
          `/education/${editingEdu.id}`,
          payload
        );
      } else {
        res = await apiClient.post('/education', payload);
      }

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: editingEdu
            ? `Education at "${formData.institution}" updated successfully.`
            : `Education at "${formData.institution}" added successfully.`,
        });

        setIsFormModalOpen(false);
        await fetchEducations();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to save education record.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error occurred while saving education.',
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
        `/education/${deleteTarget.id}`
      );

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Education record deleted successfully.',
        });

        setDeleteTarget(null);
        await fetchEducations();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to delete education record.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error deleting education record.',
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
                <GraduationCap
                  className="h-4 w-4"
                  strokeWidth={1.7}
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Content / Education
                </span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                Education
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-[#aeb6c0]">
                Manage the academic history, results and education details
                displayed on your portfolio.
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
              Add Education
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
              Academic records
            </p>

            <h2 className="mt-1 text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
              {isLoading
                ? 'Education'
                : `${educations.length} ${educations.length === 1
                  ? 'education record'
                  : 'education records'
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
                Loading education
              </span>
            </div>
          </div>
        ) : educations.length === 0 ? (
          /* Empty state */
          <div className="flex min-h-[30vh] flex-col items-center justify-center border border-dashed border-slate-300 bg-white px-6 text-center dark:border-[#303841] dark:bg-[#181d23]">
            <GraduationCap
              className="mb-4 h-8 w-8 text-slate-400 dark:text-[#7f8995]"
              strokeWidth={1.4}
            />

            <p className="text-sm font-medium text-slate-800 dark:text-[#f4f5f6]">
              No education records yet
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
              Add an academic record to display it in the Education section
              of your portfolio.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Education
            </button>
          </div>
        ) : (
          /* Education list */
          <div className="overflow-hidden border border-slate-200 bg-white dark:border-[#303841] dark:bg-[#181d23]">
            {educations.map((edu, index) => (
              <article
                key={edu.id}
                className={`group ${index !== educations.length - 1
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
                          {edu.degree}
                        </h3>

                        {edu.fieldOfStudy && (
                          <span className="text-xs text-slate-500 dark:text-[#7f8995]">
                            in {edu.fieldOfStudy}
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium ${edu.isVisible
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-400 dark:text-[#7f8995]'
                            }`}
                        >
                          {edu.isVisible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}

                          {edu.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-[#a47d18] dark:text-[#d6a83a]">
                        {edu.institution}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-500 dark:text-[#7f8995]">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />
                          {edu.startDate} – {edu.endDate || 'Present'}
                        </span>

                        {edu.grade && (
                          <>
                            <span aria-hidden="true">·</span>

                            <span>
                              {edu.gradeLabel || 'Grade'}:{' '}
                              <span className="font-medium text-slate-700 dark:text-[#aeb6c0]">
                                {edu.grade}
                              </span>
                            </span>
                          </>
                        )}

                        {edu.resultLabel && (
                          <>
                            <span aria-hidden="true">·</span>

                            <span className="inline-flex items-center gap-1 font-medium text-[#a47d18] dark:text-[#d6a83a]">
                              <Award className="h-3 w-3" />
                              {edu.resultLabel}
                            </span>
                          </>
                        )}
                      </div>

                      {edu.description && (
                        <p className="mt-3 max-w-3xl text-xs leading-5 text-slate-500 dark:text-[#aeb6c0]">
                          {edu.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0 dark:border-[#303841]">
                      <button
                        onClick={() => openEditModal(edu)}
                        className="inline-flex items-center gap-1.5 border border-slate-200 px-2.5 py-2 text-[11px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteTarget(edu)}
                        className="inline-flex items-center gap-1.5 border border-red-500/20 px-2.5 py-2 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/5"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Secondary information */}
                  {(edu.coursework?.length > 0 || edu.resultImageUrl) && (
                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-start sm:justify-between dark:border-[#303841]">
                      {edu.coursework?.length > 0 ? (
                        <div className="min-w-0">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-[#7f8995]">
                            Coursework
                          </p>

                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {edu.coursework.map((course, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] text-slate-500 before:mr-1.5 before:text-[#d6a83a] before:content-['•'] dark:text-[#7f8995]"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}

                      <div className="flex shrink-0 items-center gap-4">
                        {edu.resultImageUrl && (
                          <a
                            href={resolveAsset(edu.resultImageUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#a47d18] transition-colors hover:text-slate-900 hover:underline dark:text-[#d6a83a] dark:hover:text-[#e2b94f]"
                          >
                            <FileImage className="h-3.5 w-3.5" />
                            {edu.resultTitle || 'View Result'}
                          </a>
                        )}

                        <span className="text-[10px] font-mono text-slate-400 dark:text-[#7f8995]">
                          Order {edu.sortOrder}
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
                  {editingEdu ? 'Edit record' : 'New record'}
                </p>

                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                  {editingEdu ? 'Edit Education' : 'Add Education'}
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
                {/* Academic information */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Academic information
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        Institution Name{' '}
                        <span className="text-[#d6a83a]">*</span>
                      </label>

                      <input
                        type="text"
                        required
                        value={formData.institution}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            institution: e.target.value,
                          })
                        }
                        placeholder="e.g. Sandip University, Nashik"
                        className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Degree{' '}
                          <span className="text-[#d6a83a]">*</span>
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.degree}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              degree: e.target.value,
                            })
                          }
                          placeholder="e.g. Bachelor of Technology"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Field / Specialization
                        </label>

                        <input
                          type="text"
                          value={formData.fieldOfStudy}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fieldOfStudy: e.target.value,
                            })
                          }
                          placeholder="e.g. Computer Science & Engineering"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Start Year / Date{' '}
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
                          placeholder="e.g. 2023"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          End Year / Date
                        </label>

                        <input
                          type="text"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          placeholder="e.g. 2027 (Expected)"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Results & verification
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Result Highlight
                        </label>

                        <input
                          type="text"
                          value={formData.resultLabel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              resultLabel: e.target.value,
                            })
                          }
                          placeholder="e.g. Semester 6 · SGPA 8.45"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />

                        <p className="mt-1.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                          Use this for a semester-specific result or other
                          highlighted academic metric.
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Result Document Title
                        </label>

                        <input
                          type="text"
                          value={formData.resultTitle}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              resultTitle: e.target.value,
                            })
                          }
                          placeholder="e.g. B.Tech Result"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        Result Marksheet / Image
                      </label>

                      <input
                        type="text"
                        value={formData.resultImageUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resultImageUrl: e.target.value,
                          })
                        }
                        placeholder="/src/assets/education/btech-result.png or https://..."
                        className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                      />

                      {formData.resultImageUrl && (
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-12 w-20 overflow-hidden border border-slate-200 bg-slate-100 dark:border-[#303841] dark:bg-[#12161b]">
                            <img
                              src={resolveAsset(formData.resultImageUrl)}
                              alt="Result preview"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display =
                                  'none';
                              }}
                            />
                          </div>

                          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-[#7f8995]">
                            Preview
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Overall Grade / Score
                        </label>

                        <input
                          type="text"
                          value={formData.grade}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              grade: e.target.value,
                            })
                          }
                          placeholder="e.g. 8.5 or 85%"
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                          Grade Metric Type
                        </label>

                        <select
                          value={formData.gradeLabel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gradeLabel: e.target.value,
                            })
                          }
                          className="w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6]"
                        >
                          <option value="CGPA">CGPA</option>
                          <option value="Percentage">Percentage</option>
                          <option value="SGPA">SGPA</option>
                          <option value="Grade">Grade</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coursework */}
                <div>
                  <p className="mb-3 border-b border-slate-200 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995]">
                    Coursework
                  </p>

                  <textarea
                    rows={4}
                    value={formData.coursework}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coursework: e.target.value,
                      })
                    }
                    placeholder={`Data Structures & Algorithms
Database Management Systems (DBMS)
Software Engineering`}
                    className="w-full resize-y border border-slate-300 bg-white p-3 text-xs leading-5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                  />

                  <p className="mt-1.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                    Enter one subject per line.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                    Description / Achievements
                  </label>

                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Overview of academic focus and activities..."
                    className="w-full resize-y border border-slate-300 bg-white p-3 text-xs leading-5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560]"
                  />
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
                          Control whether visitors can see this education
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
                    : editingEdu
                      ? 'Update Education'
                      : 'Add Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Education Record"
        itemName={
          deleteTarget
            ? `${deleteTarget.degree} (${deleteTarget.institution})`
            : ''
        }
        itemType="education"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default EducationManager;