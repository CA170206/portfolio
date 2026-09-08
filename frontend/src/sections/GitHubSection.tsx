import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Code2,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon } from '../components/icons/SocialIcons';
import { githubPreviewRepos, socialLinks } from '../data/socials';

const GITHUB_USERNAME = 'CA170206';

const CONTRIBUTIONS_URL =
  `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const contributionColors = {
  0: 'bg-slate-200 dark:bg-[#161b22] border-slate-300 dark:border-[#21262d]',
  1: 'bg-[#9be9a8] dark:bg-[#0e4429] border-[#9be9a8] dark:border-[#0e4429]',
  2: 'bg-[#40c463] dark:bg-[#006d32] border-[#40c463] dark:border-[#006d32]',
  3: 'bg-[#30a14e] dark:bg-[#26a641] border-[#30a14e] dark:border-[#26a641]',
  4: 'bg-[#216e39] dark:bg-[#39d353] border-[#216e39] dark:border-[#39d353]',
};

const getColor = (level: number) => {
  return contributionColors[level as keyof typeof contributionColors] || contributionColors[0];
};

const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

interface ContributionItem {
  date: string;
  count: number;
  level: number;
  outsideRange?: boolean;
}

export const GitHubSection: React.FC = () => {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const githubUrl =
    socialLinks.find((item) => item.platform === 'GitHub')?.url ||
    `https://github.com/${GITHUB_USERNAME}`;

  useEffect(() => {
    let cancelled = false;

    const loadContributions = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(CONTRIBUTIONS_URL);

        if (!response.ok) {
          throw new Error('GitHub contribution request failed');
        }

        const data = await response.json();

        if (!Array.isArray(data.contributions)) {
          throw new Error('Invalid contribution data');
        }

        if (cancelled) return;

        const sortedContributions = [...data.contributions].sort(
          (a: ContributionItem, b: ContributionItem) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setContributions(sortedContributions);

        const total =
          data.total?.lastYear ??
          sortedContributions.reduce(
            (sum: number, item: ContributionItem) => sum + Number(item.count || 0),
            0
          );

        setTotalContributions(total);
      } catch (err) {
        if (!cancelled) {
          console.error('GitHub contribution error:', err);
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadContributions();

    return () => {
      cancelled = true;
    };
  }, []);

  const calendar = useMemo(() => {
    if (!contributions.length) {
      return {
        weeks: [] as ContributionItem[][],
        months: [] as { weekIndex: number; label: string }[],
      };
    }

    const contributionMap = new Map<string, ContributionItem>();

    contributions.forEach((item) => {
      contributionMap.set(item.date, item);
    });

    const firstDate = new Date(
      `${contributions[0].date}T00:00:00`
    );

    const lastDate = new Date(
      `${contributions[contributions.length - 1].date}T00:00:00`
    );

    firstDate.setDate(
      firstDate.getDate() - firstDate.getDay()
    );

    lastDate.setDate(
      lastDate.getDate() + (6 - lastDate.getDay())
    );

    const weeks: ContributionItem[][] = [];
    const months: { weekIndex: number; label: string }[] = [];

    let currentDate = new Date(firstDate);
    let currentWeek: ContributionItem[] = [];
    let lastMonthKey: string | null = null;

    while (currentDate <= lastDate) {
      const dateKey = currentDate.toISOString().split('T')[0];

      const contribution = contributionMap.get(dateKey);

      currentWeek.push(
        contribution || {
          date: dateKey,
          count: 0,
          level: 0,
          outsideRange: true,
        }
      );

      if (currentDate.getDate() <= 7) {
        const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

        if (monthKey !== lastMonthKey) {
          months.push({
            weekIndex: weeks.length,
            label: MONTHS[currentDate.getMonth()],
          });

          lastMonthKey = monthKey;
        }
      }

      if (currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      weeks,
      months,
    };
  }, [contributions]);

  return (
    <section
      id="github"
      className="relative overflow-hidden bg-slate-50 dark:bg-[#12161b] py-24 transition-colors duration-200"
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">

            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#d6a83a]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
                GitHub
              </span>
            </div>

            <div className="flex items-center gap-4">
              <GithubIcon className="h-9 w-9 text-slate-900 dark:text-[#f4f5f6]" />

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-4xl">
                Code & repositories.
              </h2>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-[#aeb6c0] sm:text-base">
              A selection of projects and repositories I've worked on,
              alongside my GitHub contribution activity.
            </p>
          </div>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 border border-slate-300 dark:border-[#3a424b] bg-white dark:bg-[#181d23] px-5 py-3 text-sm font-medium text-slate-800 dark:text-[#f4f5f6] shadow-sm dark:shadow-none transition-all duration-200 hover:border-[#d6a83a] hover:text-[#b48316] dark:hover:text-[#d6a83a]"
          >
            <GithubIcon className="h-4 w-4" />

            <span>Visit GitHub</span>

            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Repository Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {githubPreviewRepos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="group block"
            >
              <article className="h-full border border-slate-200 dark:border-[#303841] bg-white dark:bg-[#181d23] p-6 shadow-sm dark:shadow-none transition-all duration-200 hover:-translate-y-1 hover:border-[#d6a83a]/70 hover:bg-slate-50 dark:hover:bg-[#1b2026] sm:p-7">

                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200 dark:border-[#3a424b] bg-slate-50 dark:bg-[#12161b] text-[#b48316] dark:text-[#d6a83a]">
                      <Code2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-[#f4f5f6] transition-colors group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]">
                        {repo.name}
                      </h3>

                      <p className="mt-1 text-xs uppercase tracking-wider text-slate-500 dark:text-[#7f8995]">
                        {repo.type} · {repo.language}
                      </p>
                    </div>
                  </div>

                  <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 dark:text-[#7f8995] transition-colors group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                </div>

                <p className="mt-6 min-h-[72px] text-sm leading-6 text-slate-600 dark:text-[#aeb6c0]">
                  {repo.description}
                </p>

                <div className="mt-6 border-t border-slate-200 dark:border-[#303841] pt-5">
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {repo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#8f99a5]"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d6a83a]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#b48316] dark:text-[#d6a83a]">
                  View repository

                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>

              </article>
            </motion.a>
          ))}
        </div>

        {/* Contribution Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mt-6 border border-slate-200 dark:border-[#303841] bg-white dark:bg-[#181d23] shadow-sm dark:shadow-none"
        >

          {/* Calendar Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-[#303841] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#d6a83a]" />

                <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f4f5f6]">
                  Contribution activity
                </h3>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-[#7f8995]">
                {loading
                  ? 'Loading GitHub activity...'
                  : error
                    ? 'Unable to load GitHub activity'
                    : `${totalContributions.toLocaleString()} contributions in the last year`}
              </p>
            </div>

            {!loading && !error && (
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-[#7f8995]">
                <span>Less</span>

                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`h-3 w-3 rounded-[2px] border ${getColor(level)}`}
                  />
                ))}

                <span>More</span>
              </div>
            )}

            {loading && (
              <RefreshCw className="h-4 w-4 animate-spin text-[#d6a83a]" />
            )}
          </div>

          {/* Calendar */}
          <div className="overflow-x-auto px-5 py-7 sm:px-6">

            {loading ? (
              <div className="flex h-36 items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-[#7f8995]">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#d6a83a]" />
                  Loading contribution calendar...
                </div>
              </div>
            ) : error ? (
              <div className="flex h-36 flex-col items-center justify-center text-center">
                <GithubIcon className="mb-3 h-6 w-6 text-slate-400 dark:text-[#69737e]" />

                <p className="text-sm text-slate-600 dark:text-[#aeb6c0]">
                  Contribution activity couldn't be loaded right now.
                </p>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-xs text-[#b48316] dark:text-[#d6a83a] hover:underline"
                >
                  View GitHub profile
                </a>
              </div>
            ) : (
              <div className="min-w-[760px]">

                {/* Month Labels */}
                <div className="relative ml-10 mb-2 h-4">
                  {calendar.months.map((month, index) => (
                    <span
                      key={`${month.label}-${month.weekIndex}-${index}`}
                      className="absolute text-[10px] text-slate-500 dark:text-[#7f8995]"
                      style={{
                        left: `${month.weekIndex * 14}px`,
                      }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="flex">

                  {/* Weekday Labels */}
                  <div className="mr-2 flex w-8 shrink-0 flex-col justify-between py-0.5">
                    <span className="text-[9px] text-slate-400 dark:text-[#69737e]">
                      Mon
                    </span>

                    <span className="text-[9px] text-slate-400 dark:text-[#69737e]">
                      Wed
                    </span>

                    <span className="text-[9px] text-slate-400 dark:text-[#69737e]">
                      Fri
                    </span>
                  </div>

                  {/* Contribution Grid */}
                  <div className="flex gap-[3px]">
                    {calendar.weeks.map((week, weekIndex) => (
                      <div
                        key={`week-${weekIndex}`}
                        className="flex w-[11px] flex-col gap-[3px]"
                      >
                        {week.map((day) => (
                          <div
                            key={day.date}
                            title={
                              day.outsideRange
                                ? ''
                                : `${day.count} contribution${
                                    day.count === 1 ? '' : 's'
                                  } · ${formatDate(day.date)}`
                            }
                            className={`h-[11px] w-[11px] rounded-[2px] border ${getColor(
                              day.level
                            )} ${
                              day.outsideRange
                                ? 'opacity-0'
                                : 'cursor-default transition-transform duration-100 hover:scale-125'
                            }`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Calendar Footer */}
          {!loading && !error && (
            <div className="border-t border-slate-200 dark:border-[#303841] px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-2 text-[11px] text-slate-500 dark:text-[#69737e] sm:flex-row sm:items-center sm:justify-between">

                <span>
                  Public contribution activity from @{GITHUB_USERNAME}
                </span>

                <a
                  href={`https://github.com/${GITHUB_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#b48316] dark:text-[#d6a83a] hover:underline"
                >
                  github.com/{GITHUB_USERNAME}
                </a>

              </div>
            </div>
          )}

        </motion.div>

        {/* Bottom Profile Row */}
        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 dark:border-[#303841] pt-7 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500 dark:text-[#7f8995]">
            More projects and repositories are available on my GitHub profile.
          </p>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 text-sm font-medium text-slate-900 dark:text-[#f4f5f6] transition-colors hover:text-[#b48316] dark:hover:text-[#d6a83a]"
          >
            @{GITHUB_USERNAME}

            <ArrowUpRight className="h-4 w-4" />
          </a>

        </div>
      </div>
    </section>
  );
};