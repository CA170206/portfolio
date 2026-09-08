import { Request, Response } from 'express';
import githubService from '../services/github.service';
import { validateRequired } from '../utils/validation';

export const getGithubController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await githubService.getGithubData();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch GitHub configuration';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const updateGithubController = async (req: Request, res: Response): Promise<void> => {
  const { username, profileUrl } = req.body;

  const validation = validateRequired([
    { name: 'username', value: username },
    { name: 'profileUrl', value: profileUrl },
  ]);

  if (!validation.isValid) {
    res.status(400).json({
      success: false,
      message: validation.message,
    });
    return;
  }

  try {
    const data = await githubService.updateGithubData({ username, profileUrl });
    res.status(200).json({
      success: true,
      message: 'GitHub configuration updated successfully',
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update GitHub configuration';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const syncGithubController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await githubService.syncGithubActivity();
    res.status(200).json({
      success: true,
      message: `GitHub activity synchronized successfully (${result.totalContributions.toLocaleString()} contributions across ${result.count} days).`,
      data: result.updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to synchronize GitHub activity';
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getPublicGithubController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await githubService.getPublicGithubData();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch public GitHub data';
    res.status(500).json({
      success: false,
      message,
    });
  }
};
