import prisma from '../config/prisma';

export interface CreateProjectInput {
  title: string;
  tagline?: string;
  shortDescription: string;
  detailedDescription?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  isVisible?: boolean;
  technologies?: string[];
}

export interface UpdateProjectInput {
  title?: string;
  tagline?: string;
  shortDescription?: string;
  detailedDescription?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  isVisible?: boolean;
  technologies?: string[];
}

export interface AddImageInput {
  imageUrl: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface UpdateImageInput {
  imageUrl?: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

export class ProjectService {
  /**
   * Helper to resolve technology names and link them to a project.
   */
  private async syncTechnologies(projectId: string, techNames: string[]) {
    // Remove duplicates and empty strings
    const uniqueNames = Array.from(
      new Set(techNames.map((t) => t.trim()).filter((t) => t.length > 0))
    );

    // Remove existing relations
    await prisma.projectTechnology.deleteMany({
      where: { projectId },
    });

    if (uniqueNames.length === 0) {
      return;
    }

    // Resolve or create technologies
    for (const name of uniqueNames) {
      const tech = await prisma.technology.upsert({
        where: { name },
        update: {},
        create: { name },
      });

      await prisma.projectTechnology.create({
        data: {
          projectId,
          technologyId: tech.id,
        },
      });
    }
  }

  /**
   * Retrieves all projects for admin dashboard with images and technologies.
   */
  async getAllProjects() {
    return prisma.project.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        technologies: {
          include: {
            technology: true,
          },
        },
        caseStudy: true,
      },
    });
  }

  /**
   * Retrieves a single project by ID.
   */
  async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        technologies: {
          include: {
            technology: true,
          },
        },
        caseStudy: true,
      },
    });
  }

  /**
   * Creates a new project and associates technologies.
   */
  async createProject(data: CreateProjectInput) {
    const project = await prisma.project.create({
      data: {
        title: data.title.trim(),
        tagline: data.tagline?.trim() || '',
        shortDescription: data.shortDescription.trim(),
        detailedDescription: data.detailedDescription?.trim() || data.shortDescription.trim(),
        liveUrl: data.liveUrl?.trim() || null,
        githubUrl: data.githubUrl?.trim() || null,
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });

    if (data.technologies && data.technologies.length > 0) {
      await this.syncTechnologies(project.id, data.technologies);
    }

    return this.getProjectById(project.id);
  }

  /**
   * Updates an existing project and syncs technologies if provided.
   */
  async updateProject(id: string, data: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Project not found');
    }

    await prisma.project.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.tagline !== undefined && { tagline: data.tagline.trim() }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription.trim() }),
        ...(data.detailedDescription !== undefined && { detailedDescription: data.detailedDescription.trim() }),
        ...(data.liveUrl !== undefined && { liveUrl: data.liveUrl ? data.liveUrl.trim() : null }),
        ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl ? data.githubUrl.trim() : null }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });

    if (data.technologies !== undefined) {
      await this.syncTechnologies(id, data.technologies);
    }

    return this.getProjectById(id);
  }

  /**
   * Deletes a project by ID (cascades to images, projectTechnologies, caseStudy).
   */
  async deleteProject(id: string) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Project not found');
    }

    return prisma.project.delete({
      where: { id },
    });
  }

  /**
   * Retrieves public projects formatted cleanly for frontend consumption.
   */
  async getPublicProjects() {
    const projects = await prisma.project.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        technologies: {
          include: {
            technology: true,
          },
        },
        caseStudy: true,
      },
    });

    return projects.map((project) => {
      const primaryImage = project.images.find((img) => img.isPrimary) || project.images[0];
      return {
        id: project.id,
        title: project.title,
        tagline: project.tagline,
        shortDescription: project.shortDescription,
        detailedDescription: project.detailedDescription,
        liveUrl: project.liveUrl,
        githubUrl: project.githubUrl,
        featured: project.featured,
        sortOrder: project.sortOrder,
        thumbnail: primaryImage ? primaryImage.imageUrl : null,
        images: project.images.map((img) => ({
          id: img.id,
          imageUrl: img.imageUrl,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        })),
        technologies: project.technologies.map((pt) => pt.technology.name),
        caseStudy: project.caseStudy
          ? {
              problem: project.caseStudy.problem,
              solution: project.caseStudy.solution,
              keyFeatures: project.caseStudy.keyFeatures,
              architectureOverview: project.caseStudy.architectureOverview,
              challenges: project.caseStudy.challenges,
              learnings: project.caseStudy.learnings,
              futureImprovements: project.caseStudy.futureImprovements,
            }
          : null,
      };
    });
  }

  // ================= PROJECT IMAGES =================

  /**
   * Retrieves all images for a project.
   */
  async getProjectImages(projectId: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.projectImage.findMany({
      where: { projectId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  /**
   * Adds an image to a project.
   */
  async addProjectImage(projectId: string, data: AddImageInput) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new Error('Project not found');
    }

    // If marked as primary, unmark other images for this project
    if (data.isPrimary) {
      await prisma.projectImage.updateMany({
        where: { projectId },
        data: { isPrimary: false },
      });
    }

    return prisma.projectImage.create({
      data: {
        projectId,
        imageUrl: data.imageUrl.trim(),
        altText: data.altText?.trim() || null,
        isPrimary: data.isPrimary ?? false,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  /**
   * Updates an existing project image.
   */
  async updateProjectImage(projectId: string, imageId: string, data: UpdateImageInput) {
    const image = await prisma.projectImage.findFirst({
      where: { id: imageId, projectId },
    });

    if (!image) {
      throw new Error('Project image not found');
    }

    if (data.isPrimary) {
      await prisma.projectImage.updateMany({
        where: { projectId, id: { not: imageId } },
        data: { isPrimary: false },
      });
    }

    return prisma.projectImage.update({
      where: { id: imageId },
      data: {
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() }),
        ...(data.altText !== undefined && { altText: data.altText ? data.altText.trim() : null }),
        ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
  }

  /**
   * Deletes a project image.
   */
  async deleteProjectImage(projectId: string, imageId: string) {
    const image = await prisma.projectImage.findFirst({
      where: { id: imageId, projectId },
    });

    if (!image) {
      throw new Error('Project image not found');
    }

    return prisma.projectImage.delete({
      where: { id: imageId },
    });
  }
}

export const projectService = new ProjectService();
export default projectService;
