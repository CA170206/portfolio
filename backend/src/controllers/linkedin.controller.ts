import { Request, Response } from 'express';
import linkedinService from '../services/linkedin.service';
import { validateRequired } from '../utils/validation';

export const getLinkedinController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await linkedinService.getLinkedinData();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch LinkedIn data';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateLinkedinController = async (req: Request, res: Response): Promise<void> => {
  const { profileUrl, followers, connections, role, company, location, education } = req.body;

  const validation = validateRequired([
    { name: 'profileUrl', value: profileUrl },
    { name: 'followers', value: followers },
    { name: 'connections', value: connections },
    { name: 'role', value: role },
    { name: 'company', value: company },
    { name: 'location', value: location },
    { name: 'education', value: education },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
    });
    return;
  }

  try {
    const data = await linkedinService.updateLinkedinData({
      profileUrl,
      followers,
      connections,
      role,
      company,
      location,
      education,
    });

    res.status(200).json({
      success: true,
      message: 'LinkedIn settings updated successfully',
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update LinkedIn settings';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getPublicLinkedinController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await linkedinService.getPublicLinkedinData();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch public LinkedIn data';
    res.status(500).json({
      success: false,
      message,
    });
  }
};
