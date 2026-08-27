import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const marginGlyphs = [
  { x: '8%', y: '14%', rotate: -12, scale: 1.05 },
  { x: '82%', y: '10%', rotate: 9, scale: 0.9 },
  { x: '91%', y: '28%', rotate: -7, scale: 1.18 },
  { x: '6%', y: '37%', rotate: 14, scale: 0.82 },
  { x: '88%', y: '55%', rotate: 12, scale: 1 },
  { x: '13%', y: '73%', rotate: -9, scale: 1.12 },
  { x: '72%', y: '86%', rotate: 7, scale: 0.86 },
  { x: '28%', y: '91%', rotate: -15, scale: 0.95 },
  { x: '4%', y: '88%', rotate: 8, scale: 0.78 },
  { x: '95%', y: '80%', rotate: -12, scale: 0.78 },
];

const incidentPhases = [
  {
    id: 'error',
    glyph: '!',
    eyebrow: 'Incident detected',
    title: 'Payment API Failure',
    accentClass: 'border-[#00E676] text-[#00E676]',
    backgroundLabelOpacity: 'opacity-[0.18] md:opacity-[0.24]',
    statusClass: 'bg-[#00E676] text-[#050709]',
    meterClass: 'bg-[#00E676] w-[72%]',
    summary: 'The checkout path is timing out under live traffic.',
    lines: [
      ['Signal', '502 Bad Gateway'],
      ['Service', 'payment-api'],
      ['Latency', '3200ms'],
      ['State', 'Failing'],
    ],
  },
  {
    id: 'analyzing',
    glyph: '?',
    eyebrow: 'Trace in progress',
    title: 'From Signal To Cause',
    accentClass: 'border-[#00E676] text-[#00E676]',
    backgroundLabelClass: 'border-[#00E676]/60 bg-[#00E676]/[0.025] text-[#00E676] shadow-[0_0_18px_rgba(0,230,118,0.04)]',
    backgroundLabelOpacity: 'opacity-[0.18] md:opacity-[0.24]',
    statusClass: 'bg-[#00E676] text-[#050709]',
    meterClass: 'bg-[#00E676] w-[86%]',
    summary: 'Logs, checks, and dependency signals collapse into one readable trail.',
    lines: [
      ['Step 01', 'Scanning logs'],
      ['Step 02', 'Matching patterns'],
      ['Step 03', 'Tracing dependency'],
      ['Step 04', 'Ranking cause'],
    ],
  },
  {
    id: 'identified',
    glyph: '+',
    eyebrow: 'Cause identified',
    title: 'Issue Identified',
    accentClass: 'border-[#00E676] text-[#00E676]',
    backgroundLabelClass: 'border-[#00E676]/60 bg-[#00E676]/[0.025] text-[#00E676] shadow-[0_0_18px_rgba(0,230,118,0.04)]',
    backgroundLabelOpacity: 'opacity-[0.18] md:opacity-[0.24]',
    statusClass: 'bg-[#00E676] text-[#050709]',
    meterClass: 'bg-[#00E676] w-[100%]',
    summary: 'Payment API is failing because the upstream server is responding too slowly.',
    groups: [
      {
        label: 'Likely cause',
        items: ['Third-party timeout', 'Retry budget exhausted'],
      },
      {
        label: 'Suggested fix',
        items: ['Add fallback cache', 'Raise timeout guard'],
      },
    ],
  },
];

const circleReveal = {
  hidden: 'circle(0% at 50% 50%)',
  visible: 'circle(200% at 50% 50%)',
};

const TimelineRail = ({ activeId }) => (
  <div className="mb-2 grid grid-cols-3 border-white sm:mb-0 sm:border-b">
    {incidentPhases.map((phase, index) => (
      <div
        key={phase.id}
        className={`flex min-h-8 items-center gap-1 px-1.5 py-1 last:border-r-0 sm:min-h-12 sm:gap-2 sm:border-green-400 sm:px-4 sm:py-2 ${phase.id === activeId ? 'bg-[#e6db00] text-[#050709]' : 'bg-black/35 text-white/80'
          }`}
      >
        <span className="grid h-5 w-5 shrink-0 place-items-center border-2 border-current bg-[#e6b000] font-black text-[9px] text-[#050709] sm:h-6 sm:w-6 sm:text-[10px]">
          0{index + 1}
        </span>
        <span className="min-w-0 truncate font-black uppercase tracking-[0.04em] text-[7px] min-[380px]:text-[8px] sm:tracking-[0.12em] sm:text-[10px] md:text-xs">
          {phase.eyebrow}
        </span>
      </div>
    ))}
  </div>
);

const PhaseContent = ({ phase }) => (
  <div className="relative z-50 flex h-[calc(100svh-180px)] max-h-[590px] min-h-[500px] w-full max-w-[calc(100vw-1rem)] items-center justify-center sm:h-[590px] sm:max-w-[94vw] md:max-w-[980px]">
    <div
      className={`relative z-10 flex h-full w-full flex-col overflow-hidden shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] backdrop-blur-[2px] sm:border sm:border-black sm:rounded-md sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${phase.panelClass}`}
      style={{
        backgroundImage:
          `linear-gradient(${phase.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${phase.gridLine} 1px, transparent 1px)`,
        backgroundSize: 'clamp(2rem, 5vw, 3.5rem) clamp(2rem, 5vw, 3.5rem)',
        backgroundPosition: '-1px -1px',
      }}
    >
      <div className="grid grid-cols-[1fr_auto] items-center border-b-[3px] border-white bg-[#050709] text-[#00E676] sm:border-b">
        <div className="flex min-w-0 items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
          {/* Window dots */}
          <div className="hidden items-center justify-between border-b-[4px] border-black bg-black p-3 text-white sm:flex">
            <div className="flex gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] animate-dot" style={{ animationDelay: '0s' }} />
              <span className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] animate-dot" style={{ animationDelay: '0.25s' }} />
              <span className="h-3.5 w-3.5 rounded-full bg-[#00E676] animate-dot" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          <span className="ml-1 truncate font-black uppercase italic tracking-[0.16em] text-[10px] sm:text-xs">
            incident console
          </span>
        </div>
        <span className={`m-1.5 border-2 border-[#00E676] px-2 py-1 font-black uppercase tracking-[0.14em] text-[9px] shadow-[0_0_12px_rgba(0,230,118,0.15)] sm:m-2 sm:text-[10px] ${phase.statusClass}`}>
          live
        </span>
      </div>

      <TimelineRail activeId={phase.id} />

      <div className="relative min-h-0 flex-1 grid lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="relative overflow-hidden border-b-[3px] border-current/70 p-2 text-left min-[380px]:p-3 sm:p-6 lg:border-b-0 lg:border-r-[4px] lg:p-8">
          <div className="float-right ml-2 mb-1 grid h-9 w-9 rotate-6 place-items-center border-[3px] border-[#dee600] bg-[#dee600] text-[#050709] shadow-[4px_4px_0px_0px_rgba(0,230,118,0.18)] sm:ml-3 sm:mb-2 sm:h-16 sm:w-16 sm:shadow-[0_0_22px_rgba(0,230,118,0.16)]">
            <span className="font-black text-2xl leading-none sm:text-4xl">{phase.glyph}</span>
          </div>
          <p className={`inline-flex max-w-[calc(100%-2.75rem)] text-amber-400 px-1.5 py-0.5 font-black uppercase italic tracking-[0.08em] text-[8px] min-[380px]:text-[9px] sm:max-w-none sm:px-2 sm:py-1 sm:tracking-[0.16em] sm:text-xs ${phase.accentClass}`}>
            {phase.eyebrow}
          </p>
          <h2
            className={`mt-2 font-black italic uppercase leading-[0.88] tracking-normal text-[clamp(1.65rem,9vw,2.45rem)] sm:mt-4 sm:leading-[0.88] sm:text-[clamp(1.85rem,10.5vw,5.9rem)] ${phase.id === 'analyzing' ? 'max-w-[18ch]' : 'max-w-[14ch]'
              }`}
          >
            {phase.title}
          </h2>
          <p className="mt-2 max-w-[34rem] border-t-2 border-current/55 pt-2 font-black uppercase leading-tight text-[10px] min-[380px]:text-[11px] sm:mt-4 sm:pt-3 sm:leading-snug sm:text-sm md:text-base">
            {phase.summary}
          </p>
          <div className="mt-3 border-[2px] border-[#00E676]/70 bg-black/40 p-1 shadow-[0_0_18px_rgba(0,230,118,0.06)] sm:mt-5">
            <div className="h-2 border-2 border-[#00E676]/70 bg-[#00E676]/[0.06] sm:h-3">
              <div className={`h-full border-r-2 border-current ${phase.meterClass}`} />
            </div>
          </div>
        </div>

        <div className="grid bg-[#050709]/70 text-left sm:grid-cols-2 lg:grid-cols-1">
          {phase.lines?.map((line) => (
            <div key={line.join('-')} className="grid min-h-10 content-center border-b border-current/45 px-3 py-2 last:border-b-0 sm:min-h-16 sm:px-5 sm:py-3 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0">
              <span className={`font-black uppercase tracking-[0.14em] text-[8px] sm:tracking-[0.18em] sm:text-xs ${phase.accentClass}`}>{line[0]}</span>
              <span className="mt-0.5 break-words font-black uppercase text-xs sm:mt-1 sm:text-base">{line[1]}</span>
            </div>
          ))}

          {phase.groups?.map((group) => (
            <div key={group.label} className="border-b border-current/45 px-3 py-3 last:border-b-0 sm:px-5 sm:py-4 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0">
              <h3 className={`font-black uppercase tracking-[0.14em] text-[8px] sm:tracking-[0.18em] sm:text-xs ${phase.accentClass}`}>{group.label}</h3>
              <ul className="mt-2 grid gap-1.5 font-bold uppercase leading-tight text-[10px] sm:mt-3 sm:gap-2 sm:leading-snug sm:text-sm">
                {group.items.map((item) => (
                  <li key={item} className="border-l-[3px] border-current/70 pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TechnicalBackground = () => {
  const pulseRefs = useRef([]);

  const paths = [
    "M 450 0 V 200 H 100 V 500 H 600 V 1000",
    "M 0 750 H 350 V 600 H 900 V 850 H 1500",
    "M 1100 0 V 450 H 1300",
    "M 600 200 H 1000 V 0",
  ];

  const nodes = [
    // [150, 100],
    [450, 200],
    [100, 500],
    [600, 500],
    [350, 600],
    [900, 600],
    // [1100, 450],
    // [900, 850],
  ];

  useEffect(() => {
    const pulsePaths = pulseRefs.current.filter(Boolean);

    if (!pulsePaths.length) return;

    let cancelled = false;
    let frameId = 0;
    let currentIndex = 0;

    // One pulse duration. The whole path must finish before
    // the next path is allowed to start.
    const DURATION = 3200;

    // Small pause between completed path and next path.
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

      // The dash itself is the travelling pulse.
      // It is long enough to be visible but still feels like
      // a small signal moving through the circuit.
      const pulseLength = Math.min(Math.max(length * 0.045, 22), 55);

      path.style.strokeDasharray = `${pulseLength} ${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.opacity = "0";

      const start = performance.now();

      const tick = (now) => {
        if (cancelled) return;

        const elapsed = now - start;
        const rawProgress = Math.min(elapsed / DURATION, 1);

        // Smooth ease-in-out motion.
        const progress =
          rawProgress < 0.5
            ? 2 * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        // Move the pulse from the beginning of the path to the end.
        path.style.strokeDashoffset = `${length * (1 - progress)}`;

        // Fade in quickly, remain bright, then disappear at the end.
        let opacity = 1;

        if (rawProgress < 0.06) {
          opacity = rawProgress / 0.06;
        } else if (rawProgress > 0.92) {
          opacity = (1 - rawProgress) / 0.08;
        }

        path.style.opacity = String(Math.max(0, Math.min(1, opacity)));

        if (rawProgress < 1) {
          frameId = requestAnimationFrame(tick);
          return;
        }

        // Make absolutely sure the current pulse is gone before
        // allowing the next one to start.
        path.style.opacity = "0";
        path.style.strokeDashoffset = `${-pulseLength}`;

        currentIndex = (index + 1) % pulsePaths.length;

        window.setTimeout(() => {
          if (!cancelled) {
            animatePath(currentIndex);
          }
        }, GAP);
      };

      frameId = requestAnimationFrame(tick);
    };

    // Start the first path only after the SVG has mounted.
    animatePath(0);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1500 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Soft glow around travelling pulse */}
          <filter
            id="pulseGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle glow around circuit nodes */}
          <filter
            id="nodeGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* =====================================================
            STATIC CIRCUIT PATHS
            Existing geometry is unchanged.
        ===================================================== */}
        <g
          fill="none"
          stroke="#4ae176"
          strokeWidth="0.5"
          opacity="0.45"
        >
          {paths.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </g>

        {/* =====================================================
            ONE TRAVELLING PULSE PER PATH

            These are NOT independent animations.
            React's animation loop activates exactly one path,
            waits for it to reach 100%, then activates the next.
        ===================================================== */}
        <g
          fill="none"
          stroke="#4ae176"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#pulseGlow)"
        >
          {paths.map((path, index) => (
            <path
              key={`pulse-${index}`}
              ref={(element) => {
                pulseRefs.current[index] = element;
              }}
              d={path}
              opacity="0"
            />
          ))}
        </g>

        {/* =====================================================
            JUNCTION NODES
        ===================================================== */}
        <g fill="#4ae176">
          {nodes.map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r="5" />
          ))}

          <circle cx="280" cy="150" r="6" />
          <circle cx="850" cy="800" r="5" />
          <circle cx="50" cy="820" r="6" />
        </g>

        {/* Subtle node glow */}
        <g
          fill="#4ae176"
          opacity="0.28"
          filter="url(#nodeGlow)"
        >
          {nodes.map(([cx, cy], index) => (
            <circle key={index} cx={cx} cy={cy} r="7" />
          ))}
        </g>
      </svg>
    </div>
  );
};


const IncidentResolutionSection = ({ className = '' }) => {
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const phaseRefs = useRef([]);
  const glyphTiles = useMemo(
    () =>
      marginGlyphs.map((tile, index) => ({
        ...tile,
        label: ['ERR', 'API', '502', 'LOG', 'SLA', 'FIX', 'TRACE', 'PING', 'DB', 'TTL'][index],
      })),
    []
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const phaseLayers = phaseRefs.current.filter(Boolean);

      // Start with exactly one phase visible.
      gsap.set(phaseLayers, {
        autoAlpha: 0,
      });

      gsap.set(phaseLayers[0], {
        autoAlpha: 1,
      });

      const phaseTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${(incidentPhases.length - 1) * 100}%`,
          pin: panelRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 1,
        },
      });

      // Phase 1 -> Phase 2 (clean fade out of previous phase and fade in of next phase)
      phaseTimeline
        .to(
          phaseLayers[0],
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.inOut',
          },
          0
        )
        .fromTo(
          phaseLayers[1],
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: 'power2.inOut',
          },
          0.2
        )

        // Hold Phase 2
        .to({}, { duration: 0.2 })

        // Phase 2 -> Phase 3
        .to(
          phaseLayers[1],
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power2.inOut',
          }
        )
        .fromTo(
          phaseLayers[2],
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 0.35,
            ease: 'power2.inOut',
          },
          '>-0.15'
        )

        // Hold Phase 3
        .to({}, { duration: 0.2 });

      gsap.from('.incident-grid-item', {
        autoAlpha: 0,
        y: 22,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={`relative min-h-screen min-h-[100svh] w-screen max-w-full bg-[#111317] font-mono text-white`}>
      {/* Self-contained black / white / neon-green incident console. */}

      <div ref={panelRef} className="relative h-screen w-full overflow-hidden bg-grain" style={{ backgroundColor: '#111317' }}>
        {/* Full-section technical background: grid + circuit paths + nodes + subtle glow. */}

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

        {/* Whitish Glow Effect in Middle */}
        <div className="absolute inset-0 z-2 pointer-events-none">
          <div className="absolute w-full h-full bg-white/20 blur-[300px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        <TechnicalBackground />

        {incidentPhases.map((phase, index) => (
          <div
            key={phase.id}
            ref={(el) => (phaseRefs.current[index] = el)}
            className={`absolute inset-0 flex items-center justify-center overflow-hidden px-2 text-center will-change-transform sm:px-4 ${phase.backgroundClass || ''}`}
            style={{
              zIndex: 24 + index,
            }}
          >
            <div className={`pointer-events-none absolute inset-0 z-0 ${phase.backgroundLabelOpacity}`} aria-hidden="true">
              {glyphTiles.map((tile) => (
                <span
                  key={`${phase.id}-${tile.label}`}
                  className={`absolute border-[3px] px-2 py-1 font-black uppercase italic leading-none text-[clamp(0.75rem,1.8vw,1.4rem)] ${phase.backgroundLabelClass}`}
                  style={{ left: tile.x, top: tile.y, transform: `rotate(${tile.rotate}deg) scale(${tile.scale})` }}
                >
                  {tile.label}
                </span>
              ))}
            </div>
            <PhaseContent phase={phase} />
          </div>
        ))}
      </div>
    </section >
  );
};

export default IncidentResolutionSection;
