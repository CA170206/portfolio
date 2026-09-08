import React, { useEffect, useState } from 'react';
import {
  Code2,
  Plus,
  Edit2,
  Trash2,
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import apiClient from '../api/client';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';

type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOLS';

interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  highlight: boolean;
  sortOrder: number;
  isVisible: boolean;
}

const CATEGORY_LABELS: Record<
  SkillCategory,
  { label: string; desc: string }
> = {
  FRONTEND: {
    label: 'Frontend Development',
    desc: 'User interfaces, responsive layouts, and interactive components',
  },
  BACKEND: {
    label: 'Backend Development',
    desc: 'APIs, server logic, authentication, and backend services',
  },
  DATABASE: {
    label: 'Database Systems',
    desc: 'Relational data modeling, schema design, and query optimization',
  },
  TOOLS: {
    label: 'Tools & DevOps',
    desc: 'Version control, developer tooling, and deployment workflows',
  },
};

const CATEGORIES: SkillCategory[] = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'TOOLS',
];

const inputClass =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] =
    useState<boolean>(false);
  const [editingSkill, setEditingSkill] =
    useState<SkillItem | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'FRONTEND' as SkillCategory,
    highlight: false,
    sortOrder: 0,
    isVisible: true,
  });

  const [deleteTarget, setDeleteTarget] =
    useState<SkillItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchSkills = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get<SkillItem[]>('/skills');

      if (res.success && res.data) {
        setSkills(res.data);
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to load skills.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error while loading skills.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = (category?: SkillCategory) => {
    const selectedCategory = category || 'FRONTEND';

    setEditingSkill(null);

    setFormData({
      name: '',
      category: selectedCategory,
      highlight: false,
      sortOrder:
        skills.filter(
          (skill) => skill.category === selectedCategory
        ).length + 1,
      isVisible: true,
    });

    setIsFormModalOpen(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);

    setFormData({
      name: skill.name,
      category: skill.category,
      highlight: skill.highlight,
      sortOrder: skill.sortOrder,
      isVisible: skill.isVisible,
    });

    setIsFormModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Skill name is required.',
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      highlight: formData.highlight,
      sortOrder: Number(formData.sortOrder) || 0,
      isVisible: formData.isVisible,
    };

    try {
      let res;

      if (editingSkill) {
        res = await apiClient.put(
          `/skills/${editingSkill.id}`,
          payload
        );
      } else {
        res = await apiClient.post('/skills', payload);
      }

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: editingSkill
            ? `Skill "${formData.name}" updated successfully.`
            : `Skill "${formData.name}" added successfully.`,
        });

        setIsFormModalOpen(false);
        await fetchSkills();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to save skill.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Network error occurred while saving skill.',
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
        `/skills/${deleteTarget.id}`
      );

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Skill "${deleteTarget.name}" deleted successfully.`,
        });

        setDeleteTarget(null);
        await fetchSkills();
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to delete skill.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error deleting skill.',
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
              Skills
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Skills Management
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
            Manage the technical skills displayed across your
            portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAddModal()}
          className="inline-flex items-center justify-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/30"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Skill
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
            onClick={() => setStatusMessage(null)}
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
              Loading skills
            </p>
          </div>
        </div>
      ) : skills.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-[#faf9f6] px-6 py-14 text-center dark:border-[#303841] dark:bg-[#181d23]">
          <Code2 className="mx-auto mb-3 h-8 w-8 text-slate-300 dark:text-[#4b5560]" />

          <p className="text-sm font-medium text-slate-800 dark:text-[#f4f5f6]">
            No skills found
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
            Add a skill to begin building your technical stack.
          </p>
        </div>
      ) : (
        /* Categories */
        <div className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          {CATEGORIES.map((category, categoryIndex) => {
            const categorySkills = skills
              .filter((skill) => skill.category === category)
              .sort(
                (a, b) =>
                  a.sortOrder - b.sortOrder
              );

            const categoryInfo =
              CATEGORY_LABELS[category];

            return (
              <section
                key={category}
                className={
                  categoryIndex !== CATEGORIES.length - 1
                    ? 'border-b border-slate-200 dark:border-[#303841]'
                    : ''
                }
              >
                {/* Category header */}
                <div className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Layers className="h-4 w-4 text-[#d6a83a]" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                          {categoryInfo.label}
                        </h2>

                        <span className="font-mono text-[10px] text-slate-400 dark:text-[#7f8995]">
                          {String(
                            categorySkills.length
                          ).padStart(2, '0')}
                        </span>
                      </div>

                      <p className="mt-1 max-w-xl text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                        {categoryInfo.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openAddModal(category)
                    }
                    className="inline-flex items-center justify-center gap-1.5 border border-slate-300 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                  >
                    <Plus className="h-3 w-3" />
                    Add Skill
                  </button>
                </div>

                {/* Category list */}
                {categorySkills.length === 0 ? (
                  <div className="border-t border-slate-200 px-5 py-7 dark:border-[#303841]">
                    <p className="text-center text-[10px] uppercase tracking-[0.12em] text-slate-400 dark:text-[#7f8995]">
                      No skills in this category
                    </p>
                  </div>
                ) : (
                  <div className="border-t border-slate-200 dark:border-[#303841]">
                    {/* Column labels */}
                    <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px_90px] border-b border-slate-200 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995] sm:grid">
                      <span>Skill</span>
                      <span>Status</span>
                      <span>Highlight</span>
                      <span className="text-right">
                        Actions
                      </span>
                    </div>

                    {categorySkills.map(
                      (skill, index) => (
                        <div
                          key={skill.id}
                          className="border-b border-slate-200 px-5 py-3.5 last:border-b-0 dark:border-[#303841]"
                        >
                          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_110px_110px_90px] sm:items-center sm:gap-4">
                            {/* Name */}
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="hidden w-5 shrink-0 font-mono text-[9px] text-slate-400 dark:text-[#7f8995] sm:block">
                                {String(
                                  index + 1
                                ).padStart(2, '0')}
                              </span>

                              <span
                                className={`h-1.5 w-1.5 shrink-0 ${skill.highlight
                                    ? 'bg-[#d6a83a]'
                                    : 'bg-slate-300 dark:bg-[#4b5560]'
                                  }`}
                              />

                              <span className="truncate text-xs font-medium text-slate-800 dark:text-[#f4f5f6]">
                                {skill.name}
                              </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                              {skill.isVisible ? (
                                <>
                                  <Eye className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />

                                  <span className="text-[10px] text-slate-500 dark:text-[#aeb6c0]">
                                    Visible
                                  </span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 text-slate-400 dark:text-[#7f8995]" />

                                  <span className="text-[10px] text-slate-400 dark:text-[#7f8995]">
                                    Hidden
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Highlight */}
                            <div>
                              {skill.highlight ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#a47d18] dark:text-[#d6a83a]">
                                  <Star className="h-3 w-3 fill-current" />
                                  Highlighted
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 dark:text-[#7f8995]">
                                  Standard
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-start gap-1 sm:justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    skill
                                  )
                                }
                                className="inline-flex items-center gap-1.5 border border-slate-300 px-2.5 py-1.5 text-[10px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                                title="Edit Skill"
                              >
                                <Edit2 className="h-3 w-3" />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget(
                                    skill
                                  )
                                }
                                className="inline-flex items-center justify-center border border-red-500/20 px-2.5 py-1.5 text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/5"
                                title="Delete Skill"
                                aria-label={`Delete ${skill.name}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>
            );
          })}
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
                    {editingSkill
                      ? 'Edit Skill'
                      : 'New Skill'}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                  {editingSkill
                    ? editingSkill.name
                    : 'Add Technical Skill'}
                </h3>

                <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
                  Update the skill information used by
                  the portfolio.
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
              {/* Skill information */}
              <div className="border-b border-slate-200 dark:border-[#303841]">
                <div className="px-5 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                    Skill Information
                  </h4>

                  <p className="mt-1 text-[10px] text-slate-400 dark:text-[#7f8995]">
                    Define the skill name and category.
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-[#303841]">
                  <div className="p-5">
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                      Skill Name{' '}
                      <span className="text-[#d6a83a]">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g. React, PostgreSQL, Git"
                      className={inputClass}
                    />
                  </div>

                  <div className="border-t border-slate-200 p-5 dark:border-[#303841]">
                    <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                      Category{' '}
                      <span className="text-[#d6a83a]">
                        *
                      </span>
                    </label>

                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category:
                            e.target.value as SkillCategory,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="FRONTEND">
                        Frontend Development
                      </option>

                      <option value="BACKEND">
                        Backend Development
                      </option>

                      <option value="DATABASE">
                        Database Systems
                      </option>

                      <option value="TOOLS">
                        Tools & DevOps
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Publishing */}
              <div className="border-b border-slate-200 dark:border-[#303841]">
                <div className="px-5 py-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                    Publishing
                  </h4>

                  <p className="mt-1 text-[10px] text-slate-400 dark:text-[#7f8995]">
                    Control how the skill is prioritized and
                    displayed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Highlight */}
                  <label className="flex cursor-pointer items-start gap-3 border-t border-slate-200 p-5 dark:border-[#303841]">
                    <input
                      type="checkbox"
                      checked={formData.highlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          highlight:
                            e.target.checked,
                        })
                      }
                      className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 bg-white text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
                    />

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                        <Star className="h-3 w-3 text-[#d6a83a]" />
                        Highlight Skill
                      </div>

                      <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                        Gives this skill visual emphasis.
                      </p>
                    </div>
                  </label>

                  {/* Visible */}
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
                        Hidden skills remain available in the
                        CMS.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Sort order */}
                <div className="border-t border-slate-200 p-5 dark:border-[#303841]">
                  <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
                    Sort Order
                  </label>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sortOrder: Number(
                            e.target.value
                          ),
                        })
                      }
                      className="w-28 border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:focus:border-[#d6a83a]"
                    />

                    <p className="text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
                      Lower numbers appear first within the
                      category.
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
                    : editingSkill
                      ? 'Update Skill'
                      : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Skill"
        itemName={deleteTarget?.name || ''}
        itemType="skill"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default SkillsManager;