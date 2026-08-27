import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import AuthPanel from './AuthPanel';
import FormField from './FormField';
import TechnicalBackground from '../home/sections/TechnicalBackground';
import { login, setCurrentUser } from '../../services/authApi';

const SignInPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(event.target);
    const email = formData.get('email')?.trim().toLowerCase();
    const password = formData.get('password');

    try {
      const response = await login({ email, password });
      setCurrentUser(response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-grain relative min-h-screen overflow-hidden bg-[#111317]">

      {/* HeroSection background — background only */}
      <div className="pointer-events-none absolute inset-0 z-0">

        {/* Grid Background */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Whitish Glow Effect */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute h-full w-full bg-white/20 blur-[300px]" />
          <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/5 blur-[100px]" />
        </div>

        {/* Technical Background */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <TechnicalBackground />
        </div>

      </div>

      {/* EXISTING SIGN-IN PAGE — UNCHANGED */}
      <div className="relative z-10">
        <AuthLayout
          eyebrow="Operator login"
          title="Enter The Console"
          subtitle="Keep the command center close: monitors, incidents, status pages, and settings in one responsive route shell."
        >
          <AuthPanel
            footerHref="/signup"
            footerLabel="Create account"
            footerText="New operator?"
            icon={ShieldCheck}
            onSubmit={handleSubmit}
            title="Sign In"
          >
            <div className="grid gap-4">
              {error && (
                <div className="rounded border-2 border-red-500 bg-red-50 p-3 text-sm font-bold text-red-700">
                  {error}
                </div>
              )}

              <FormField
                autoComplete="email"
                icon={Mail}
                label="Email"
                name="email"
                placeholder="you@example.com"
                type="email"
              />

              <FormField
                autoComplete="current-password"
                icon={LockKeyhole}
                label="Password"
                name="password"
                placeholder="Access key"
                type="password"
              />

              <div className="hidden flex-col gap-3 text-sm font-black sm:flex sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2">
                  <input
                    className="h-5 w-5 accent-[#00E676]"
                    type="checkbox"
                  />
                  Remember signal
                </label>

                <Link
                  to="/signup"
                  className="uppercase italic text-[#1E6BFF] underline decoration-[3px] underline-offset-4"
                >
                  Recover access
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group mt-1 inline-flex h-12 min-w-0 items-center justify-between gap-3 border-[3px] border-black bg-[#00E676] px-3 text-sm font-black uppercase italic shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-2 sm:h-13 sm:border-[4px] sm:px-4 sm:text-base sm:shadow-[6px_6px_0_#000]"
              >
                <span className="truncate">
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </span>

                <ArrowRight
                  size={20}
                  strokeWidth={3}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </AuthPanel>
        </AuthLayout>
      </div>
    </div>
  );
};

export default SignInPage;