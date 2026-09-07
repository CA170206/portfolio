import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  Database,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { skillsData } from '../data/skills';

export const Skills: React.FC = () => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'frontend':
        return <Code2 className="w-5 h-5" />;
      case 'backend':
        return <Server className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'tools':
        return <Wrench className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#12161b] transition-colors duration-200"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#d6a83a]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
              Skills
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Technologies I work with.
          </h2>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-[#aeb6c0]">
            A practical technical stack built through real-world projects,
            internship work, and continuous development.
          </p>
        </motion.div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skillsData.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="group"
            >
              <div className="h-full rounded-2xl border border-slate-200 dark:border-[#303841] bg-white dark:bg-[#181c21] p-6 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-[#47525f]">
                {/* Category heading */}
                <div className="flex items-start gap-4 mb-7">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/30 dark:border-[#39434d] bg-amber-50 dark:bg-[#20262d] text-[#b48316] dark:text-[#d6a83a]">
                    {getCategoryIcon(category.id)}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-[#f4f5f6]">
                      {category.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-[#89939f]">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Skills list */}
                <div className="border-t border-slate-200 dark:border-[#303841] pt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 dark:border-[#252c33] last:border-b-0"
                      >
                        <span
                          className={`text-sm ${
                            skill.highlight
                              ? 'text-slate-900 dark:text-[#f0f2f4] font-medium'
                              : 'text-slate-600 dark:text-[#b7bec7]'
                          }`}
                        >
                          {skill.name}
                        </span>

                        {skill.highlight && (
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#d6a83a]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex items-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-[#d6a83a]" />

          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#707b87]">
            Highlighted technologies are part of my primary working stack.
          </p>
        </motion.div>
      </div>
    </section>
  );
};