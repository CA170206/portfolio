import { Request, Response } from 'express';
import projectService from '../services/project.service';
import { validateRequired, isValidNumber, isValidStringArray } from '../utils/validation';

export const getAllProjectsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects();
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
};

export const getProjectByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
};

export const createProjectController = async (req: Request, res: Response): Promise<void> => {
  const { title, tagline, shortDescription, detailedDescription, liveUrl, githubUrl, featured, sortOrder, isVisible, technologies } = req.body;

  const validation = validateRequired([
    { name: 'title', value: title },
    { name: 'shortDescription', value: shortDescription },
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

  if (technologies !== undefined && !isValidStringArray(technologies)) {
    res.status(400).json({
      success: false,
      message: 'technologies must be an array of strings',
    });
    return;
  }

  try {
    const project = await projectService.createProject({
      title,
      tagline,
      shortDescription,
      detailedDescription,
      liveUrl,
      githubUrl,
      featured,
      sortOrder,
      isVisible,
      technologies,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
};

export const updateProjectController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { sortOrder, technologies } = req.body;

  if (sortOrder !== undefined && !isValidNumber(sortOrder)) {
    res.status(400).json({
      success: false,
      message: 'sortOrder must be a valid number',
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
    const project = await projectService.updateProject(id, req.body);
    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteProjectController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await projectService.deleteProject(id);
    res.status(200).json({
      success: true,
      message: 'Project successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicProjectsController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await projectService.getPublicProjects();
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public projects',
    });
  }
};

// ================= PROJECT IMAGES CONTROLLERS =================

export const getProjectImagesController = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    const images = await projectService.getProjectImages(projectId);
    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch project images';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const addProjectImageController = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const { imageUrl, altText, isPrimary, sortOrder } = req.body;

  const validation = validateRequired([
    { name: 'imageUrl', value: imageUrl },
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

  try {
    const image = await projectService.addProjectImage(projectId, {
      imageUrl,
      altText,
      isPrimary,
      sortOrder,
    });

    res.status(201).json({
      success: true,
      data: image,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add image';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const updateProjectImageController = async (req: Request, res: Response): Promise<void> => {
  const { projectId, imageId } = req.params;
  const { sortOrder } = req.body;

  if (sortOrder !== undefined && !isValidNumber(sortOrder)) {
    res.status(400).json({
      success: false,
      message: 'sortOrder must be a valid number',
    });
    return;
  }

  try {
    const image = await projectService.updateProjectImage(projectId, imageId, req.body);
    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update image';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteProjectImageController = async (req: Request, res: Response): Promise<void> => {
  const { projectId, imageId } = req.params;

  try {
    await projectService.deleteProjectImage(projectId, imageId);
    res.status(200).json({
      success: true,
      message: 'Project image successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete image';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
