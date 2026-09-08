import prisma from '../config/prisma';

export interface ContributionItem {
  date: string;
  count: number;
  level: number;
}

export interface UpdateGithubInput {
  username?: string;
  profileUrl?: string;
}

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export class GithubService {
  /**
   * Retrieves the stored GitHub data or initializes default if missing.
   */
  async getGithubData() {
    let data = await prisma.githubData.findFirst();
    if (!data) {
      data = await prisma.githubData.create({
        data: {
          username: 'CA170206',
          profileUrl: 'https://github.com/CA170206',
          totalContributions: 0,
        },
      });
    }
    return data;
  }

  /**
   * Updates the configured GitHub username and profile URL.
   */
  async updateGithubData(input: UpdateGithubInput) {
    let data = await prisma.githubData.findFirst();
    if (!data) {
      data = await prisma.githubData.create({
        data: {
          username: input.username?.trim() || 'CA170206',
          profileUrl: input.profileUrl?.trim() || 'https://github.com/CA170206',
          totalContributions: 0,
        },
      });
      return data;
    }

    return prisma.githubData.update({
      where: { id: data.id },
      data: {
        ...(input.username !== undefined && { username: input.username.trim() }),
        ...(input.profileUrl !== undefined && { profileUrl: input.profileUrl.trim() }),
      },
    });
  }

  /**
   * Synchronizes real GitHub contribution activity.
   * Priority:
   * 1. Official GitHub GraphQL API if GITHUB_TOKEN is configured in backend environment.
   * 2. Public activity service if GITHUB_TOKEN is not set.
   * On failure: Preserves previous data without destructive overwrite.
   */
  async syncGithubActivity() {
    const data = await this.getGithubData();
    const username = data.username.trim();

    if (!username) {
      throw new Error('GitHub username is not configured.');
    }

    const token = process.env.GITHUB_TOKEN?.trim();
    let totalContributions = 0;
    let contributions: ContributionItem[] = [];
    let usedMethod = 'official_graphql';

    if (token) {
      // Use official GitHub GraphQL API
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'Portfolio-App',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: { login: username },
          }),
        });

        if (!response.ok) {
          const status = response.status;
          if (status === 401 || status === 403) {
            throw new Error('GitHub token authentication failed or rate limit exceeded.');
          }
          throw new Error(`GitHub GraphQL API returned status ${status}.`);
        }

        const json = await response.json();

        if (json.errors && json.errors.length > 0) {
          throw new Error(json.errors[0]?.message || 'GitHub GraphQL returned errors.');
        }

        const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar || !Array.isArray(calendar.weeks)) {
          throw new Error(`User @${username} not found or contribution calendar is unavailable.`);
        }

        totalContributions = calendar.totalContributions ?? 0;

        for (const week of calendar.weeks) {
          if (Array.isArray(week.contributionDays)) {
            for (const day of week.contributionDays) {
              contributions.push({
                date: day.date,
                count: Number(day.contributionCount || 0),
                level: LEVEL_MAP[day.contributionLevel] ?? 0,
              });
            }
          }
        }
      } catch (gqlError: unknown) {
        const msg = gqlError instanceof Error ? gqlError.message : 'Unknown GraphQL error';
        console.warn(`[GitHub GraphQL Sync Failed]: ${msg}. Retrying with public activity service fallback...`);
        // Fallback to public service if GraphQL fails
        token && (usedMethod = 'fallback_public');
        contributions = await this.fetchPublicContributions(username);
        totalContributions = contributions.reduce((sum, item) => sum + item.count, 0);
      }
    } else {
      // GITHUB_TOKEN not configured in backend: use public contribution service
      usedMethod = 'public_service';
      try {
        contributions = await this.fetchPublicContributions(username);
        totalContributions = contributions.reduce((sum, item) => sum + item.count, 0);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to retrieve activity';
        throw new Error(
          `GitHub synchronization failed: ${message}. GITHUB_TOKEN is not configured in backend environment variables. Please add GITHUB_TOKEN to enable official authenticated GraphQL sync.`
        );
      }
    }

    if (!Array.isArray(contributions) || contributions.length === 0) {
      throw new Error('No contribution data could be retrieved from GitHub. Previous data preserved.');
    }

    // Sort contributions chronologically
    contributions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Update database record safely
    const updated = await prisma.githubData.update({
      where: { id: data.id },
      data: {
        totalContributions,
        contributionsData: contributions as unknown as object,
        lastSyncedAt: new Date(),
      },
    });

    return {
      updated,
      method: usedMethod,
      count: contributions.length,
      totalContributions,
    };
  }

  /**
   * Helper to retrieve contribution calendar from public service.
   */
  private async fetchPublicContributions(username: string): Promise<ContributionItem[]> {
    const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Portfolio-App',
      },
    });

    if (!res.ok) {
      throw new Error(`Public activity service responded with status ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data.contributions)) {
      throw new Error('Invalid format returned by contribution service');
    }

    return data.contributions.map((item: { date: string; count: number; level?: number }) => ({
      date: item.date,
      count: Number(item.count || 0),
      level: Number(item.level ?? 0),
    }));
  }

  /**
   * Safe public payload for frontend consumption.
   */
  async getPublicGithubData() {
    const data = await this.getGithubData();
    return {
      username: data.username,
      profileUrl: data.profileUrl,
      totalContributions: data.totalContributions,
      contributions: (data.contributionsData as unknown as ContributionItem[]) || [],
      lastSyncedAt: data.lastSyncedAt,
    };
  }
}

export const githubService = new GithubService();
export default githubService;
