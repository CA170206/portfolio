import prisma from '../config/prisma';
import { SkillCategory } from '@prisma/client';

export interface CreateSkillInput {
  name: string;
  category: SkillCategory;
  highlight?: boolean;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface UpdateSkillInput {
  name?: string;
  category?: SkillCategory;
  highlight?: boolean;
  sortOrder?: number;
  isVisible?: boolean;
}

export class SkillService {
  async getAllSkills() {
    return prisma.skill.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getSkillById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
    });
  }

  async createSkill(data: CreateSkillInput) {
    return prisma.skill.create({
      data: {
        name: data.name.trim(),
        category: data.category,
        highlight: data.highlight ?? false,
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async updateSkill(id: string, data: UpdateSkillInput) {
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Skill not found');
    }

    return prisma.skill.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.highlight !== undefined && { highlight: data.highlight }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });
  }

  async deleteSkill(id: string) {
    const existing = await prisma.skill.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Skill not found');
    }

    return prisma.skill.delete({
      where: { id },
    });
  }

  async getPublicSkills() {
    return prisma.skill.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        category: true,
        highlight: true,
        sortOrder: true,
      },
    });
  }
}

export const skillService = new SkillService();
export default skillService;
