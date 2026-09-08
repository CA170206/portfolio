import prisma from '../config/prisma';

export interface CreateSocialLinkInput {
  platform: string;
  url: string;
  username?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface UpdateSocialLinkInput {
  platform?: string;
  url?: string;
  username?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export class SocialLinkService {
  async getAllSocialLinks() {
    return prisma.socialLink.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getSocialLinkById(id: string) {
    return prisma.socialLink.findUnique({
      where: { id },
    });
  }

  async createSocialLink(data: CreateSocialLinkInput) {
    return prisma.socialLink.create({
      data: {
        platform: data.platform.trim(),
        url: data.url.trim(),
        username: data.username?.trim() || null,
        icon: data.icon?.trim() || null,
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true,
      },
    });
  }

  async updateSocialLink(id: string, data: UpdateSocialLinkInput) {
    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Social link not found');
    }

    return prisma.socialLink.update({
      where: { id },
      data: {
        ...(data.platform !== undefined && { platform: data.platform.trim() }),
        ...(data.url !== undefined && { url: data.url.trim() }),
        ...(data.username !== undefined && { username: data.username ? data.username.trim() : null }),
        ...(data.icon !== undefined && { icon: data.icon ? data.icon.trim() : null }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
      },
    });
  }

  async deleteSocialLink(id: string) {
    const existing = await prisma.socialLink.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Social link not found');
    }

    return prisma.socialLink.delete({
      where: { id },
    });
  }

  async getPublicSocialLinks() {
    return prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        platform: true,
        url: true,
        username: true,
        icon: true,
        sortOrder: true,
      },
    });
  }
}

export const socialLinkService = new SocialLinkService();
export default socialLinkService;
