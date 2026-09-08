import { Request, Response } from 'express';
import experienceService from '../services/experience.service';
import { validateRequired, isValidNumber, isValidStringArray, isValidBoolean } from '../utils/validation';

export const getAllExperiencesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const experiences = await experienceService.getAllExperiences();
    res.status(200).json({
      success: true,
      data: experiences,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences',
    });
  }
};

export const getExperienceByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const experience = await experienceService.getExperienceById(req.params.id);
    if (!experience) {
      res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience',
    });
  }
};

export const createExperienceController = async (req: Request, res: Response): Promise<void> => {
  const {
    company,
    position,
    employmentType,
    location,
    startDate,
    endDate,
    currentlyWorking,
    description,
    technologies,
    offerLetterUrl,
    sortOrder,
    isVisible,
  } = req.body;

  const validation = validateRequired([
    { name: 'company', value: company },
    { name: 'position', value: position },
    { name: 'startDate', value: startDate },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
    });
    return;
  }

  if (currentlyWorking !== undefined && !isValidBoolean(currentlyWorking)) {
    res.status(400).json({
      success: false,
      message: 'currentlyWorking must be a boolean',
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

  if (description !== undefined && !isValidStringArray(description)) {
    res.status(400).json({
      success: false,
      message: 'description must be an array of strings',
    });
    return;
  }

  if (technologies !== undefined && !isValidStringArray(technologies)) {
    res.status(400).json({
      success: false,
      message: 'technologies must be an array of strings',
    });
    return;
  }

  try {
    const experience = await experienceService.createExperience({
      company,
      position,
      employmentType,
      location,
      startDate,
      endDate,
      currentlyWorking,
      description,
      technologies,
      offerLetterUrl,
      sortOrder,
      isVisible,
    });

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to create experience',
    });
  }
};

export const updateExperienceController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { currentlyWorking, sortOrder, description, technologies } = req.body;

  if (currentlyWorking !== undefined && !isValidBoolean(currentlyWorking)) {
    res.status(400).json({
      success: false,
      message: 'currentlyWorking must be a boolean',
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

  if (description !== undefined && !isValidStringArray(description)) {
    res.status(400).json({
      success: false,
      message: 'description must be an array of strings',
    });
    return;
  }

  if (technologies !== undefined && !isValidStringArray(technologies)) {
    res.status(400).json({
      success: false,
      message: 'technologies must be an array of strings',
    });
    return;
  }

  try {
    const experience = await experienceService.updateExperience(id, req.body);
    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update experience';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteExperienceController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await experienceService.deleteExperience(id);
    res.status(200).json({
      success: true,
      message: 'Experience successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete experience';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicExperiencesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const experiences = await experienceService.getPublicExperiences();
    res.status(200).json({
      success: true,
      data: experiences,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public experiences',
    });
  }
};
