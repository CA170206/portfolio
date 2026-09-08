import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your admin email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your admin password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(cleanEmail, password);

      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMessage(
          result.message || 'Invalid email or password.'
        );
      }
    } catch {
      setErrorMessage(
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f3ef] px-5 py-10 text-slate-900 transition-colors dark:bg-[#12161b] dark:text-[#f4f5f6]">
      {/* Subtle technical grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.035] dark:opacity-[0.045]"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Theme control */}
      <div className="absolute right-5 top-5 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center border border-slate-300 bg-[#f8f7f3] text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900 dark:border-[#303841] dark:bg-[#181d23] dark:text-[#aeb6c0] dark:hover:border-[#4b5560] dark:hover:text-[#f4f5f6]"
          title={
            isDark
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
          aria-label={
            isDark
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-[#d6a83a]" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Brand */}
        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#d6a83a] text-[#12161b]">
              <ShieldCheck
                className="h-5 w-5"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
                CA Portfolio
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 dark:text-[#7f8995]">
                Content Management
              </p>
            </div>
          </div>

          <div className="border-l-2 border-[#d6a83a] pl-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47d18] dark:text-[#d6a83a]">
              Administrator access
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f4f5f6]">
              Sign in
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-[#aeb6c0]">
              Access the portfolio content management system.
            </p>
          </div>
        </div>

        {/* Login form */}
        <div className="border border-slate-300 bg-[#faf9f6] dark:border-[#303841] dark:bg-[#181d23]">
          {/* Form header */}
          <div className="border-b border-slate-200 px-5 py-4 dark:border-[#303841]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-[#7f8995]">
              Authentication
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-[#aeb6c0]">
              Enter your administrator credentials to continue.
            </p>
          </div>

          <div className="px-5 py-5">
            {/* Error */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 border border-red-500/25 bg-red-50 px-3 py-2.5 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                <span className="leading-5">
                  {errorMessage}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-[#7f8995]"
                    strokeWidth={1.7}
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="w-full border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-slate-700 dark:text-[#aeb6c0]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-[#7f8995]"
                    strokeWidth={1.7}
                  />

                  <input
                    id="password"
                    type={
                      showPassword ? 'text' : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full border border-slate-300 bg-white py-2.5 pl-9 pr-10 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#d6a83a] dark:border-[#303841] dark:bg-[#12161b] dark:text-[#f4f5f6] dark:placeholder:text-[#4b5560] dark:focus:border-[#d6a83a]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-slate-400 transition-colors hover:text-slate-800 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        className="h-3.5 w-3.5"
                        strokeWidth={1.7}
                      />
                    ) : (
                      <Eye
                        className="h-3.5 w-3.5"
                        strokeWidth={1.7}
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full items-center justify-center gap-2 bg-[#d6a83a] py-2.5 text-xs font-semibold text-[#12161b] transition-colors hover:bg-[#e2b94f] focus:outline-none focus:ring-2 focus:ring-[#d6a83a]/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#12161b] border-t-transparent" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-300 pt-4 dark:border-[#303841]">
          <a
            href="/"
            className="text-[11px] text-slate-500 transition-colors hover:text-slate-900 dark:text-[#7f8995] dark:hover:text-[#f4f5f6]"
          >
            ← Public Portfolio
          </a>

          <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 dark:text-[#4b5560]">
            Secure area
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;