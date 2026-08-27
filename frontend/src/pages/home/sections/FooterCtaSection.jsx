import { useLayoutEffect, useRef } from 'react';
import { Activity, ArrowRight, Code2, Hash, Mail, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IconTileLink, WindowDots } from '../components';

gsap.registerPlugin(ScrollTrigger);

const TechnicalBackground = () => {
  const pulseRefs = useRef([]);

  const paths = [
    "M 450 0 V 200 H 100 V 500 H 600 V 1000",
    "M 0 750 H 350 V 600 H 900 V 850 H 1500",
    "M 1100 0 V 450 H 1300",
    "M 600 200 H 1000 V 0",
  ];

  const nodes = [
    [450, 200],
    [100, 500],
    [600, 500],
    [350, 600],
    [900, 600],
  ];

  useLayoutEffect(() => {
    const pulsePaths = pulseRefs.current.filter(Boolean);
    if (!pulsePaths.length) return;

    let cancelled = false;
    let frameId = 0;
    let timeoutId = 0;
    let currentIndex = 0;
    const DURATION = 3200;
    const GAP = 250;

    const animatePath = (index) => {
      if (cancelled) return;
      const path = pulsePaths[index];

      if (!path) {
        currentIndex = (index + 1) % pulsePaths.length;
        animatePath(currentIndex);
        return;
      }

      const length = path.getTotalLength();
      const pulseLength = Math.min(Math.max(length * 0.045, 22), 55);

      path.style.strokeDasharray = `${pulseLength} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.opacity = "0";

      const start = performance.now();

      const tick = (now) => {
        if (cancelled) return;

        const elapsed = now - start;
        const rawProgress = Math.min(elapsed / DURATION, 1);
        const progress =
          rawProgress < 0.5
            ? 2 * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        path.style.strokeDashoffset = `${length * (1 - progress)}`;

        let opacity = 1;
        if (rawProgress < 0.06) opacity = rawProgress / 0.06;
        else if (rawProgress > 0.92) opacity = (1 - rawProgress) / 0.08;

        path.style.opacity = String(Math.max(0, Math.min(1, opacity)));

        if (rawProgress < 1) {
          frameId = requestAnimationFrame(tick);
          return;
        }

        path.style.opacity = "0";
        path.style.strokeDashoffset = `${-pulseLength}`;
        currentIndex = (index + 1) % pulsePaths.length;

        timeoutId = window.setTimeout(() => {
          if (!cancelled) animatePath(currentIndex);
        }, GAP);
      };

      frameId = requestAnimationFrame(tick);
    };

    animatePath(0);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1500 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter id="testimonialsPulseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="testimonialsNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g fill="none" stroke="#4ae176" strokeWidth="0.5" opacity="0.45">
          {paths.map((path, index) => <path key={index} d={path} />)}
        </g>

        <g
          fill="none"
          stroke="#4ae176"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#testimonialsPulseGlow)"
        >
          {paths.map((path, index) => (
            <path
              key={`pulse-${index}`}
              ref={(element) => { pulseRefs.current[index] = element; }}
              d={path}
              opacity="0"
            />
          ))}
        </g>

        <g fill="#4ae176">
          {nodes.map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r="5" />
          ))}
          <circle cx="280" cy="150" r="6" />
          <circle cx="850" cy="800" r="5" />
          <circle cx="50" cy="820" r="6" />
        </g>

        <g fill="#4ae176" opacity="0.28" filter="url(#testimonialsNodeGlow)">
          {nodes.map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r="7" />
          ))}
        </g>
      </svg>
    </div>
  );
};

const footerGroups = [
  {
    title: 'SYSTEM',
    kicker: 'Product routes',
    links: [
      { label: 'Monitoring', note: 'Live checks, latency, uptime' },
      { label: 'Incident RCA', note: 'Root cause timelines' },
      { label: 'Pricing', note: 'Plans for every service' },
    ],
  },
  {
    title: 'DEBUG',
    kicker: 'Ops library',
    links: [
      { label: 'Status page', note: 'Public health reports' },
      { label: 'Runbooks', note: 'Repeatable recovery flows' },
      { label: 'Docs', note: 'Setup and API guides' },
    ],
  },
  {
    title: 'CORE',
    kicker: 'Company signal',
    links: [
      { label: 'About', note: 'Why Drishyam exists' },
      { label: 'Careers', note: 'Build calmer on-call tools' },
      { label: 'Contact', note: 'Reach the team directly' },
    ],
  },
];

const FooterCtaSection = ({ className = '' }) => {
  const sectionRef = useRef(null);
  const floorRef = useRef(null);
  const stripTrackRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. FLOOR PERSPECTIVE
      gsap.fromTo(floorRef.current,
        { rotateX: 90, y: 0 },
        {
          rotateX: 65,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true
          }
        }
      );

      // 2. WINDOWS LANDING
      gsap.from(".drop-window", {
        y: -500,
        rotateZ: -10,
        autoAlpha: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      gsap.from(".footer-point", {
        x: -28,
        autoAlpha: 0,
        stagger: 0.055,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-nav",
          start: "top 82%",
        }
      });

      gsap.to(stripTrackRef.current, {
        xPercent: -50,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className={`relative w-full bg-[#1c1c1c] pt-32 pb-16 md:pb-24 overflow-hidden font-mono ${className}`}
      style={{ perspective: '1500px', perspectiveOrigin: '50% 0%' }}
    >
      {/* 3D CHECKERED FLOOR — unchanged CTA background */}
      <div
        ref={floorRef}
        className="absolute top-0 left-[-50%] w-[200%] h-screen z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #fff 25%, transparent 25%),
            linear-gradient(-45deg, #fff 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #fff 75%), 
            linear-gradient(-45deg, transparent 75%, #fff 75%)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: '0 0, 0 50px, 50px -50px, -50px 0px',
          backgroundColor: '#1c1c1c',
          transformOrigin: 'top center',
          borderTop: '6px solid black'
        }}
      />

      {/* PRICING-SECTION BACKGROUND — only behind the lower footer/nav area */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[31.25rem] z-[1] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 bg-grain opacity-80" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/[0.025] blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/[0.035] blur-[100px]" />
        </div>
        <TechnicalBackground />
      </div>

      {/* TICKER STRIP */}
      <div className="absolute inset-x-0 top-0 z-5 overflow-hidden border-y-[6px] border-black bg-[#000000] py-2 shadow-[0_8px_0px_0px_rgba(0,0,0,1)]">
        <div ref={stripTrackRef} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform">
          {[...Array(2)].map((_, repeatIndex) => (
            <div key={repeatIndex} className="flex items-center gap-8">
              {['SIGNAL LOCKED', 'INCIDENT TRAIL READY', 'NOISE FILTER ONLINE', 'RCA PATH OPEN', 'DEPLOY WITH CONTEXT'].map((item) => (
                <span key={`${repeatIndex}-${item}`} className="flex items-center gap-3 font-black uppercase italic tracking-[0.18em] text-green-500 text-[10px] sm:text-xs">
                  <span className="h-2.5 w-2.5 border-2 border-black bg-[#fafafa]" />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* CTA CONTENT STACK - Height reduced on mobile to prevent overlap */}
        <div className="relative h-100 md:h-125 flex items-center justify-center">

          <div className="drop-window relative w-full max-w-[90vw] md:max-w-md bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-black border-b-[6px] border-black p-2 md:p-3 flex justify-between items-center text-white">
              <WindowDots dotClassName="h-3 w-3 border-2 md:h-4 md:w-4 animate-dot" colors={['bg-[#FF5F56]', 'bg-[#FFBD2E]', 'bg-[#00E676]']} />
              <span className="text-[9px] md:text-[10px] font-black italic text-green-400 tracking-widest uppercase font-['Geist',sans-serif]">System_Active</span>
            </div>

            <div className="p-6 md:p-10 text-center">
              <h2 className="font-black text-black leading-[0.85] text-4xl sm:text-5xl md:text-6xl uppercase italic mb-6 md:mb-8">
                FIND <br />THE <span className="bg-[#53ff1e] text-white px-1.5 md:px-2">SIGNAL.</span>
              </h2>
              <button className="group w-full bg-[#FFFF00] cursor-pointer border-4 border-black p-3 md:p-4 text-black font-black uppercase italic text-base md:text-xl flex items-center justify-between hover:translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
                <span>Launch_Console</span>
                <Zap fill="currentColor" size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Floating window hidden on very small screens to avoid clutter */}
          <div className="drop-window absolute -right-4 top-16 md:-right-6 md:top-10 bg-black border-4 border-black p-3 md:p-5 rotate-[8deg] z-30 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hidden sm:block">
            <Activity className="text-[#00E676] w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
            <p className="text-[8px] md:text-[10px] font-black text-white mt-2 uppercase tracking-tighter">Live_Pulse</p>
          </div>
        </div>

        {/* BRUTALIST NAV - Responsive Grid Logic */}
        <div className="footer-nav grid gap-12 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.05fr_1fr_1fr_1fr] mt-12 md:mt-24">
          <div className="space-y-6 lg:pr-6">
            <div className="bg-black text-white p-4 inline-block transform -skew-x-12 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,230,118,1)]">
              <h3 className="text-2xl md:text-3xl font-black italic uppercase leading-none tracking-tighter">Smart Monitoring</h3>
            </div>
            <p className="max-w-xs text-xs md:text-sm font-black uppercase italic leading-tight text-white">
              Production monitoring that turns alert noise into a readable incident trail.
            </p>
            <div className="flex gap-3">
              <IconTileLink className="bg-white text-black" label="Email Drishyam">
                <Mail className="h-4.5 w-4.5 md:h-5 md:w-5" strokeWidth={3} />
              </IconTileLink>
              <IconTileLink className="bg-[#3cff00] text-black" label="Developer resources">
                <Code2 className="h-4.5 w-4.5 md:h-5 md:w-5" strokeWidth={3} />
              </IconTileLink>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-5 flex items-end justify-between gap-3 border-b-4 border-white pb-3">
                <div>
                  <h4 className="inline-block border-2 border-black bg-[#04ff00] px-2 font-black uppercase italic tracking-widest text-black text-[9px] md:text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {group.title}
                  </h4>
                  <p className="mt-2 md:mt-3 font-black uppercase tracking-[0.16em] text-white text-[8px] md:text-[9px]">{group.kicker}</p>
                </div>
                <Hash className="h-4 w-4 text-white md:h-4.5 md:w-4.5" strokeWidth={4} />
              </div>

              <ul className="grid gap-3">
                {group.links.map((link, index) => {
                  const globalIndex =
                    footerGroups
                      .slice(0, footerGroups.findIndex((g) => g.title === group.title))
                      .reduce((total, currentGroup) => total + currentGroup.links.length, 0) +
                    index +
                    1;

                  return (
                    <li key={link.label} className="footer-point">
                      <a
                        className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] md:grid-cols-[2.35rem_minmax(0,1fr)_auto] items-center gap-2 md:gap-3 border-4 border-black bg-white/95 p-2 md:p-3 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-[#00E676] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
                        href="#"
                      >
                        <span className="grid h-8 w-8 md:h-9 md:w-9 place-items-center border-2 border-black bg-[#26ff1e] font-black text-black text-[9px] md:text-[10px]">
                          {String(globalIndex).padStart(2, '0')}
                        </span>

                        <span className="min-w-0">
                          <span className="block truncate font-black uppercase italic leading-none text-xs md:text-sm">
                            {link.label}
                          </span>

                          <span className="mt-1 block truncate font-black uppercase tracking-[0.08em] text-black/55 text-[8px] md:text-[9px]">
                            {link.note}
                          </span>
                        </span>

                        <ArrowRight
                          className="h-3.75 w-3.75 transition-transform group-hover:translate-x-1 md:h-[17px] md:w-[17px]"
                          strokeWidth={4}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterCtaSection;
