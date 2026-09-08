import { Request, Response } from 'express';
import certificateService from '../services/certificate.service';
import { validateRequired, isValidNumber, isValidStringArray } from '../utils/validation';

export const getAllCertificatesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const certs = await certificateService.getAllCertificates();
    res.status(200).json({
      success: true,
      data: certs,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates',
    });
  }
};

export const getCertificateByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const cert = await certificateService.getCertificateById(req.params.id);
    if (!cert) {
      res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: cert,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate',
    });
  }
};

export const createCertificateController = async (req: Request, res: Response): Promise<void> => {
  const { title, issuer, issueDate, description, imageUrl, verificationUrl, credentialId, skills, sortOrder, isVisible } = req.body;

  const validation = validateRequired([
    { name: 'title', value: title },
    { name: 'issuer', value: issuer },
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

  if (skills !== undefined && !isValidStringArray(skills)) {
    res.status(400).json({
      success: false,
      message: 'skills must be an array of strings',
    });
    return;
  }

  try {
    const cert = await certificateService.createCertificate({
      title,
      issuer,
      issueDate,
      description,
      imageUrl,
      verificationUrl,
      credentialId,
      skills,
      sortOrder,
      isVisible,
    });

    res.status(201).json({
      success: true,
      data: cert,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to create certificate',
    });
  }
};

export const updateCertificateController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { sortOrder, skills } = req.body;

  if (sortOrder !== undefined && !isValidNumber(sortOrder)) {
    res.status(400).json({
      success: false,
      message: 'sortOrder must be a valid number',
    });
    return;
  }

  if (skills !== undefined && !isValidStringArray(skills)) {
    res.status(400).json({
      success: false,
      message: 'skills must be an array of strings',
    });
    return;
  }

  try {
    const cert = await certificateService.updateCertificate(id, req.body);
    res.status(200).json({
      success: true,
      data: cert,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update certificate';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const deleteCertificateController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await certificateService.deleteCertificate(id);
    res.status(200).json({
      success: true,
      message: 'Certificate successfully deleted',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete certificate';
    const statusCode = message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getPublicCertificatesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const certs = await certificateService.getPublicCertificates();
    res.status(200).json({
      success: true,
      data: certs,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public certificates',
    });
  }
};
