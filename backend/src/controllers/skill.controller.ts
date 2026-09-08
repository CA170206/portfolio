import { Request, Response } from 'express';
import { SkillCategory } from '@prisma/client';
import skillService from '../services/skill.service';
import { validateRequired, isValidNumber, isValidEnum, isValidBoolean } from '../utils/validation';

export const getAllSkillsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const skills = await skillService.getAllSkills();
    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills',
    });
  }
};

export const getSkillByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await skillService.getSkillById(req.params.id);
    if (!skill) {
      res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill',
    });
  }
};

export const createSkillController = async (req: Request, res: Response): Promise<void> => {
  const { name, category, highlight, sortOrder, isVisible } = req.body;

  const validation = validateRequired([
    { name: 'name', value: name },
    {
      name: 'category',
      value: category,
      validator: (val) => isValidEnum(val, SkillCategory),
      customMessage: `category is required and must be one of: ${Object.values(SkillCategory).join(', ')}`,
    },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
    });
    return;
  }

  if (highlight !== undefined && !isValidBoolean(highlight)) {
    res.status(400).json({
      success: false,
      message: 'highlight must be a boolean',
    });
    return;
  }

  if (sortOrder !== undefined && !isValidNumber(sortOrder)) {
    res.status(400).json({
      success: false,
      message: 'sortOrder must be a valid number',
    });
    return;
  }

  try {
    const skill = await skillService.createSkill({
      name,
      category: category as SkillCategory,
      highlight,
      sortOrder,
      isVisible,
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to create skill',
    });
  }
};

export const updateSkillController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { category, highlight, sortOrder } = req.body;

  if (category !== undefined && !isValidEnum(category, SkillCategory)) {
    res.status(400).json({
      success: false,
      message: `category must be one of: ${Object.values(SkillCategory).join(', ')}`,
    });
    return;
  }

  if (highlight !== undefined && !isValidBoolean(highlight)) {
    res.status(400).json({
      success: false,
      message: 'highlight must be a boolean',
    });
    return;
  }

  if (sortOrder !== undefined && !isValidNumber(sortOrder)) {
    res.status(400).json({
      success: false,
      message: 'sortOrder must be a valid number',
    });
    return;
  }

  try {
    const skill = await skillService.updateSkill(id, req.body);
    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update skill';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteSkillController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await skillService.deleteSkill(id);
    res.status(200).json({
      success: true,
      message: 'Skill successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete skill';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicSkillsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const skills = await skillService.getPublicSkills();
    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public skills',
    });
  }
};
