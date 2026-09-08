import prisma from '../config/prisma';

export interface CreateCertificateInput {
  title: string;
  issuer: string;
  issueDate?: string;
  description?: string | null;
  imageUrl: string;
  verificationUrl?: string | null;
  credentialId?: string | null;
  skills?: string[];
  sortOrder?: number;
  isVisible?: boolean;
}

export interface UpdateCertificateInput {
  title?: string;
  issuer?: string;
  issueDate?: string;
  description?: string | null;
  imageUrl?: string;
  verificationUrl?: string | null;
  credentialId?: string | null;
  skills?: string[];
  sortOrder?: number;
  isVisible?: boolean;
}

export class CertificateService {
  async getAllCertificates() {
    return prisma.certificate.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getCertificateById(id: string) {
    return prisma.certificate.findUnique({
      where: { id },
    });
  }

  async createCertificate(data: CreateCertificateInput) {
    return prisma.certificate.create({
      data: {
        title: data.title.trim(),
        issuer: data.issuer.trim(),
        issueDate: data.issueDate?.trim() || '',
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl.trim(),
        verificationUrl: data.verificationUrl?.trim() || null,
        credentialId: data.credentialId?.trim() || null,
        skills: data.skills || [],
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async updateCertificate(id: string, data: UpdateCertificateInput) {
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Certificate not found');
    }

    return prisma.certificate.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.issuer !== undefined && { issuer: data.issuer.trim() }),
        ...(data.issueDate !== undefined && { issueDate: data.issueDate.trim() }),
        ...(data.description !== undefined && { description: data.description ? data.description.trim() : null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() }),
        ...(data.verificationUrl !== undefined && { verificationUrl: data.verificationUrl ? data.verificationUrl.trim() : null }),
        ...(data.credentialId !== undefined && { credentialId: data.credentialId ? data.credentialId.trim() : null }),
        ...(data.skills !== undefined && { skills: data.skills }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });
  }

  async deleteCertificate(id: string) {
    const existing = await prisma.certificate.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Certificate not found');
    }

    return prisma.certificate.delete({
      where: { id },
    });
  }

  async getPublicCertificates() {
    return prisma.certificate.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        title: true,
        issuer: true,
        issueDate: true,
        description: true,
        imageUrl: true,
        verificationUrl: true,
        credentialId: true,
        skills: true,
        sortOrder: true,
      },
    });
  }
}

export const certificateService = new CertificateService();
export default certificateService;
