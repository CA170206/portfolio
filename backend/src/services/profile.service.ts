import prisma from '../config/prisma';

export interface CreateProfileInput {
  slug?: string;
  name: string;
  headline: string;
  shortBio: string;
  about: string;
  location: string;
  email: string;
  phone?: string | null;
  profileImage?: string | null;
  resumeUrl?: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  headline?: string;
  shortBio?: string;
  about?: string;
  location?: string;
  email?: string;
  phone?: string | null;
  profileImage?: string | null;
  resumeUrl?: string | null;
}

export class ProfileService {
  /**
   * Retrieves the current profile (singleton default).
   */
  async getProfile() {
    return prisma.profile.findFirst({
      where: { slug: 'default' },
    });
  }

  /**
   * Creates the profile. Throws error if a profile already exists.
   */
  async createProfile(data: CreateProfileInput) {
    const existing = await prisma.profile.findFirst({
      where: { slug: data.slug || 'default' },
    });

    if (existing) {
      throw new Error('A portfolio profile already exists. Use update instead.');
    }

    return prisma.profile.create({
      data: {
        slug: data.slug || 'default',
        name: data.name.trim(),
        headline: data.headline.trim(),
        shortBio: data.shortBio.trim(),
        about: data.about.trim(),
        location: data.location.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        profileImage: data.profileImage?.trim() || null,
        resumeUrl: data.resumeUrl?.trim() || null,
      },
    });
  }

  /**
   * Updates the profile (either by ID or singleton default).
   */
  async updateProfile(idOrSlug: string | undefined, data: UpdateProfileInput) {
    let profile = null;

    if (idOrSlug && idOrSlug !== 'default') {
      profile = await prisma.profile.findUnique({ where: { id: idOrSlug } });
    }

    if (!profile) {
      profile = await prisma.profile.findFirst({ where: { slug: 'default' } });
    }

    if (!profile) {
      throw new Error('Profile not found');
    }

    return prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.headline !== undefined && { headline: data.headline.trim() }),
        ...(data.shortBio !== undefined && { shortBio: data.shortBio.trim() }),
        ...(data.about !== undefined && { about: data.about.trim() }),
        ...(data.location !== undefined && { location: data.location.trim() }),
        ...(data.email !== undefined && { email: data.email.trim().toLowerCase() }),
        ...(data.phone !== undefined && { phone: data.phone ? data.phone.trim() : null }),
        ...(data.profileImage !== undefined && { profileImage: data.profileImage ? data.profileImage.trim() : null }),
        ...(data.resumeUrl !== undefined && { resumeUrl: data.resumeUrl ? data.resumeUrl.trim() : null }),
      },
    });
  }

  /**
   * Deletes the profile.
   */
  async deleteProfile(idOrSlug?: string) {
    let profile = null;

    if (idOrSlug && idOrSlug !== 'default') {
      profile = await prisma.profile.findUnique({ where: { id: idOrSlug } });
    }

    if (!profile) {
      profile = await prisma.profile.findFirst({ where: { slug: 'default' } });
    }

    if (!profile) {
      throw new Error('Profile not found');
    }

    return prisma.profile.delete({
      where: { id: profile.id },
    });
  }

  /**
   * Retrieves public profile information without internal fields.
   */
  async getPublicProfile() {
    const profile = await prisma.profile.findFirst({
      where: { slug: 'default' },
      select: {
        name: true,
        headline: true,
        shortBio: true,
        about: true,
        location: true,
        email: true,
        phone: true,
        profileImage: true,
        resumeUrl: true,
      },
    });

    return profile;
  }
}

export const profileService = new ProfileService();
export default profileService;
