import { Request, Response } from 'express';
import socialLinkService from '../services/socialLink.service';
import { validateRequired, isValidNumber, isValidBoolean } from '../utils/validation';

export const getAllSocialLinksController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const links = await socialLinkService.getAllSocialLinks();
    res.status(200).json({
      success: true,
      data: links,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social links',
    });
  }
};

export const getSocialLinkByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const link = await socialLinkService.getSocialLinkById(req.params.id);
    if (!link) {
      res.status(404).json({
        success: false,
        message: 'Social link not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: link,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch social link',
    });
  }
};

export const createSocialLinkController = async (req: Request, res: Response): Promise<void> => {
  const { platform, url, username, icon, sortOrder, isVisible } = req.body;

  const validation = validateRequired([
    { name: 'platform', value: platform },
    { name: 'url', value: url },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
    });
    return;
  }

  if (isVisible !== undefined && !isValidBoolean(isVisible)) {
    res.status(400).json({
      success: false,
      message: 'isVisible must be a boolean',
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
    const link = await socialLinkService.createSocialLink({
      platform,
      url,
      username,
      icon,
      sortOrder,
      isVisible,
    });

    res.status(201).json({
      success: true,
      data: link,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to create social link',
    });
  }
};

export const updateSocialLinkController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isVisible, sortOrder } = req.body;

  if (isVisible !== undefined && !isValidBoolean(isVisible)) {
    res.status(400).json({
      success: false,
      message: 'isVisible must be a boolean',
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
    const link = await socialLinkService.updateSocialLink(id, req.body);
    res.status(200).json({
      success: true,
      data: link,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update social link';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteSocialLinkController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await socialLinkService.deleteSocialLink(id);
    res.status(200).json({
      success: true,
      message: 'Social link successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete social link';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicSocialLinksController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const links = await socialLinkService.getPublicSocialLinks();
    res.status(200).json({
      success: true,
      data: links,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public social links',
    });
  }
};
