import React, { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import apiClient from '../api/client';
import {
  isValidAssetUrlOrPath,
  isValidWebOrDocumentUrl,
} from '../utils/assetValidation';
import { resolveAsset } from '../../api/publicPortfolioApi';

interface ProfileFormData {
  id?: string;
  slug?: string;
  name: string;
  headline: string;
  shortBio: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  profileImage: string;
  resumeUrl: string;
  updatedAt?: string;
}

export const ProfileEditor: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    headline: '',
    shortBio: '',
    about: '',
    location: '',
    email: '',
    phone: '',
    profileImage: '',
    resumeUrl: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isNewProfile, setIsNewProfile] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await apiClient.get<ProfileFormData>('/profile');

      if (res.success && res.data) {
        setFormData({
          id: res.data.id,
          slug: res.data.slug || 'default',
          name: res.data.name || '',
          headline: res.data.headline || '',
          shortBio: res.data.shortBio || '',
          about: res.data.about || '',
          location: res.data.location || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          profileImage: res.data.profileImage || '',
          resumeUrl: res.data.resumeUrl || '',
          updatedAt: res.data.updatedAt,
        });

        setIsNewProfile(false);
      } else {
        setIsNewProfile(true);
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to load profile from server. Please check your network connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (statusMessage) {
      setStatusMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Full Name is required.',
      });
      return;
    }

    if (!formData.headline.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Headline / Title is required.',
      });
      return;
    }

    if (!formData.shortBio.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Short Bio is required.',
      });
      return;
    }

    if (!formData.about.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'About description is required.',
      });
      return;
    }

    if (!formData.location.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Location is required.',
      });
      return;
    }

    if (!formData.email.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Email address is required.',
      });
      return;
    }

    if (
      formData.profileImage.trim() &&
      !isValidAssetUrlOrPath(formData.profileImage)
    ) {
      setStatusMessage({
        type: 'error',
        text: 'Profile Image must be a valid external URL (http/https) or local asset path (/src/assets/... or /assets/...).',
      });
      return;
    }

    if (
      formData.resumeUrl.trim() &&
      !isValidWebOrDocumentUrl(formData.resumeUrl)
    ) {
      setStatusMessage({
        type: 'error',
        text: 'Resume URL must be a valid URL, document path, or section anchor.',
      });
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        headline: formData.headline.trim(),
        shortBio: formData.shortBio.trim(),
        about: formData.about.trim(),
        location: formData.location.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        profileImage: formData.profileImage.trim() || null,
        resumeUrl: formData.resumeUrl.trim() || null,
      };

      let res;

      if (isNewProfile) {
        res = await apiClient.post<ProfileFormData>(
          '/profile',
          payload
        );
      } else {
        res = await apiClient.put<ProfileFormData>(
          '/profile',
          payload
        );
      }

      if (res.success && res.data) {
        setFormData({
          id: res.data.id,
          slug: res.data.slug || 'default',
          name: res.data.name || '',
          headline: res.data.headline || '',
          shortBio: res.data.shortBio || '',
          about: res.data.about || '',
          location: res.data.location || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          profileImage: res.data.profileImage || '',
          resumeUrl: res.data.resumeUrl || '',
          updatedAt: res.data.updatedAt,
        });

        setIsNewProfile(false);

        setStatusMessage({
          type: 'success',
          text: 'Profile changes successfully saved and synchronized.',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Failed to save profile changes.',
        });
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'An error occurred while saving.';

      setStatusMessage({
        type: 'error',
        text: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-[#7f8995]">
          <Loader2 className="h-6 w-6 animate-spin text-[#d6a83a]" />

          <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-300 pb-5 dark:border-[#303841] sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-[#d6a83a]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47d18] dark:text-[#d6a83a]">
              Profile
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
            Profile Information
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 dark:text-[#7f8995]">
            Manage the personal information displayed across the
            public portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-4 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          role="alert"
          className={`flex items-start gap-3 border px-4 py-3 text-xs ${statusMessage.type === 'success'
              ? 'border-emerald-500/25 bg-emerald-50 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-300'
              : 'border-red-500/25 bg-red-50 text-red-800 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-300'
            }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
          )}

          <span className="leading-5">
            {statusMessage.text}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Information */}
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-[#d6a83a]" />

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                  Basic identity and professional information
                </p>
              </div>
            </div>

            <span className="text-[9px] uppercase tracking-[0.14em] text-slate-400 dark:text-[#4b5560]">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <Field
              label="Full Name"
              required
              htmlFor="name"
            >
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Chaitanya Anmulwar"
                required
                className={inputClass}
              />
            </Field>

            <Field
              label="Headline / Professional Title"
              required
              htmlFor="headline"
            >
              <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Full Stack & Cloud Developer"
                required
                className={inputClass}
              />
            </Field>

            <Field
              label="Location"
              required
              htmlFor="location"
            >
              <div className="relative">
                <MapPin className={iconClass} />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Nashik, Maharashtra"
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

            <Field
              label="Short Bio"
              required
              htmlFor="shortBio"
              description="Used in compact profile previews."
            >
              <input
                id="shortBio"
                name="shortBio"
                type="text"
                value={formData.shortBio}
                onChange={handleChange}
                placeholder="A concise one-sentence introduction"
                required
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        {/* Contact */}
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <Mail className="h-4 w-4 text-[#d6a83a]" />

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                Contact Details
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                Public contact information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <Field
              label="Public Email"
              required
              htmlFor="email"
            >
              <div className="relative">
                <Mail className={iconClass} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. name@domain.com"
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

            <Field
              label="Phone Number"
              htmlFor="phone"
              optional
            >
              <div className="relative">
                <Phone className={iconClass} />

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Optional phone number"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>
          </div>
        </section>

        {/* Media & Assets */}
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <ImageIcon className="h-4 w-4 text-[#d6a83a]" />

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                Media & Assets
              </h2>

              <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                Profile image and resume references
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <Field
              label="Profile Image"
              htmlFor="profileImage"
              optional
              description="External URL or local asset path."
            >
              <input
                id="profileImage"
                name="profileImage"
                type="text"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="/src/assets/profile/avatar.jpg"
                className={inputClass}
              />

              {formData.profileImage && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-11 w-11 overflow-hidden border border-slate-300 bg-slate-100 dark:border-[#303841] dark:bg-[#12161b]">
                    <img
                      src={resolveAsset(formData.profileImage)}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display =
                          'none';
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-[#aeb6c0]">
                      Image Preview
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                      Current profile image
                    </p>
                  </div>
                </div>
              )}
            </Field>

            <Field
              label="Resume URL / Document Link"
              htmlFor="resumeUrl"
              optional
              description="External document, local file, or valid section link."
            >
              <div className="flex items-center gap-2">
                <input
                  id="resumeUrl"
                  name="resumeUrl"
                  type="text"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://... or /resume.pdf"
                  className={inputClass}
                />

                {formData.resumeUrl && (
                  <a
                    href={formData.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[35px] w-[35px] shrink-0 items-center justify-center border border-slate-300 bg-white text-slate-500 transition-colors hover:border-[#d6a83a] hover:text-slate-900 dark:border-[#303841] dark:bg-[#12161b] dark:text-[#7f8995] dark:hover:border-[#d6a83a] dark:hover:text-[#f4f5f6]"
                    title="Open Resume Link"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </Field>
          </div>
        </section>

        {/* About */}
        <section className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-[#d6a83a]" />

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-800 dark:text-[#f4f5f6]">
                  About
                </h2>

                <p className="mt-0.5 text-[10px] text-slate-400 dark:text-[#7f8995]">
                  Detailed biography displayed on the portfolio
                </p>
              </div>
            </div>

            <span className="font-mono text-[10px] text-slate-400 dark:text-[#7f8995]">
              {formData.about.length} chars
            </span>
          </div>

          <div className="p-5">
            <label
              htmlFor="about"
              className="mb-2 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
            >
              About Content{' '}
              <span className="text-[#d6a83a]">*</span>
            </label>

            <textarea
              id="about"
              name="about"
              rows={8}
              value={formData.about}
              onChange={handleChange}
              placeholder="Full biography, journey, background, and passions displayed on the portfolio..."
              required
              className="w-full resize-y border border-slate-300 bg-white p-3 text-xs leading-6 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]"
            />

            <p className="mt-2 text-[10px] text-slate-400 dark:text-[#7f8995]">
              Markdown or plain text is supported.
            </p>
          </div>
        </section>

        {/* Bottom Save Bar */}
        <div className="flex flex-col gap-3 border-t border-slate-300 pt-4 dark:border-[#303841] sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[10px] font-mono text-slate-400 dark:text-[#7f8995]">
            {formData.updatedAt ? (
              <span>
                Last updated:{' '}
                {new Date(formData.updatedAt).toLocaleString()}
              </span>
            ) : (
              <span>No previous update recorded</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 border border-[#d6a83a] bg-[#d6a83a] px-5 py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving Changes</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const inputClass =
  'w-full border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]';

const iconClass =
  'pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-[#7f8995]';

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({
  label,
  htmlFor,
  required,
  optional,
  description,
  children,
}) => {
  return (
    <div className="border-b border-slate-200 p-5 last:border-b-0 dark:border-[#303841] md:[&:nth-child(odd)]:border-r md:[&:nth-child(-n+2)]:border-b">
      <div className="mb-2">
        <label
          htmlFor={htmlFor}
          className="text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
        >
          {label}{' '}
          {required && (
            <span className="text-[#d6a83a]">*</span>
          )}
          {optional && (
            <span className="ml-1 text-[10px] font-normal text-slate-400 dark:text-[#7f8995]">
              Optional
            </span>
          )}
        </label>

        {description && (
          <p className="mt-1 text-[10px] leading-4 text-slate-400 dark:text-[#7f8995]">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
};

export default ProfileEditor;