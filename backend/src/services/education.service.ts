import prisma from '../config/prisma';

export interface CreateEducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
  grade?: string | null;
  gradeLabel?: string | null;
  resultLabel?: string | null;
  resultTitle?: string | null;
  resultImageUrl?: string | null;
  description?: string | null;
  coursework?: string[];
  sortOrder?: number;
  isVisible?: boolean;
}

export interface UpdateEducationInput {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string | null;
  startDate?: string;
  endDate?: string | null;
  grade?: string | null;
  gradeLabel?: string | null;
  resultLabel?: string | null;
  resultTitle?: string | null;
  resultImageUrl?: string | null;
  description?: string | null;
  coursework?: string[];
  sortOrder?: number;
  isVisible?: boolean;
}

export class EducationService {
  async getAllEducations() {
    return prisma.education.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getEducationById(id: string) {
    return prisma.education.findUnique({
      where: { id },
    });
  }

  async createEducation(data: CreateEducationInput) {
    return prisma.education.create({
      data: {
        institution: data.institution.trim(),
        degree: data.degree.trim(),
        fieldOfStudy: data.fieldOfStudy?.trim() || null,
        startDate: data.startDate.trim(),
        endDate: data.endDate?.trim() || null,
        grade: data.grade?.trim() || null,
        gradeLabel: data.gradeLabel?.trim() || null,
        resultLabel: data.resultLabel?.trim() || null,
        resultTitle: data.resultTitle?.trim() || null,
        resultImageUrl: data.resultImageUrl?.trim() || null,
        description: data.description?.trim() || null,
        coursework: data.coursework || [],
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async updateEducation(id: string, data: UpdateEducationInput) {
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Education not found');
    }

    return prisma.education.update({
      where: { id },
      data: {
        ...(data.institution !== undefined && { institution: data.institution.trim() }),
        ...(data.degree !== undefined && { degree: data.degree.trim() }),
        ...(data.fieldOfStudy !== undefined && { fieldOfStudy: data.fieldOfStudy ? data.fieldOfStudy.trim() : null }),
        ...(data.startDate !== undefined && { startDate: data.startDate.trim() }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? data.endDate.trim() : null }),
        ...(data.grade !== undefined && { grade: data.grade ? data.grade.trim() : null }),
        ...(data.gradeLabel !== undefined && { gradeLabel: data.gradeLabel ? data.gradeLabel.trim() : null }),
        ...(data.resultLabel !== undefined && { resultLabel: data.resultLabel ? data.resultLabel.trim() : null }),
        ...(data.resultTitle !== undefined && { resultTitle: data.resultTitle ? data.resultTitle.trim() : null }),
        ...(data.resultImageUrl !== undefined && { resultImageUrl: data.resultImageUrl ? data.resultImageUrl.trim() : null }),
        ...(data.description !== undefined && { description: data.description ? data.description.trim() : null }),
        ...(data.coursework !== undefined && { coursework: data.coursework }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });
  }

  async deleteEducation(id: string) {
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Education not found');
    }

    return prisma.education.delete({
      where: { id },
    });
  }

  async getPublicEducations() {
    return prisma.education.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        institution: true,
        degree: true,
        fieldOfStudy: true,
        startDate: true,
        endDate: true,
        grade: true,
        gradeLabel: true,
        resultLabel: true,
        resultTitle: true,
        resultImageUrl: true,
        description: true,
        coursework: true,
        sortOrder: true,
      },
    });
  }
}

export const educationService = new EducationService();
export default educationService;
