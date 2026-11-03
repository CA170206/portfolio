import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Image as ImageIcon,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Check,
  Upload,
  HardDrive,
  Link as LinkIcon,
  FolderOpen,
} from 'lucide-react';
import { GithubIcon } from '../../components/icons/SocialIcons';
import apiClient from '../api/client';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  isValidAssetUrlOrPath,
  isValidWebOrDocumentUrl,
} from '../utils/assetValidation';
import { resolveAsset } from '../../api/publicPortfolioApi';
import { fileToDataUrl, isImageFile } from '../utils/imageUpload';

interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProjectCaseStudy {
  id?: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
  architectureOverview: string;
  challenges: string[];
  learnings: string[];
  futureImprovements: string[];
}

interface ProjectTechnologyRel {
  technology: {
    id: string;
    name: string;
  };
}

interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
  images: ProjectImage[];
  technologies: ProjectTechnologyRel[];
  caseStudy?: ProjectCaseStudy | null;
}

interface FormData {
  title: string;
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
  technologies: string;
  enableCaseStudy: boolean;
  problem: string;
  solution: string;
  keyFeatures: string;
  architectureOverview: string;
  challenges: string;
  learnings: string;
  futureImprovements: string;
}

export const ProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [statusMessage, setStatusMessage] =
    useState<{
      type: 'success' | 'error';
      text: string;
    } | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] =
    useState<boolean>(false);

  const [editingProject, setEditingProject] =
    useState<ProjectItem | null>(null);

  const [isSaving, setIsSaving] =
    useState<boolean>(false);

  const [formData, setFormData] =
    useState<FormData>({
      title: '',
      tagline: '',
      shortDescription: '',
      detailedDescription: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      sortOrder: 0,
      isVisible: true,
      technologies: '',
      enableCaseStudy: false,
      problem: '',
      solution: '',
      keyFeatures: '',
      architectureOverview: '',
      challenges: '',
      learnings: '',
      futureImprovements: '',
    });

  const [imagesModalProject, setImagesModalProject] =
    useState<ProjectItem | null>(null);

  const [projectImages, setProjectImages] =
    useState<ProjectImage[]>([]);

  const [isLoadingImages, setIsLoadingImages] =
    useState<boolean>(false);

  const [newImageUrl, setNewImageUrl] =
    useState('');

  const [newImageAlt, setNewImageAlt] =
    useState('');

  const [newImageIsPrimary, setNewImageIsPrimary] =
    useState(false);

  const [newImageSortOrder, setNewImageSortOrder] =
    useState(0);

  const [isAddingImage, setIsAddingImage] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState<ProjectItem | null>(null);

  const [isDeleting, setIsDeleting] =
    useState<boolean>(false);

  // Image manager modal state
  const [imageInputMode, setImageInputMode] =
    useState<'device' | 'url'>('device');
  const [selectedFileMeta, setSelectedFileMeta] =
    useState<{ fileName: string; formattedSize: string } | null>(null);
  const [isProcessingFile, setIsProcessingFile] =
    useState<boolean>(false);
  const [imageDragActive, setImageDragActive] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form modal attached images state
  interface FormAttachedImage {
    id: string;
    imageUrl: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
    source: 'device' | 'url';
    fileName?: string;
    formattedSize?: string;
  }

  const [formImages, setFormImages] = useState<FormAttachedImage[]>([]);
  const [formImageMode, setFormImageMode] = useState<'device' | 'url'>('device');
  const [formUrlInput, setFormUrlInput] = useState('');
  const [formAltInput, setFormAltInput] = useState('');
  const [isFormImageProcessing, setIsFormImageProcessing] = useState(false);
  const [formDragActive, setFormDragActive] = useState(false);
  const formFileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceFile = async (file: File) => {
    if (!isImageFile(file)) {
      setStatusMessage({
        type: 'error',
        text: 'Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).',
      });
      return;
    }

    setIsProcessingFile(true);
    try {
      const processed = await fileToDataUrl(file);
      setNewImageUrl(processed.dataUrl);
      setSelectedFileMeta({
        fileName: processed.fileName,
        formattedSize: processed.formattedSize,
      });

      if (!newImageAlt.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setNewImageAlt(nameWithoutExt);
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to process image from device.',
      });
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleFormDeviceFiles = async (files: FileList | File[]) => {
    setIsFormImageProcessing(true);
    try {
      const list = Array.from(files);
      const newItems: FormAttachedImage[] = [];

      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        if (!isImageFile(file)) continue;

        const processed = await fileToDataUrl(file);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        newItems.push({
          id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          imageUrl: processed.dataUrl,
          altText: nameWithoutExt,
          isPrimary: false,
          sortOrder: formImages.length + newItems.length,
          source: 'device',
          fileName: processed.fileName,
          formattedSize: processed.formattedSize,
        });
      }

      if (newItems.length > 0) {
        setFormImages((prev) => {
          const combined = [...prev, ...newItems];
          if (!combined.some((img) => img.isPrimary)) {
            combined[0].isPrimary = true;
          }
          return combined;
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error processing selected device images.',
      });
    } finally {
      setIsFormImageProcessing(false);
    }
  };

  const handleAddFormUrlImage = () => {
    const trimmed = formUrlInput.trim();
    if (!trimmed) return;

    if (!isValidAssetUrlOrPath(trimmed)) {
      setStatusMessage({
        type: 'error',
        text: 'Image link must be a valid web URL or asset path.',
      });
      return;
    }

    const newItem: FormAttachedImage = {
      id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      imageUrl: trimmed,
      altText: formAltInput.trim(),
      isPrimary: formImages.length === 0,
      sortOrder: formImages.length,
      source: 'url',
    };

    setFormImages((prev) => [...prev, newItem]);
    setFormUrlInput('');
    setFormAltInput('');
  };

  const handleRemoveFormImage = (id: string) => {
    setFormImages((prev) => {
      const remaining = prev.filter((img) => img.id !== id);
      if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  };

  const handleToggleFormPrimary = (id: string) => {
    setFormImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const fetchProjects = async () => {
    setIsLoading(true);

    try {
      const res =
        await apiClient.get<ProjectItem[]>(
          '/projects'
        );

      if (res.success && res.data) {
        setProjects(res.data);
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'Failed to load projects.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text:
          'Network error while loading projects.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);

    setFormData({
      title: '',
      tagline: '',
      shortDescription: '',
      detailedDescription: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      sortOrder: projects.length + 1,
      isVisible: true,
      technologies: '',
      enableCaseStudy: false,
      problem: '',
      solution: '',
      keyFeatures: '',
      architectureOverview: '',
      challenges: '',
      learnings: '',
      futureImprovements: '',
    });

    setFormImages([]);
    setFormUrlInput('');
    setFormAltInput('');
    setFormImageMode('device');

    setIsFormModalOpen(true);
  };

  const openEditModal = (
    project: ProjectItem
  ) => {
    setEditingProject(project);

    const techNames = project.technologies
      ? project.technologies
        .map(
          (technology) =>
            technology.technology.name
        )
        .join(', ')
      : '';

    const caseStudy = project.caseStudy;

    setFormData({
      title: project.title,
      tagline: project.tagline || '',
      shortDescription:
        project.shortDescription || '',
      detailedDescription:
        project.detailedDescription || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured,
      sortOrder: project.sortOrder,
      isVisible: project.isVisible,
      technologies: techNames,
      enableCaseStudy: !!caseStudy,
      problem: caseStudy?.problem || '',
      solution: caseStudy?.solution || '',
      keyFeatures: caseStudy?.keyFeatures
        ? caseStudy.keyFeatures.join('\n')
        : '',
      architectureOverview:
        caseStudy?.architectureOverview || '',
      challenges: caseStudy?.challenges
        ? caseStudy.challenges.join('\n')
        : '',
      learnings: caseStudy?.learnings
        ? caseStudy.learnings.join('\n')
        : '',
      futureImprovements:
        caseStudy?.futureImprovements
          ? caseStudy.futureImprovements.join('\n')
          : '',
    });

    setFormImages(
      (project.images || []).map((img, idx) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        altText: img.altText || '',
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder ?? idx,
        source: img.imageUrl.startsWith('data:') ? 'device' : 'url',
      }))
    );
    setFormUrlInput('');
    setFormAltInput('');
    setFormImageMode('device');

    setIsFormModalOpen(true);
  };

  const handleSaveProject = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Project title is required.',
      });
      return;
    }

    if (!formData.shortDescription.trim()) {
      setStatusMessage({
        type: 'error',
        text:
          'Short description is required.',
      });
      return;
    }

    if (
      formData.liveUrl.trim() &&
      !isValidWebOrDocumentUrl(
        formData.liveUrl
      )
    ) {
      setStatusMessage({
        type: 'error',
        text:
          'Live Demo URL must be a valid URL or link.',
      });
      return;
    }

    if (
      formData.githubUrl.trim() &&
      !isValidWebOrDocumentUrl(
        formData.githubUrl
      )
    ) {
      setStatusMessage({
        type: 'error',
        text:
          'GitHub URL must be a valid URL or link.',
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const techArray =
      formData.technologies
        .split(',')
        .map((technology) =>
          technology.trim()
        )
        .filter(
          (technology) =>
            technology.length > 0
        );

    const parseLines = (text: string) =>
      text
        .split('\n')
        .map((line) => line.trim())
        .filter(
          (line) => line.length > 0
        );

    const payload: Record<
      string,
      unknown
    > = {
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      shortDescription:
        formData.shortDescription.trim(),
      detailedDescription:
        formData.detailedDescription.trim() ||
        formData.shortDescription.trim(),
      liveUrl:
        formData.liveUrl.trim() || null,
      githubUrl:
        formData.githubUrl.trim() || null,
      featured: formData.featured,
      sortOrder:
        Number(formData.sortOrder) || 0,
      isVisible: formData.isVisible,
      technologies: techArray,
    };

    if (
      formData.enableCaseStudy &&
      formData.problem.trim() &&
      formData.solution.trim()
    ) {
      payload.caseStudy = {
        problem: formData.problem.trim(),
        solution: formData.solution.trim(),
        keyFeatures: parseLines(
          formData.keyFeatures
        ),
        architectureOverview:
          formData.architectureOverview.trim(),
        challenges: parseLines(
          formData.challenges
        ),
        learnings: parseLines(
          formData.learnings
        ),
        futureImprovements:
          parseLines(
            formData.futureImprovements
          ),
      };
    } else if (
      !formData.enableCaseStudy
    ) {
      payload.caseStudy = null;
    }

    try {
      let res;

      if (editingProject) {
        res = await apiClient.put(
          `/projects/${editingProject.id}`,
          payload
        );
      } else {
        res = await apiClient.post(
          '/projects',
          payload
        );
      }

      if (res.success) {
        // Upload any attached images
        if (!editingProject && res.data && formImages.length > 0) {
          const createdProject = res.data as { id: string };
          for (let i = 0; i < formImages.length; i++) {
            const img = formImages[i];
            try {
              await apiClient.post(`/projects/${createdProject.id}/images`, {
                imageUrl: img.imageUrl,
                altText: img.altText || null,
                isPrimary: img.isPrimary,
                sortOrder: i,
              });
            } catch {
              // Ignore single image failure
            }
          }
        } else if (editingProject && formImages.length > 0) {
          const newImages = formImages.filter((img) => img.id.startsWith('temp-'));
          for (let i = 0; i < newImages.length; i++) {
            const img = newImages[i];
            try {
              await apiClient.post(`/projects/${editingProject.id}/images`, {
                imageUrl: img.imageUrl,
                altText: img.altText || null,
                isPrimary: img.isPrimary,
                sortOrder: img.sortOrder ?? i,
              });
            } catch {
              // Ignore single image failure
            }
          }
        }

        setStatusMessage({
          type: 'success',
          text: editingProject
            ? `Project "${formData.title}" updated successfully.`
            : `Project "${formData.title}" created successfully.`,
        });

        setIsFormModalOpen(false);
        await fetchProjects();
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'Failed to save project.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text:
          'Network error occurred while saving project.',
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
        `/projects/${deleteTarget.id}`
      );

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Project "${deleteTarget.title}" deleted successfully.`,
        });

        setDeleteTarget(null);
        await fetchProjects();
      } else {
        setStatusMessage({
          type: 'error',
          text:
            res.message ||
            'Failed to delete project.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error deleting project.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const openImagesModal = async (
    project: ProjectItem
  ) => {
    setImagesModalProject(project);
    setIsLoadingImages(true);

    setNewImageUrl('');
    setSelectedFileMeta(null);
    setImageInputMode('device');
    setIsProcessingFile(false);
    setImageDragActive(false);
    setNewImageAlt('');
    setNewImageIsPrimary(false);
    setNewImageSortOrder(0);

    try {
      const res =
        await apiClient.get<ProjectImage[]>(
          `/projects/${project.id}/images`
        );

      if (res.success && res.data) {
        setProjectImages(res.data);
      }
    } catch {
      // Keep modal usable even if image loading fails.
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleAddImage = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!imagesModalProject) {
      return;
    }

    if (!newImageUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text:
          imageInputMode === 'device'
            ? 'Please choose an image file from your device / file explorer.'
            : 'Please enter an image link or local path.',
      });
      return;
    }

    if (
      !isValidAssetUrlOrPath(
        newImageUrl.trim()
      )
    ) {
      setStatusMessage({
        type: 'error',
        text:
          'Image must be a valid file upload, web URL (http/https), or local asset path.',
      });
      return;
    }

    setIsAddingImage(true);

    try {
      const res =
        await apiClient.post<ProjectImage>(
          `/projects/${imagesModalProject.id}/images`,
          {
            imageUrl:
              newImageUrl.trim(),
            altText:
              newImageAlt.trim() ||
              null,
            isPrimary:
              newImageIsPrimary,
            sortOrder:
              Number(
                newImageSortOrder
              ) || 0,
          }
        );

      if (
        res.success &&
        res.data
      ) {
        setNewImageUrl('');
        setSelectedFileMeta(null);
        setNewImageAlt('');
        setNewImageIsPrimary(
          false
        );
        setNewImageSortOrder(0);

        const refreshed =
          await apiClient.get<
            ProjectImage[]
          >(
            `/projects/${imagesModalProject.id}/images`
          );

        if (refreshed.data) {
          setProjectImages(
            refreshed.data
          );
        }

        await fetchProjects();
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text:
          'Network error occurred while adding the image.',
      });
    } finally {
      setIsAddingImage(false);
    }
  };

  const handleDeleteImage = async (
    imageId: string
  ) => {
    if (!imagesModalProject) return;

    try {
      const res =
        await apiClient.delete(
          `/projects/${imagesModalProject.id}/images/${imageId}`
        );

      if (res.success) {
        setProjectImages(
          (previous) =>
            previous.filter(
              (image) =>
                image.id !== imageId
            )
        );

        await fetchProjects();
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text:
          'Error deleting project image.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-300 pb-5 dark:border-[#303841] sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#d6a83a]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47d18] dark:text-[#d6a83a]">
              Projects
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Project Management
          </h1>

          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
            Manage portfolio projects,
            technologies, case studies,
            visibility, and project imagery.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/30"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </button>
      </div>

      {/* Notification */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-start gap-3 border px-4 py-3 text-xs ${statusMessage.type ===
            'success'
            ? 'border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300'
            : 'border-red-500/25 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300'
            }`}
        >
          {statusMessage.type ===
            'success' ? (
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
              setStatusMessage(
                null
              )
            }
            className="text-slate-400 transition-colors hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Project List */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-[#7f8995]">
            <Loader2 className="h-6 w-6 animate-spin text-[#d6a83a]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
              Loading projects
            </p>
          </div>
        </div>
      ) : projects.length ===
        0 ? (
        <div className="border border-dashed border-slate-300 bg-[#faf9f6] px-6 py-14 text-center dark:border-[#303841] dark:bg-[#181d23]">
          <FolderKanban className="mx-auto mb-3 h-8 w-8 text-slate-400 dark:text-[#4b5560]" />

          <p className="text-sm font-medium text-slate-800 dark:text-[#f4f5f6]">
            No projects found
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
            Add a project to begin
            building your portfolio
            collection.
          </p>
        </div>
      ) : (
        <div className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          {/* List header */}
          <div className="hidden grid-cols-[48px_minmax(0,1fr)_190px] items-center border-b border-slate-200 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:border-[#303841] dark:text-[#7f8995] lg:grid">
            <span>Order</span>
            <span>Project</span>
            <span className="text-right">
              Actions
            </span>
          </div>

          {projects.map(
            (
              project,
              index
            ) => {
              const primaryImg =
                project.images.find(
                  (image) =>
                    image.isPrimary
                ) ||
                project.images[0];

              return (
                <div
                  key={project.id}
                  className="group border-b border-slate-200 last:border-b-0 dark:border-[#303841]"
                >
                  <div className="flex flex-col gap-4 px-5 py-5 lg:grid lg:grid-cols-[48px_minmax(0,1fr)_190px] lg:items-center lg:gap-5">
                    {/* Order */}
                    <div className="hidden lg:block">
                      <span className="font-mono text-[11px] text-slate-400 dark:text-[#7f8995]">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )}
                      </span>
                    </div>

                    {/* Project information */}
                    <div className="flex min-w-0 gap-4">
                      <div className="h-[150px] w-[295px] shrink-0 overflow-hidden border border-slate-300 bg-slate-100 dark:border-[#303841] dark:bg-[#12161b]">
                        {primaryImg ? (
                          <img
                            src={resolveAsset(
                              primaryImg.imageUrl
                            )}
                            alt={
                              project.title
                            }
                            className="h-full w-full object-cover"
                            onError={(
                              e
                            ) => {
                              (
                                e.target as HTMLElement
                              ).style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <FolderKanban className="h-7 w-7 text-slate-300 dark:text-[#303841]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                            {
                              project.title
                            }
                          </h3>

                          {project.featured && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a47d18] dark:text-[#d6a83a]">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              Featured
                            </span>
                          )}

                          <span className="text-[9px] uppercase tracking-[0.1em] text-slate-400 dark:text-[#7f8995]">
                            {project.isVisible
                              ? 'Visible'
                              : 'Hidden'}
                          </span>
                        </div>

                        {project.tagline && (
                          <p className="mt-1 text-[11px] font-medium text-[#a47d18] dark:text-[#d6a83a]">
                            {
                              project.tagline
                            }
                          </p>
                        )}

                        <p className="mt-1.5 line-clamp-2 max-w-3xl text-xs leading-5 text-slate-500 dark:text-[#aeb6c0]">
                          {
                            project.shortDescription
                          }
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400 dark:text-[#7f8995]">
                          {project.technologies?.map(
                            (
                              technology,
                              technologyIndex
                            ) => (
                              <React.Fragment
                                key={
                                  technology
                                    .technology
                                    .id
                                }
                              >
                                {technologyIndex >
                                  0 && (
                                    <span aria-hidden="true">
                                      ·
                                    </span>
                                  )}

                                <span className="text-slate-600 dark:text-[#aeb6c0]">
                                  {
                                    technology
                                      .technology
                                      .name
                                  }
                                </span>
                              </React.Fragment>
                            )
                          )}

                          {project.caseStudy && (
                            <>
                              {project
                                .technologies
                                ?.length >
                                0 && (
                                  <span aria-hidden="true">
                                    ·
                                  </span>
                                )}

                              <span className="inline-flex items-center gap-1 text-slate-600 dark:text-[#aeb6c0]">
                                <BookOpen className="h-2.5 w-2.5 text-[#d6a83a]" />
                                Case Study
                              </span>
                            </>
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-3">
                          {project.liveUrl && (
                            <a
                              href={
                                project.liveUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-slate-500 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
                              title="Live Demo"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Live Demo
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={
                                project.githubUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-slate-500 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
                              title="GitHub Repository"
                            >
                              <GithubIcon className="h-3 w-3" />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          openImagesModal(
                            project
                          )
                        }
                        className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                        title="Manage Project Images"
                      >
                        <ImageIcon className="h-3.5 w-3.5 text-[#d6a83a]" />
                        Images (
                        {
                          project
                            .images
                            .length
                        }
                        )
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            project
                          )
                        }
                        className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#aeb6c0] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                        title="Edit Project"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(
                            project
                          )
                        }
                        className="inline-flex items-center gap-1.5 border border-red-500/20 bg-transparent px-3 py-2 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/5"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Mobile metadata */}
                  <div className="flex items-center justify-between border-t border-slate-200 px-5 py-2.5 lg:hidden dark:border-[#303841]">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-slate-400 dark:text-[#7f8995]">
                      {project.isVisible ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Hidden
                        </>
                      )}
                    </div>

                    <span className="font-mono text-[9px] text-slate-400 dark:text-[#7f8995]">
                      Order{' '}
                      {
                        project.sortOrder
                      }
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {isFormModalOpen &&
        typeof document !==
        'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/85 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative my-6 w-full max-w-3xl border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#d6a83a]" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a47d18] dark:text-[#d6a83a]">
                      {editingProject
                        ? 'Edit Project'
                        : 'New Project'}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                    {editingProject
                      ? editingProject.title
                      : 'Add Portfolio Project'}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
                    Manage project information and presentation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsFormModalOpen(
                      false
                    )
                  }
                  className="text-slate-400 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={
                  handleSaveProject
                }
                className="max-h-[78vh] overflow-y-auto"
              >
                {/* Project Information */}
                <div className="border-b border-slate-200 dark:border-[#303841]">
                  <SectionHeader
                    title="Project Information"
                    description="Core project content displayed throughout the portfolio."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <ModalField
                      label="Project Title"
                      required
                    >
                      <input
                        type="text"
                        required
                        value={
                          formData.title
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            title: e.target
                              .value,
                          })
                        }
                        placeholder="e.g. TryQuizzers"
                        className={
                          modalInputClass
                        }
                      />
                    </ModalField>

                    <ModalField label="Tagline / Subtitle">
                      <input
                        type="text"
                        value={
                          formData.tagline
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tagline:
                              e.target.value,
                          })
                        }
                        placeholder="e.g. Full-Stack Assessment Platform"
                        className={
                          modalInputClass
                        }
                      />
                    </ModalField>

                    <div className="md:col-span-2">
                      <ModalField
                        label="Short Description"
                        required
                        description="Concise description used in project listings."
                      >
                        <textarea
                          rows={3}
                          required
                          value={
                            formData.shortDescription
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shortDescription:
                                e.target.value,
                            })
                          }
                          placeholder="Concise overview shown in cards and project previews..."
                          className={
                            modalTextareaClass
                          }
                        />
                      </ModalField>
                    </div>

                    <div className="md:col-span-2">
                      <ModalField
                        label="Detailed Description"
                        description="Optional longer description used in detailed project views."
                      >
                        <textarea
                          rows={4}
                          value={
                            formData.detailedDescription
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              detailedDescription:
                                e.target.value,
                            })
                          }
                          placeholder="In-depth project breakdown..."
                          className={
                            modalTextareaClass
                          }
                        />
                      </ModalField>
                    </div>

                    <ModalField
                      label="Live Demo URL"
                      optional
                    >
                      <input
                        type="text"
                        value={
                          formData.liveUrl
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            liveUrl:
                              e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className={
                          modalInputClass
                        }
                      />
                    </ModalField>

                    <ModalField
                      label="GitHub URL"
                      optional
                    >
                      <input
                        type="text"
                        value={
                          formData.githubUrl
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            githubUrl:
                              e.target.value,
                          })
                        }
                        placeholder="https://github.com/..."
                        className={
                          modalInputClass
                        }
                      />
                    </ModalField>

                    <div className="md:col-span-2">
                      <ModalField
                        label="Technologies"
                        description="Enter technologies separated by commas."
                      >
                        <input
                          type="text"
                          value={
                            formData.technologies
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              technologies:
                                e.target
                                  .value,
                            })
                          }
                          placeholder="React, Node.js, Express, PostgreSQL"
                          className={
                            modalInputClass
                          }
                        />
                      </ModalField>
                    </div>
                  </div>
                </div>

                {/* Project Images */}
                <div className="border-b border-slate-200 dark:border-[#303841]">
                  <SectionHeader
                    title="Project Images"
                    description="Upload screenshots or mockups from your device / file explorer or specify links."
                  />

                  <div className="p-5 space-y-4">
                    {/* Mode Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-[#303841]">
                      <button
                        type="button"
                        onClick={() => setFormImageMode('device')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                          formImageMode === 'device'
                            ? 'border-[#d6a83a] text-[#b48316] dark:text-[#d6a83a]'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]'
                        }`}
                      >
                        <HardDrive className="h-3.5 w-3.5" />
                        From Device / File Explorer
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormImageMode('url')}
                        className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                          formImageMode === 'url'
                            ? 'border-[#d6a83a] text-[#b48316] dark:text-[#d6a83a]'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]'
                        }`}
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        Image URL / Link
                      </button>
                    </div>

                    {formImageMode === 'device' ? (
                      <div>
                        <input
                          ref={formFileInputRef}
                          type="file"
                          multiple
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleFormDeviceFiles(e.target.files);
                              e.target.value = '';
                            }
                          }}
                        />

                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setFormDragActive(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setFormDragActive(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setFormDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                              handleFormDeviceFiles(e.dataTransfer.files);
                            }
                          }}
                          onClick={() => formFileInputRef.current?.click()}
                          className={`group relative cursor-pointer border-2 border-dashed p-6 text-center transition-all ${
                            formDragActive
                              ? 'border-[#d6a83a] bg-[#d6a83a]/5 dark:bg-[#d6a83a]/10'
                              : 'border-slate-300 bg-white hover:border-[#d6a83a]/70 hover:bg-slate-50 dark:border-[#303841] dark:bg-[#12161b] dark:hover:border-[#d6a83a]/60 dark:hover:bg-[#181d23]'
                          }`}
                        >
                          {isFormImageProcessing ? (
                            <div className="flex flex-col items-center justify-center py-2">
                              <Loader2 className="h-7 w-7 animate-spin text-[#d6a83a]" />
                              <p className="mt-2 text-xs text-slate-500 dark:text-[#8b949e]">
                                Processing selected images...
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-2">
                              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#d6a83a]/10 text-[#b48316] dark:text-[#d6a83a]">
                                <Upload className="h-5 w-5" />
                              </div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-[#f4f5f6]">
                                Click to select images from file explorer or drag & drop here
                              </p>
                              <p className="mt-1 text-[11px] text-slate-400 dark:text-[#7f8995]">
                                Multiple files supported (PNG, JPG, WEBP, GIF, SVG up to 10MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formUrlInput}
                            onChange={(e) => setFormUrlInput(e.target.value)}
                            placeholder="https://... or /src/assets/projects/..."
                            className={modalInputClass}
                          />
                          <button
                            type="button"
                            onClick={handleAddFormUrlImage}
                            disabled={!formUrlInput.trim()}
                            className="shrink-0 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2 text-xs font-semibold text-[#12161b] hover:bg-[#e2b94f] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Add Link
                          </button>
                        </div>
                        {formUrlInput.trim() && (
                          <input
                            type="text"
                            value={formAltInput}
                            onChange={(e) => setFormAltInput(e.target.value)}
                            placeholder="Alt text / description (optional)"
                            className={modalInputClass}
                          />
                        )}
                      </div>
                    )}

                    {/* Attached Images List */}
                    {formImages.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#7f8995]">
                          Attached Images ({formImages.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {formImages.map((img, idx) => (
                            <div
                              key={img.id}
                              className="flex items-center gap-3 border border-slate-300 bg-white p-2.5 dark:border-[#303841] dark:bg-[#12161b]"
                            >
                              <div className="h-14 w-20 shrink-0 overflow-hidden border border-slate-200 bg-slate-100 dark:border-[#303841] dark:bg-[#181d23]">
                                <img
                                  src={resolveAsset(img.imageUrl)}
                                  alt={img.altText || 'Project preview'}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-slate-800 dark:text-[#f4f5f6]">
                                  {img.fileName || img.altText || `Image ${idx + 1}`}
                                </p>
                                {img.formattedSize && (
                                  <p className="text-[10px] text-slate-400 dark:text-[#7f8995]">
                                    {img.formattedSize}
                                  </p>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleToggleFormPrimary(img.id)}
                                  className={`mt-1 inline-flex items-center gap-1 text-[10px] font-medium transition-colors ${
                                    img.isPrimary
                                      ? 'text-[#a47d18] dark:text-[#d6a83a]'
                                      : 'text-slate-400 hover:text-slate-700 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]'
                                  }`}
                                >
                                  <Star
                                    className={`h-3 w-3 ${
                                      img.isPrimary ? 'fill-current' : ''
                                    }`}
                                  />
                                  {img.isPrimary ? 'Primary Thumbnail' : 'Set as primary'}
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveFormImage(img.id)}
                                className="p-1 text-slate-400 hover:text-red-500 dark:text-[#7f8995] dark:hover:text-red-400"
                                title="Remove image"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publishing */}
                <div className="border-b border-slate-200 dark:border-[#303841]">
                  <SectionHeader
                    title="Publishing"
                    description="Control ordering, visibility, and featured status."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3">
                    <ToggleField
                      label="Featured Project"
                      checked={
                        formData.featured
                      }
                      onChange={(
                        checked
                      ) =>
                        setFormData({
                          ...formData,
                          featured:
                            checked,
                        })
                      }
                    />

                    <ToggleField
                      label="Visible on Portfolio"
                      checked={
                        formData.isVisible
                      }
                      onChange={(
                        checked
                      ) =>
                        setFormData({
                          ...formData,
                          isVisible:
                            checked,
                        })
                      }
                    />

                    <ModalField label="Sort Order">
                      <input
                        type="number"
                        value={
                          formData.sortOrder
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sortOrder:
                              Number(
                                e.target.value
                              ),
                          })
                        }
                        className={
                          modalInputClass
                        }
                      />
                    </ModalField>
                  </div>
                </div>

                {/* Case Study */}
                <div className="border-b border-slate-200 dark:border-[#303841]">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#d6a83a]" />

                        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                          Case Study
                        </h4>
                      </div>

                      <p className="mt-1 text-[10px] text-slate-400 dark:text-[#7f8995]">
                        Optional detailed project breakdown.
                      </p>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          formData.enableCaseStudy
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enableCaseStudy:
                              e.target
                                .checked,
                          })
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
                      />

                      <span className="text-[10px] font-medium text-slate-600 dark:text-[#aeb6c0]">
                        Enable
                      </span>
                    </label>
                  </div>

                  {formData.enableCaseStudy && (
                    <div className="border-t border-slate-200 dark:border-[#303841]">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <ModalField
                            label="Problem Statement"
                            required
                          >
                            <textarea
                              rows={3}
                              required={
                                formData.enableCaseStudy
                              }
                              value={
                                formData.problem
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  problem:
                                    e.target
                                      .value,
                                })
                              }
                              placeholder="The core problem this project was designed to address..."
                              className={
                                modalTextareaClass
                              }
                            />
                          </ModalField>
                        </div>

                        <div className="md:col-span-2">
                          <ModalField
                            label="Solution Overview"
                            required
                          >
                            <textarea
                              rows={3}
                              required={
                                formData.enableCaseStudy
                              }
                              value={
                                formData.solution
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  solution:
                                    e.target
                                      .value,
                                })
                              }
                              placeholder="How the solution addressed the problem..."
                              className={
                                modalTextareaClass
                              }
                            />
                          </ModalField>
                        </div>

                        <div className="md:col-span-2">
                          <ModalField label="Architecture Overview">
                            <textarea
                              rows={3}
                              value={
                                formData.architectureOverview
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  architectureOverview:
                                    e.target
                                      .value,
                                })
                              }
                              placeholder="System architecture description..."
                              className={
                                modalTextareaClass
                              }
                            />
                          </ModalField>
                        </div>

                        <ModalField label="Key Features">
                          <textarea
                            rows={5}
                            value={
                              formData.keyFeatures
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                keyFeatures:
                                  e.target
                                    .value,
                              })
                            }
                            placeholder={
                              'Feature 1\nFeature 2\nFeature 3'
                            }
                            className={
                              modalTextareaClass
                            }
                          />

                          <p
                            className={
                              helperClass
                            }
                          >
                            One feature per
                            line.
                          </p>
                        </ModalField>

                        <ModalField label="Challenges">
                          <textarea
                            rows={5}
                            value={
                              formData.challenges
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                challenges:
                                  e.target
                                    .value,
                              })
                            }
                            placeholder={
                              'Challenge 1\nChallenge 2'
                            }
                            className={
                              modalTextareaClass
                            }
                          />

                          <p
                            className={
                              helperClass
                            }
                          >
                            One challenge per
                            line.
                          </p>
                        </ModalField>

                        <ModalField label="Learnings">
                          <textarea
                            rows={4}
                            value={
                              formData.learnings
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                learnings:
                                  e.target
                                    .value,
                              })
                            }
                            placeholder={
                              'Learning 1\nLearning 2'
                            }
                            className={
                              modalTextareaClass
                            }
                          />

                          <p
                            className={
                              helperClass
                            }
                          >
                            One learning per
                            line.
                          </p>
                        </ModalField>

                        <ModalField label="Future Improvements">
                          <textarea
                            rows={4}
                            value={
                              formData.futureImprovements
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                futureImprovements:
                                  e.target
                                    .value,
                              })
                            }
                            placeholder={
                              'Improvement 1\nImprovement 2'
                            }
                            className={
                              modalTextareaClass
                            }
                          />

                          <p
                            className={
                              helperClass
                            }
                          >
                            One improvement per
                            line.
                          </p>
                        </ModalField>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      setIsFormModalOpen(
                        false
                      )
                    }
                    className="border border-slate-300 bg-transparent px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:bg-[#12161b] dark:hover:text-[#f4f5f6]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSaving
                    }
                    className="inline-flex items-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-5 py-2 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}

                    {isSaving
                      ? 'Saving'
                      : editingProject
                        ? 'Update Project'
                        : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ================= PROJECT IMAGES MODAL ================= */}
      {imagesModalProject &&
        typeof document !==
        'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/85 p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative my-6 w-full max-w-2xl border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#d6a83a]" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a47d18] dark:text-[#d6a83a]">
                      Project Images
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-[#f4f5f6]">
                    {
                      imagesModalProject.title
                    }
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
                    Manage screenshots and primary project imagery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setImagesModalProject(
                      null
                    )
                  }
                  className="text-slate-400 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
                  aria-label="Close image manager"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[74vh] overflow-y-auto">
                {/* Existing Images */}
                <div className="border-b border-slate-200 px-5 py-5 dark:border-[#303841]">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                        Current Images
                      </h4>

                      <p className="mt-1 text-[10px] text-slate-400 dark:text-[#7f8995]">
                        {
                          projectImages.length
                        }{' '}
                        image
                        {projectImages.length ===
                          1
                          ? ''
                          : 's'}
                      </p>
                    </div>
                  </div>

                  {isLoadingImages ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-5 w-5 animate-spin text-[#d6a83a]" />
                    </div>
                  ) : projectImages.length ===
                    0 ? (
                    <div className="border border-dashed border-slate-300 px-5 py-8 text-center dark:border-[#303841]">
                      <ImageIcon className="mx-auto mb-2 h-6 w-6 text-slate-300 dark:text-[#4b5560]" />

                      <p className="text-xs text-slate-500 dark:text-[#7f8995]">
                        No project images yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectImages.map(
                        (
                          image,
                          index
                        ) => (
                          <div
                            key={
                              image.id
                            }
                            className="flex flex-col gap-3 border border-slate-300 bg-white p-3 dark:border-[#303841] dark:bg-[#12161b] sm:flex-row sm:items-center"
                          >
                            <div className="h-20 w-full shrink-0 overflow-hidden border border-slate-200 bg-slate-100 dark:border-[#303841] dark:bg-[#181d23] sm:h-16 sm:w-24">
                              <img
                                src={resolveAsset(
                                  image.imageUrl
                                )}
                                alt={
                                  image.altText ||
                                  'Project screenshot'
                                }
                                className="h-full w-full object-cover"
                                onError={(
                                  e
                                ) => {
                                  (
                                    e.target as HTMLElement
                                  ).style.display =
                                    'none';
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="font-mono text-[9px] text-slate-400 dark:text-[#7f8995]">
                                  {String(
                                    index +
                                    1
                                  ).padStart(
                                    2,
                                    '0'
                                  )}
                                </span>

                                {image.isPrimary && (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a47d18] dark:text-[#d6a83a]">
                                    <Check className="h-2.5 w-2.5" />
                                    Primary
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 truncate text-[11px] text-slate-600 dark:text-[#aeb6c0]">
                                {image.altText ||
                                  'No alt text'}
                              </p>

                              <p className="mt-1 font-mono text-[9px] text-slate-400 dark:text-[#7f8995]">
                                Order{' '}
                                {
                                  image.sortOrder
                                }
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteImage(
                                  image.id
                                )
                              }
                              className="inline-flex items-center justify-center gap-1.5 self-start border border-red-500/20 px-3 py-2 text-[10px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/5 sm:self-center"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Add Image */}
                <form
                  onSubmit={
                    handleAddImage
                  }
                  className="px-5 py-5"
                >
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                      Add Project Image
                    </h4>

                    <p className="mt-1 text-[10px] text-slate-400 dark:text-[#7f8995]">
                      Choose an image from your device / file explorer or enter an image link.
                    </p>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="mb-4 flex border-b border-slate-200 dark:border-[#303841]">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('device')}
                      className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                        imageInputMode === 'device'
                          ? 'border-[#d6a83a] text-[#b48316] dark:text-[#d6a83a]'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]'
                      }`}
                    >
                      <HardDrive className="h-3.5 w-3.5" />
                      From Device / File Explorer
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition-colors ${
                        imageInputMode === 'url'
                          ? 'border-[#d6a83a] text-[#b48316] dark:text-[#d6a83a]'
                          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]'
                      }`}
                    >
                      <LinkIcon className="h-3.5 w-3.5" />
                      Image URL / Link
                    </button>
                  </div>

                  <div className="space-y-4">
                    {imageInputMode === 'device' ? (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleDeviceFile(e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />

                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            setImageDragActive(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            setImageDragActive(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setImageDragActive(false);
                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                              handleDeviceFile(e.dataTransfer.files[0]);
                            }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className={`group relative cursor-pointer border-2 border-dashed p-6 text-center transition-all ${
                            imageDragActive
                              ? 'border-[#d6a83a] bg-[#d6a83a]/5 dark:bg-[#d6a83a]/10'
                              : 'border-slate-300 bg-white hover:border-[#d6a83a]/70 hover:bg-slate-50 dark:border-[#303841] dark:bg-[#12161b] dark:hover:border-[#d6a83a]/60 dark:hover:bg-[#181d23]'
                          }`}
                        >
                          {isProcessingFile ? (
                            <div className="flex flex-col items-center justify-center py-3">
                              <Loader2 className="h-7 w-7 animate-spin text-[#d6a83a]" />
                              <p className="mt-2 text-xs text-slate-500 dark:text-[#8b949e]">
                                Processing image from device...
                              </p>
                            </div>
                          ) : selectedFileMeta && newImageUrl ? (
                            <div className="flex flex-col items-center justify-center gap-3">
                              <div className="relative h-28 w-44 overflow-hidden rounded border border-slate-300 dark:border-[#303841] shadow-sm">
                                <img
                                  src={newImageUrl}
                                  alt="Selected preview"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="text-center">
                                <p className="text-xs font-semibold text-slate-800 dark:text-[#f4f5f6]">
                                  {selectedFileMeta.fileName}
                                </p>
                                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-[#7f8995]">
                                  {selectedFileMeta.formattedSize}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                className="mt-1 inline-flex items-center gap-1.5 rounded border border-slate-300 dark:border-[#39424c] bg-white dark:bg-[#1a2026] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#d2d7dc] hover:border-[#d6a83a]"
                              >
                                <FolderOpen className="h-3.5 w-3.5 text-[#d6a83a]" />
                                Choose different file
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-3">
                              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#d6a83a]/10 text-[#b48316] dark:text-[#d6a83a]">
                                <Upload className="h-5 w-5" />
                              </div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-[#f4f5f6]">
                                Click to select image from device / file explorer or drag & drop here
                              </p>
                              <p className="mt-1 text-[11px] text-slate-400 dark:text-[#7f8995]">
                                PNG, JPG, WEBP, GIF, SVG up to 10MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <ModalField
                        label="Image URL or Asset Path"
                        required
                      >
                        <input
                          type="text"
                          required={imageInputMode === 'url'}
                          value={newImageUrl}
                          onChange={(e) =>
                            setNewImageUrl(e.target.value)
                          }
                          placeholder="/src/assets/projects/example.jpg or https://..."
                          className={modalInputClass}
                        />

                        {newImageUrl && !newImageUrl.startsWith('data:') && (
                          <div className="mt-3 flex items-center gap-3">
                            <div className="h-12 w-20 overflow-hidden border border-slate-300 bg-slate-100 dark:border-[#303841] dark:bg-[#12161b]">
                              <img
                                src={resolveAsset(newImageUrl)}
                                alt="Image preview"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-[#7f8995]">
                              Preview
                            </span>
                          </div>
                        )}
                      </ModalField>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <ModalField label="Alt Text / Label">
                        <input
                          type="text"
                          value={
                            newImageAlt
                          }
                          onChange={(e) =>
                            setNewImageAlt(
                              e.target
                                .value
                            )
                          }
                          placeholder="e.g. Dashboard view"
                          className={
                            modalInputClass
                          }
                        />
                      </ModalField>

                      <ModalField label="Sort Order">
                        <input
                          type="number"
                          value={
                            newImageSortOrder
                          }
                          onChange={(e) =>
                            setNewImageSortOrder(
                              Number(
                                e.target
                                  .value
                              )
                            )
                          }
                          className={
                            modalInputClass
                          }
                        />
                      </ModalField>
                    </div>

                    <div className="flex flex-col justify-between gap-4 border-t border-slate-200 pt-4 dark:border-[#303841] sm:flex-row sm:items-center">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            newImageIsPrimary
                          }
                          onChange={(e) =>
                            setNewImageIsPrimary(
                              e.target
                                .checked
                            )
                          }
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
                        />

                        <span className="text-[10px] font-medium text-slate-600 dark:text-[#aeb6c0]">
                          Make Primary Image
                        </span>
                      </label>

                      <button
                        type="submit"
                        disabled={
                          isAddingImage ||
                          !newImageUrl.trim()
                        }
                        className="inline-flex items-center justify-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isAddingImage ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}

                        {isAddingImage
                          ? 'Adding'
                          : 'Add Image'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-slate-200 px-5 py-3 dark:border-[#303841]">
                <button
                  type="button"
                  onClick={() =>
                    setImagesModalProject(
                      null
                    )
                  }
                  className="border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-[#303841] dark:text-[#aeb6c0] dark:hover:bg-[#12161b] dark:hover:text-[#f4f5f6]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Project"
        itemName={
          deleteTarget?.title || ''
        }
        itemType="project"
        isDeleting={isDeleting}
        onConfirm={
          handleDeleteConfirm
        }
        onClose={() =>
          setDeleteTarget(null)
        }
      />
    </div>
  );
};

const SectionHeader: React.FC<{
  title: string;
  description: string;
}> = ({
  title,
  description,
}) => {
    return (
      <div className="border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
          {title}
        </h4>

        <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
          {description}
        </p>
      </div>
    );
  };

const ModalField: React.FC<{
  label: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  children: React.ReactNode;
}> = ({
  label,
  required = false,
  optional = false,
  description,
  children,
}) => {
    return (
      <div className="border-b border-slate-200 p-5 last:border-b-0 dark:border-[#303841]">
        <label className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
          {label}{' '}
          {required && (
            <span className="text-[#d6a83a]">
              *
            </span>
          )}

          {optional && (
            <span className="ml-1 text-[10px] font-normal text-slate-400 dark:text-[#7f8995]">
              Optional
            </span>
          )}
        </label>

        {description && (
          <p className="mb-2 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
            {description}
          </p>
        )}

        {children}
      </div>
    );
  };

const ToggleField: React.FC<{
  label: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
}> = ({
  label,
  checked,
  onChange,
}) => {
    return (
      <label className="flex cursor-pointer items-center gap-2 border-b border-slate-200 p-5 dark:border-[#303841]">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            onChange(
              e.target.checked
            )
          }
          className="h-3.5 w-3.5 rounded border-slate-300 text-[#d6a83a] focus:ring-0 dark:border-[#303841] dark:bg-[#12161b]"
        />

        <span className="text-xs font-medium text-slate-700 dark:text-[#aeb6c0]">
          {label}
        </span>
      </label>
    );
  };

const modalInputClass =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

const modalTextareaClass =
  'w-full resize-y border border-slate-300 bg-white p-3 text-xs leading-5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

const helperClass =
  'mt-1.5 text-[10px] text-slate-400 dark:text-[#7f8995]';

export default ProjectsManager;