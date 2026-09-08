import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/icons/SocialIcons';
import { profileData } from '../data/profile';
import { socialLinks } from '../data/socials';

interface ContactProps {
  onShowToast?: (message: string, type?: 'success' | 'info') => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const github =
    socialLinks.find((item) => item.platform === 'GitHub')?.url ||
    'https://github.com/CA170206';

  const linkedin =
    socialLinks.find((item) => item.platform === 'LinkedIn')?.url ||
    'https://linkedin.com/in/chaitanya-anmulwar';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileData.email);

      setCopied(true);

      if (onShowToast) {
        onShowToast(
          `Copied ${profileData.email} to clipboard!`,
          'success'
        );
      }

      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('Unable to copy email:', error);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter a message';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const subject = encodeURIComponent(
      formData.subject || `Inquiry from ${formData.name}`
    );

    const body = encodeURIComponent(
      `Hi Chaitanya,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`
    );

    window.location.href =
      `mailto:${profileData.email}?subject=${subject}&body=${body}`;

    if (onShowToast) {
      onShowToast(
        'Opening your email client to send the message...',
        'info'
      );
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,
        [field]: '',
      }));
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-50 dark:bg-[#12161b] py-24 transition-colors duration-200"
    >
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#8b949e 1px, transparent 1px), linear-gradient(90deg, #8b949e 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#d6a83a]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b48316] dark:text-[#d6a83a]">
              Contact
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-[#f4f5f6] sm:text-5xl">
            Let's talk.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 dark:text-[#8f99a5] sm:text-base">
            Have a project, opportunity, or idea worth discussing?
            Drop me a message and let's start a conversation.
          </p>
        </motion.div>

        {/* Main contact layout */}
        <div className="grid grid-cols-1 border-y border-slate-200 dark:border-[#303841] lg:grid-cols-12">
          {/* Left information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-b border-slate-200 dark:border-[#303841] py-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:pr-12"
          >
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#b48316] dark:text-[#d6a83a]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-[#aeb6c0]">
                Get in touch
              </span>
            </div>

            <h3 className="mt-7 max-w-md text-2xl font-semibold leading-tight text-slate-900 dark:text-[#f4f5f6] sm:text-3xl">
              Have something in mind?
            </h3>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-[#7f8995]">
              Whether it's a development project, collaboration,
              internship opportunity, or simply a conversation about
              technology, feel free to reach out.
            </p>

            {/* Email */}
            <div className="mt-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-[#69737e]">
                Email
              </p>

              <div className="mt-3 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-[#303841] pb-4">
                <span className="min-w-0 truncate text-sm font-medium text-slate-900 dark:text-[#f4f5f6]">
                  {profileData.email}
                </span>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex shrink-0 items-center gap-2 text-xs font-medium text-slate-600 dark:text-[#8f99a5] transition-colors hover:text-[#b48316] dark:hover:text-[#d6a83a]"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#d6a83a]" />
                      <span className="text-[#b48316] dark:text-[#d6a83a]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="mt-7 flex items-start gap-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#b48316] dark:text-[#d6a83a]" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-[#69737e]">
                  Location
                </p>

                <p className="mt-2 text-sm text-slate-700 dark:text-[#aeb6c0]">
                  {profileData.location}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mt-6 flex items-start gap-4">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#d6a83a]" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-[#69737e]">
                  Current status
                </p>

                <p className="mt-2 text-sm text-slate-700 dark:text-[#aeb6c0]">
                  {profileData.status}
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-10 border-t border-slate-200 dark:border-[#303841] pt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-[#69737e]">
                Elsewhere
              </p>

              <div className="mt-5 flex flex-wrap gap-6">
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-[#aeb6c0] transition-colors hover:text-slate-950 dark:hover:text-[#f4f5f6]"
                >
                  <GithubIcon className="h-4 w-4" />

                  <span>GitHub</span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-[#69737e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                </a>

                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-[#aeb6c0] transition-colors hover:text-slate-950 dark:hover:text-[#f4f5f6]"
                >
                  <LinkedinIcon className="h-4 w-4" />

                  <span>LinkedIn</span>

                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 dark:text-[#69737e] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#b48316] dark:group-hover:text-[#d6a83a]" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="py-10 lg:col-span-7 lg:pl-12"
          >
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b48316] dark:text-[#d6a83a]">
                Send a message
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-[#7f8995]">
                Fill in the details below. Your default email
                application will open with the message prepared.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Email */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
                  >
                    Your Name <span className="text-[#d6a83a]">*</span>
                  </label>

                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      handleChange('name', event.target.value)
                    }
                    placeholder="Your name"
                    className="w-full border-b border-slate-300 dark:border-[#3a424b] bg-transparent px-0 py-3 text-sm text-slate-900 dark:text-[#f4f5f6] placeholder-slate-400 dark:placeholder-[#59636e] outline-none transition-colors focus:border-[#d6a83a]"
                  />

                  {errors.name && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
                  >
                    Your Email <span className="text-[#d6a83a]">*</span>
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      handleChange('email', event.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full border-b border-slate-300 dark:border-[#3a424b] bg-transparent px-0 py-3 text-sm text-slate-900 dark:text-[#f4f5f6] placeholder-slate-400 dark:placeholder-[#59636e] outline-none transition-colors focus:border-[#d6a83a]"
                  />

                  {errors.email && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
                >
                  Subject
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(event) =>
                    handleChange('subject', event.target.value)
                  }
                  placeholder="What would you like to discuss?"
                  className="w-full border-b border-slate-300 dark:border-[#3a424b] bg-transparent px-0 py-3 text-sm text-slate-900 dark:text-[#f4f5f6] placeholder-slate-400 dark:placeholder-[#59636e] outline-none transition-colors focus:border-[#d6a83a]"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
                >
                  Message <span className="text-[#d6a83a]">*</span>
                </label>

                <textarea
                  id="contact-message"
                  rows={6}
                  value={formData.message}
                  onChange={(event) =>
                    handleChange('message', event.target.value)
                  }
                  placeholder="Write your message here..."
                  className="w-full resize-none border-b border-slate-300 dark:border-[#3a424b] bg-transparent px-0 py-3 text-sm leading-7 text-slate-900 dark:text-[#f4f5f6] placeholder-slate-400 dark:placeholder-[#59636e] outline-none transition-colors focus:border-[#d6a83a]"
                />

                {errors.message && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-5 border-t border-slate-200 dark:border-[#303841] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-[11px] leading-5 text-slate-500 dark:text-[#69737e]">
                  Your message will open in your default email
                  application.
                </p>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 bg-[#d6a83a] px-6 py-3 text-sm font-semibold text-[#12161b] shadow-sm transition-colors hover:bg-[#e2b94f]"
                >
                  Send Message

                  <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};