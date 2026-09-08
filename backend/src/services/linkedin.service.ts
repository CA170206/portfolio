import prisma from '../config/prisma';

export interface UpdateLinkedinInput {
  profileUrl?: string;
  followers?: string;
  connections?: string;
  role?: string;
  company?: string;
  location?: string;
  education?: string;
}

export class LinkedinService {
  /**
   * Retrieves the stored LinkedIn settings or initializes default if missing.
   */
  async getLinkedinData() {
    let data = await prisma.linkedinData.findFirst();
    if (!data) {
      data = await prisma.linkedinData.create({
        data: {
          profileUrl: 'https://linkedin.com/in/chaitanya-anmulwar',
          followers: '1000+',
          connections: '500+',
          role: 'Web Development Intern',
          company: 'Labmentix',
          location: 'Greater Nashik Area',
          education: 'B.Tech CSE',
        },
      });
    }
    return data;
  }

  /**
   * Updates LinkedIn settings.
   */
  async updateLinkedinData(input: UpdateLinkedinInput) {
    let data = await prisma.linkedinData.findFirst();
    if (!data) {
      data = await prisma.linkedinData.create({
        data: {
          profileUrl: input.profileUrl?.trim() || 'https://linkedin.com/in/chaitanya-anmulwar',
          followers: input.followers?.trim() || '1000+',
          connections: input.connections?.trim() || '500+',
          role: input.role?.trim() || 'Web Development Intern',
          company: input.company?.trim() || 'Labmentix',
          location: input.location?.trim() || 'Greater Nashik Area',
          education: input.education?.trim() || 'B.Tech CSE',
        },
      });
      return data;
    }

    return prisma.linkedinData.update({
      where: { id: data.id },
      data: {
        ...(input.profileUrl !== undefined && { profileUrl: input.profileUrl.trim() }),
        ...(input.followers !== undefined && { followers: input.followers.trim() }),
        ...(input.connections !== undefined && { connections: input.connections.trim() }),
        ...(input.role !== undefined && { role: input.role.trim() }),
        ...(input.company !== undefined && { company: input.company.trim() }),
        ...(input.location !== undefined && { location: input.location.trim() }),
        ...(input.education !== undefined && { education: input.education.trim() }),
      },
    });
  }

  /**
   * Safe public payload for public portfolio consumption.
   */
  async getPublicLinkedinData() {
    const data = await this.getLinkedinData();
    return {
      profileUrl: data.profileUrl,
      followers: data.followers,
      connections: data.connections,
      role: data.role,
      company: data.company,
      location: data.location,
      education: data.education,
    };
  }
}

export const linkedinService = new LinkedinService();
export default linkedinService;
