import { useEffect, useRef, useState } from "react";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import TechnicalBackground from "./TechnicalBackground";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Flow", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const HeroSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled more than 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      className="bg-grain relative flex min-h-[720px] w-full flex-col items-center overflow-hidden bg-[#111317] px-3 pb-10 pt-[4.75rem] font-mono sm:min-h-[112svh] sm:px-5 sm:pb-14 sm:pt-[6rem] lg:pt-[6.25rem] max-[380px]:px-2"
      data-scroll
      data-scroll-speed="0.5"
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
        data-scroll
        data-scroll-speed="0.2"
      />
      
      {/* Whitish Glow Effect in Middle */}
      <div 
        className="absolute inset-0 z-2 pointer-events-none"
        data-scroll
        data-scroll-speed="0.1"
      >
        <div className="absolute w-full h-full bg-white/20 blur-[300px]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div
        data-scroll
        data-scroll-speed="0.2"
      >
        <TechnicalBackground />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-3 opacity-[0.11] mix-blend-multiply"
        style={{ backgroundColor: "#cbc3d7" }}
        data-scroll
        data-scroll-speed="0.3"
      >
        <div className="absolute left-1/2 top-1/2 h-[74vmin] w-[74vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5rem] border-black" />
      </div>

      <header 
        ref={navbarRef}
        className={`absolute left-0 top-0 z-30 w-full px-2.5 py-2.5 sm:px-5 sm:py-3 lg:px-8 transition-all duration-500 ${
          isScrolled ? 'navbar-scrolled' : ''
        }`}
      >
  <div
    className="
      mx-auto grid max-w-7xl
      grid-cols-[1fr_auto]
      items-center gap-2
      rounded-[1.1rem]
      border border-white/[0.10]
      bg-[#071326]/45
      px-2.5 py-1.5
      shadow-[0_8px_35px_rgba(0,0,0,0.16)]
      backdrop-blur-xl
      transition-all duration-500
      sm:gap-3
      sm:rounded-[1.35rem]
      sm:px-3
      sm:py-2
      md:grid-cols-[1fr_auto_1fr]
      md:px-4
      hover:border-white/[0.14]
    "
  >
    {/* =====================================================
        BRAND
    ===================================================== */}
    <a
      href="/"
      className="flex min-w-0 items-center gap-2.5 sm:gap-3"
      aria-label="Smart Monitoring home"
    >
      <span
        className="
          relative grid h-10 w-10 shrink-0
          place-items-center overflow-hidden
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
        {/* Tiny status strip */}
        <span
          className="
            absolute inset-x-0 top-0
            h-1.5
            bg-[#4ae176]/20
            border-b border-[#4ae176]/35
          "
        />

        S
      </span>

      <span className="hidden min-w-0 sm:block">
        <span
          className="
            block truncate
            text-lg font-semibold
            leading-none
            text-[#4ae176]
            sm:text-xl
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
            mt-1 hidden truncate
            text-[9px] font-medium
            uppercase tracking-[0.05em]
            text-[#8e9ab0]
            sm:block
          "
          style={{
            fontFamily: "JetBrains Mono, monospace",
            letterSpacing: "0.05em",
          }}
        >
          AI incident command
        </span>
      </span>
    </a>

    {/* =====================================================
        CENTER NAVIGATION
    ===================================================== */}
    <nav
      className="
        hidden items-center
        rounded-full
        border border-white/[0.09]
        bg-[#081326]/35
        p-1
        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        backdrop-blur-lg
        md:flex
      "
      aria-label="Primary navigation"
    >
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="
            rounded-full
            px-4 py-2
            text-xs font-medium
            uppercase tracking-[0.05em]
            text-[#aab4c5]
            transition-all duration-300
            hover:bg-white/[0.06]
            hover:text-[#eef1f7]
          "
          style={{
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>

    {/* =====================================================
        ACCOUNT ACTIONS
    ===================================================== */}
    <nav
      className="flex items-center justify-end gap-2 sm:gap-3"
      aria-label="Account actions"
    >
      {/* Sign In */}
      <a
        href="/signin"
        className="
          inline-flex h-10
          items-center justify-center
          gap-1.5
          rounded-xl
          border border-white/[0.12]
          bg-white/[0.035]
          px-2.5
          text-[11px] font-medium
          text-[#e1e6ee]
          backdrop-blur-md
          transition-all duration-300
          hover:border-white/[0.20]
          hover:bg-white/[0.07]
          hover:text-white
          min-[360px]:px-3
          sm:gap-2
          md:px-4
          md:text-sm
        "
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <LogIn size={16} strokeWidth={2.5} />

        <span className="hidden min-[380px]:inline">
          Sign in
        </span>
      </a>

      {/* Sign Up */}
      <a
        href="/signup"
        className="
          group inline-flex h-10
          items-center justify-center
          gap-1.5
          rounded-xl
          border border-[#75ff9e]/25
          bg-[#75ff9e]/75
          px-2.5
          text-[11px] font-medium
          shadow-[0_6px_20px_rgba(117,87,220,0.16)]
          backdrop-blur-md
          transition-all duration-300
          hover:border-[#75ff9e]/40
          hover:bg-[#75ff9e]/85
          hover:shadow-[0_8px_25px_rgba(117,87,220,0.22)]
          min-[360px]:px-3
          sm:gap-2
          md:px-4
          md:text-sm
        "
        style={{ fontFamily: "Manrope, sans-serif" }}
      >
        <UserPlus
          size={16}
          strokeWidth={2.5}
          className="sm:hidden"
        />

        <span>Sign up</span>

        <ArrowRight
          size={16}
          strokeWidth={2.5}
          className="
            hidden
            transition-transform
            group-hover:translate-x-0.5
            sm:block
          "
        />
      </a>
    </nav>
  </div>
</header>

      {/* Main Hero Content - Two Column Layout */}
      <main 
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-grow items-center justify-center px-6 py-10"
        data-scroll
        data-scroll-speed="0.6"
      >
        <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left Column: Copy */}
          <div className="flex flex-col items-start space-y-8">
            <div className="flex items-center gap-2 rounded-full border border-[#3b4a3d] bg-[#1a1c1f] px-3 py-1">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffe0bc]"></span>
              <span
                className="text-xs font-medium uppercase tracking-[0.05em] text-[#bacbb9]"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  letterSpacing: "0.05em",
                }}
              >
                REAL-TIME OBSERVABILITY
              </span>
            </div>

            <h1
              className="text-5xl font-bold leading-tight text-[#e2e2e6] lg:text-6xl"
              style={{
                fontFamily: "Manrope, sans-serif",
                letterSpacing: "-0.04em",
                lineHeight: "1.17",
                fontWeight: "700",
              }}
            >
              Know when your
              <br />
              systems fail.
            </h1>

            <p
              className="max-w-xl text-base leading-6 text-[#bacbb9]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Real-time website and API monitoring with regional checks,
              incident detection, AI-powered analysis and live status updates.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button className="flex items-center cursor-pointer gap-2 rounded bg-[#4ae176] px-8 py-3 font-medium text-[#00210b] transition-colors hover:bg-[#67fa98]">
                Start Monitoring
                <ArrowRight size={16} />
              </button>
              <button className="rounded border cursor-pointer border-[#859585] px-8 py-3 font-medium text-[#e2e2e6] transition-colors hover:border-[#75ff9e] hover:text-[#75ff9e]">
                View Demo
              </button>
            </div>

            <div className="flex w-full max-w-md items-center gap-3 border-t border-white/10 pt-8">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#75ff9e]"></span>
                <span
                  className="text-xs font-medium uppercase tracking-[0.05em] text-[#bacbb9]"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  MONITORING ACTIVE • REALTIME CONNECTED
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dashboard UI */}
          <div
            className="
    relative flex h-[500px] w-full flex-col overflow-hidden
    rounded-[18px]
    border border-transparent
    bg-transparent
    shadow-[0_0_35px_rgba(74,225,118,0.12)]
    transition-all duration-500
    hover:shadow-[0_0_55px_rgba(117,255,158,0.20)]
  "
            data-scroll
            data-scroll-speed="0.7"
          >
            <div
              className="
      pointer-events-none absolute inset-0 z-0
      rounded-[18px]
      p-[1px]
      bg-gradient-to-br
      from-[#060a10]
      via-[#2d5e26]
      to-[#163720]
      opacity-90
    "
            >
              <div className="h-full w-full rounded-[17px] bg-[#07101d]/35" />
            </div>

            {/* Mac-like Header */}
            <div className="flex h-10 items-center justify-between border-b border-[#75ff9e]/20 bg-white/[0.025] backdrop-blur-xl px-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium tracking-[0.05em] text-white"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  SMART MONITOR
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ae176]"></span>
                <span
                  className="text-[10px] text-[#4ae176]"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  LIVE
                </span>
              </div>
            </div>

            <div className="flex h-full flex-col gap-6 p-6">
              {/* Top Metrics */}
              <div className="flex items-end justify-between border-b border-white/10 text-white z-10 pb-4">
                <div>
                  <div
                    className="mb-1 text-[11px]"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    TARGET
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    api.example.com{" "}
                    <span
                      className="text-xs"
                      style={{ color: "rgba(255, 255, 255, 0.6)" }}
                    >
                      (GET)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="mb-1 inline-block rounded bg-[#4ae176]/10 px-2 py-0.5 text-xs font-medium tracking-[0.05em] text-[#4ae176]"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      letterSpacing: "0.05em",
                    }}
                  >
                    UP
                  </div>
                  <div
                    className="text-[11px]"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    99.98% UPTIME
                  </div>
                </div>
                <div className="hidden text-right sm:block">
                  <div
                    className="mb-1 text-[11px]"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    LATENCY
                  </div>
                  <div
                    className="text-sm"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    142ms
                  </div>
                </div>
                <div className="hidden text-right md:block">
                  <div
                    className="mb-1 text-[11px]"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    CHECKS (1H)
                  </div>
                  <div
                    className="text-sm"
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  >
                    1,284
                  </div>
                </div>
              </div>

              {/* Graph Area */}
              <div className="relative flex flex-grow flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="text-[10px] font-medium tracking-[0.05em]"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      letterSpacing: "0.05em",
                      color: "#ffffff",
                    }}
                  >
                    LIVE LATENCY
                  </span>
                  <span
                    className="text-[10px] font-medium tracking-[0.05em]"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      letterSpacing: "0.05em",
                      color: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    LAST 60 MIN
                  </span>
                </div>
                {/* Simple SVG Graph */}
                <div className="relative grow border-b border-l border-white/10">
                  <svg
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path
                      className="text-[#75ff9e] opacity-50"
                      d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      className="opacity-20"
                      d="M0,100 L0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50 L100,100 Z"
                      fill="url(#grad)"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#d0bcff" stopOpacity="1" />
                        <stop
                          offset="100%"
                          stopColor="#d0bcff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Grid lines */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                    <div className="h-px w-full border-t border-white/5"></div>
                    <div className="h-px w-full border-t border-white/5"></div>
                    <div className="h-px w-full border-t border-white/5"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Regions & Logs */}
              <div className="grid h-32 grid-cols-2 gap-6">
                {/* Regional */}
                <div className="flex z-10 text-white flex-col rounded border border-white/5 bg-[#191c1e] p-3">
                  <div
                    className="mb-3 text-[10px] font-medium tracking-wider"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      letterSpacing: "0.05em",
                    }}
                  >
                    REGIONAL CHECKS
                  </div>
                  <div className="flex flex-grow flex-col justify-between gap-1">
                    <div
                      className="flex items-center justify-between text-[11px]"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      <span style={{ color: "#ffffff" }}>US-EAST</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]"></span>
                    </div>
                    <div
                      className="flex items-center justify-between text-[11px]"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      <span style={{ color: "#ffffff" }}>EU-WEST</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]"></span>
                    </div>
                    <div
                      className="flex items-center justify-between text-[11px]"
                      style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                      <span style={{ color: "#ffffff" }}>AP-SOUTH</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]"></span>
                    </div>
                  </div>
                </div>

                {/* Logs */}
                <div className="relative flex flex-col overflow-hidden rounded border border-white/5 bg-black p-3">
                  <div
                    className="relative z-10 mb-2 bg-black text-[10px] font-medium tracking-[0.05em]"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      letterSpacing: "0.05em",
                      color: "#ffffff",
                    }}
                  >
                    ACTIVITY FEED
                  </div>
                  <div
                    className="relative flex-grow overflow-hidden"
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, black 50%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 50%, transparent 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0 flex flex-col text-[10px] leading-relaxed animate-scroll"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: "#ffffff",
                      }}
                    >
                      <div>14:32:08 CHECK 200 OK - 142ms</div>
                      <div>14:31:08 CHECK 200 OK - 145ms</div>
                      <div>14:30:08 CHECK 200 OK - 139ms</div>
                      <div className="text-[#4ae176]">
                        14:29:08 SYNC COMPLETE
                      </div>
                      <div>14:28:08 CHECK 200 OK - 141ms</div>
                      <div>14:27:08 CHECK 200 OK - 140ms</div>
                      <div className="text-[#958ea0]">
                        14:26:08 AI ANALYSIS ACTIVE
                      </div>
                      <div>14:25:08 CHECK 200 OK - 144ms</div>
                    </div>
                  </div>
                  {/* AI Indicator */}
                  <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 rounded border border-[#d0bcff]/20 bg-[#101415] px-2 py-1">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0bcff]"></span>
                    <span
                      className="text-[8px] font-medium tracking-[0.05em] text-[#d0bcff]"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        letterSpacing: "0.05em",
                      }}
                    >
                      AI INCIDENT ANALYSIS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle glow effect */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[#d0bcff] opacity-5 blur-3xl"></div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default HeroSection;
