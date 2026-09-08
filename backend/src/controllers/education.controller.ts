import { Request, Response } from 'express';
import educationService from '../services/education.service';
import { validateRequired, isValidNumber, isValidStringArray } from '../utils/validation';

export const getAllEducationsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const educations = await educationService.getAllEducations();
    res.status(200).json({
      success: true,
      data: educations,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch educations',
    });
  }
};

export const getEducationByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const education = await educationService.getEducationById(req.params.id);
    if (!education) {
      res.status(404).json({
        success: false,
        message: 'Education not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: education,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch education',
    });
  }
};

export const createEducationController = async (req: Request, res: Response): Promise<void> => {
  const {
    institution,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    grade,
    gradeLabel,
    resultLabel,
    resultTitle,
    resultImageUrl,
    description,
    coursework,
    sortOrder,
    isVisible,
  } = req.body;

  const validation = validateRequired([
    { name: 'institution', value: institution },
    { name: 'degree', value: degree },
    { name: 'startDate', value: startDate },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
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

  if (coursework !== undefined && !isValidStringArray(coursework)) {
    res.status(400).json({
      success: false,
      message: 'coursework must be an array of strings',
    });
    return;
  }

  try {
    const education = await educationService.createEducation({
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      grade,
      gradeLabel,
      resultLabel,
      resultTitle,
      resultImageUrl,
      description,
      coursework,
      sortOrder,
      isVisible,
    });

    res.status(201).json({
      success: true,
      data: education,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to create education',
    });
  }
};

export const updateEducationController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { sortOrder, coursework } = req.body;

  if (sortOrder !== undefined && !isValidNumber(sortOrder)) {
    res.status(400).json({
      success: false,
      message: 'sortOrder must be a valid number',
    });
    return;
  }

  if (coursework !== undefined && !isValidStringArray(coursework)) {
    res.status(400).json({
      success: false,
      message: 'coursework must be an array of strings',
    });
    return;
  }

  try {
    const education = await educationService.updateEducation(id, req.body);
    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update education';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteEducationController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await educationService.deleteEducation(id);
    res.status(200).json({
      success: true,
      message: 'Education successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete education';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicEducationsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const educations = await educationService.getPublicEducations();
    res.status(200).json({
      success: true,
      data: educations,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public educations',
    });
  }
};
