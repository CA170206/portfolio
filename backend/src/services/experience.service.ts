import prisma from '../config/prisma';

export interface CreateExperienceInput {
  company: string;
  position: string;
  employmentType?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  currentlyWorking?: boolean;
  description?: string[];
  technologies?: string[];
  offerLetterUrl?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface UpdateExperienceInput {
  company?: string;
  position?: string;
  employmentType?: string | null;
  location?: string | null;
  startDate?: string;
  endDate?: string | null;
  currentlyWorking?: boolean;
  description?: string[];
  technologies?: string[];
  offerLetterUrl?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export class ExperienceService {
  async getAllExperiences() {
    return prisma.experience.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getExperienceById(id: string) {
    return prisma.experience.findUnique({
      where: { id },
    });
  }

  async createExperience(data: CreateExperienceInput) {
    return prisma.experience.create({
      data: {
        company: data.company.trim(),
        position: data.position.trim(),
        employmentType: data.employmentType?.trim() || null,
        location: data.location?.trim() || null,
        startDate: data.startDate.trim(),
        endDate: data.endDate?.trim() || null,
        currentlyWorking: data.currentlyWorking ?? false,
        description: data.description || [],
        technologies: data.technologies || [],
        offerLetterUrl: data.offerLetterUrl?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async updateExperience(id: string, data: UpdateExperienceInput) {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Experience not found');
    }

    return prisma.experience.update({
      where: { id },
      data: {
        ...(data.company !== undefined && { company: data.company.trim() }),
        ...(data.position !== undefined && { position: data.position.trim() }),
        ...(data.employmentType !== undefined && { employmentType: data.employmentType ? data.employmentType.trim() : null }),
        ...(data.location !== undefined && { location: data.location ? data.location.trim() : null }),
        ...(data.startDate !== undefined && { startDate: data.startDate.trim() }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? data.endDate.trim() : null }),
        ...(data.currentlyWorking !== undefined && { currentlyWorking: data.currentlyWorking }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.technologies !== undefined && { technologies: data.technologies }),
        ...(data.offerLetterUrl !== undefined && { offerLetterUrl: data.offerLetterUrl ? data.offerLetterUrl.trim() : null }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });
  }

  async deleteExperience(id: string) {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Experience not found');
    }

    return prisma.experience.delete({
      where: { id },
    });
  }

  async getPublicExperiences() {
    return prisma.experience.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        company: true,
        position: true,
        employmentType: true,
        location: true,
        startDate: true,
        endDate: true,
        currentlyWorking: true,
        description: true,
        technologies: true,
        offerLetterUrl: true,
        sortOrder: true,
      },
    });
  }
}

export const experienceService = new ExperienceService();
export default experienceService;
