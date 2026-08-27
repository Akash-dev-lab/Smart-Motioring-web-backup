import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TechnicalBackground from '../home/sections/TechnicalBackground';

const AuthLayout = ({ children, eyebrow, title, subtitle }) => {
  return (
    <main className="bg-grain relative min-h-screen overflow-hidden bg-[#111317] px-3 py-4 font-mono text-black sm:px-5 sm:py-6 lg:px-8">
      {/* HeroSection background — background only */}
      <div className="pointer-events-none absolute inset-0 z-0">

        {/* Grid */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Whitish glow */}
        <div className="absolute inset-0 z-[2]">
          <div className="absolute h-full w-full bg-white/20 blur-[300px]" />
          <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/5 blur-[100px]" />
        </div>

        {/* Technical paths */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <TechnicalBackground />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col">
        <header
          className="
    relative z-30
    flex w-full items-center justify-between
    rounded-2xl
    border border-white/[0.09]
    bg-[#081326]/55
    px-3 py-2.5
    shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
    backdrop-blur-lg
    sm:px-4 sm:py-3
    lg:px-5
  "
        >
          {/* =====================================================
      BRAND
  ===================================================== */}
          <Link
            to="/"
            className="
      inline-flex min-w-0 items-center gap-2.5
      text-[#eef1f7]
      transition-opacity duration-300
      hover:opacity-90
    "
          >
            {/* Logo */}
            <span
              className="
        relative grid h-10 w-10 shrink-0
        place-items-center
        overflow-hidden
        rounded-xl
        border border-[#75ff9e]/30
        bg-[#0b1730]/60
        text-lg font-bold
        text-[#75ff9e]
        shadow-[inset_0_0_18px_rgba(160,120,255,0.08)]
        sm:h-11 sm:w-11
        sm:rounded-2xl
        sm:text-xl
      "
              style={{
                fontFamily: "Geist, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              D
            </span>

            {/* Brand text */}
            <span className="min-w-0">
              <span
                className="
          block truncate
          text-base font-semibold
          leading-none
          uppercase
          text-[#4ae176]
          sm:text-lg
        "
                style={{
                  fontFamily: "Manrope, sans-serif",
                  letterSpacing: "-0.01em",
                }}
              >
                Smart Monitoring
              </span>

              <span
                className="
          mt-1 block truncate
          text-[8px] font-medium
          uppercase
          tracking-[0.05em]
          text-[#8e9ab0]
          sm:text-[9px]
        "
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.05em",
                }}
              >
                Monitor OS
              </span>
            </span>
          </Link>

          {/* =====================================================
      HOME ACTION
  ===================================================== */}
          <Link
            to="/"
            className="
      inline-flex h-10
      items-center justify-center
      gap-1.5
      rounded-xl
      border border-white/[0.12]
      bg-white/[0.035]
      px-3
      text-[11px] font-medium
      uppercase
      text-[#e1e6ee]
      backdrop-blur-md
      transition-all duration-300
      hover:border-white/[0.20]
      hover:bg-white/[0.07]
      hover:text-white
      sm:gap-2
      sm:px-4
      sm:text-xs
    "
            style={{
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />

            <span className="hidden min-[420px]:inline">
              Home
            </span>
          </Link>
        </header>

        <section className="grid min-w-0 flex-1 items-center py-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,480px)] lg:gap-8 lg:py-8">
          <div className="hidden min-w-0 gap-4 lg:order-1 lg:grid">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex border-[3px] border-black bg-[#FFD600] px-3 py-1 text-[10px] font-black uppercase italic tracking-[0.18em] shadow-[4px_4px_0_#000]">
                {eyebrow}
              </p>
              <h1
                className="max-w-[11ch] text-[clamp(3rem,11vw,7.4rem)] font-black uppercase italic leading-[0.82] text-[#ffffff] drop-shadow-[4px_4px_0_black]"
                style={{ WebkitTextStroke: '2px black' }}
              >
                {title}
              </h1>
              <p className="mt-4 max-w-xl border-l-[6px] text-green-500 p-4 text-sm font-black uppercase italic leading-6 sm:text-base">
                {subtitle}
              </p>
            </div>

          </div>

          <div className="min-w-0 lg:order-2">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;
