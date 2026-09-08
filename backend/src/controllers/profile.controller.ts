import { Request, Response } from 'express';
import profileService from '../services/profile.service';
import { validateRequired } from '../utils/validation';

export const getProfileController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profile = await profileService.getProfile();
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

export const createProfileController = async (req: Request, res: Response): Promise<void> => {
  const { name, headline, shortBio, about, location, email, phone, profileImage, resumeUrl } = req.body;

  const validation = validateRequired([
    { name: 'name', value: name },
    { name: 'headline', value: headline },
    { name: 'shortBio', value: shortBio },
    { name: 'about', value: about },
    { name: 'location', value: location },
    { name: 'email', value: email },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
    });
    return;
  }

  try {
    const profile = await profileService.createProfile({
      name,
      headline,
      shortBio,
      about,
      location,
      email,
      phone,
      profileImage,
      resumeUrl,
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create profile';
    const statusCode = message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const updateProfileController = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    const profile = await profileService.updateProfile(id, req.body);
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update profile';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteProfileController = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  try {
    await profileService.deleteProfile(id);
    res.status(200).json({
      success: true,
      message: 'Profile successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete profile';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicProfileController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profile = await profileService.getPublicProfile();
    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public profile',
    });
  }
};
