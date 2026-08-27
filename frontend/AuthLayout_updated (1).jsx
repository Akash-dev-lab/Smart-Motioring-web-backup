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
        <header className="flex items-center justify-between gap-3 border-[3px] border-black bg-white px-3 py-2 shadow-[5px_5px_0_#000] sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Drishyam home">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border-[3px] border-black bg-[#FFD600] font-black italic shadow-[3px_3px_0_#000]">
              <span className="absolute inset-x-0 top-0 h-2 border-b-[3px] border-black bg-[#00E676]" />
              D
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-black uppercase italic leading-none">Drishyam</span>
              <span className="mt-1 hidden truncate text-[9px] font-black uppercase tracking-[0.18em] text-black/55 sm:block">
                Monitor OS
              </span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-[#FDFBF7] px-3 text-xs font-black uppercase italic shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5 sm:px-4"
          >
            <ArrowLeft size={16} strokeWidth={3} />
            <span className="hidden min-[420px]:inline">Home</span>
          </Link>
        </header>

        <section className="grid min-w-0 flex-1 items-center py-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,480px)] lg:gap-8 lg:py-8">
          <div className="hidden min-w-0 gap-4 lg:order-1 lg:grid">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex border-[3px] border-black bg-[#FFD600] px-3 py-1 text-[10px] font-black uppercase italic tracking-[0.18em] shadow-[4px_4px_0_#000]">
                {eyebrow}
              </p>
              <h1
                className="max-w-[11ch] text-[clamp(3rem,11vw,7.4rem)] font-black uppercase italic leading-[0.82] text-[#FFD600] drop-shadow-[4px_4px_0_black]"
                style={{ WebkitTextStroke: '2px black' }}
              >
                {title}
              </h1>
              <p className="mt-4 max-w-xl border-l-[6px] border-black bg-white/90 p-4 text-sm font-black uppercase italic leading-6 shadow-[5px_5px_0_#000] sm:text-base">
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
