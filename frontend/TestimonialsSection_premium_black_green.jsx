import { useLayoutEffect, useRef } from 'react';
import { Activity, Quote, RadioTower, ServerCrash, ShieldCheck, TerminalSquare } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Drishyam gave us the exact service, impact, and likely cause before the war room even filled up.',
    name: 'Aarav Mehta',
    role: 'SRE Lead',
    company: 'FinOps Cloud',
    metric: '41% faster triage',
    icon: ShieldCheck,
  },
  {
    quote: 'The alert was readable. No log archaeology, no mystery graphs, just a clean path from symptom to cause.',
    name: 'Nisha Rao',
    role: 'Platform Engineer',
    company: 'CartPilot',
    metric: '18m saved',
    icon: TerminalSquare,
  },
  {
    quote: 'We caught repeat API failures the first week. The team finally trusted the signal instead of muting it.',
    name: 'Kabir Sethi',
    role: 'Engineering Manager',
    company: 'RelayStack',
    metric: '63% fewer repeats',
    icon: RadioTower,
  },
  {
    quote: 'Incident reviews became sharper because every timeline had evidence, ownership, and the fix trail in one view.',
    name: 'Mira Shah',
    role: 'Head of Infra',
    company: 'Northstar Labs',
    metric: '2.4x clearer RCA',
    icon: ServerCrash,
  },
  {
    quote: 'It feels like a second pair of eyes on production: calm, fast, and annoyingly accurate when something breaks.',
    name: 'Dev Arora',
    role: 'On-call Engineer',
    company: 'PulseOps',
    metric: '52% less noise',
    icon: Activity,
  },
];


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

const TestimonialsSection = ({ className = '' }) => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        autoAlpha: 0,
        x: 80,
        rotation: (index) => [-2, 1.5, -1, 1, -1.4][index] || 0,
      });

      const getTravel = () => {
        const viewport = viewportRef.current;
        const lastCard = cards.at(-1);
        return lastCard && viewport ? Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth - viewport.clientWidth) : 0;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getTravel()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(cards, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.25, ease: 'none' }, 0)
        .to(trackRef.current, { x: () => -getTravel(), duration: 1, ease: 'none' }, 0.08);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative z-[60] h-screen h-[100svh] w-screen max-w-full overflow-hidden border-b-[6px] border-black bg-[#111317] font-mono text-white ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-grain opacity-80" />
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <div className="absolute inset-0 bg-white/[0.025] blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/[0.035] blur-[100px]" />
      </div>
      <TechnicalBackground />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-14 border-t-[3px] border-white/10 bg-black/20" />

      <div ref={viewportRef} className="relative z-10 h-full overflow-hidden">
        <div ref={trackRef} className="flex h-full w-max items-center gap-4 px-8 py-7 sm:gap-6 sm:px-12 lg:px-20">
          <div className="flex h-[min(520px,78svh)] w-[88vw] max-w-[920px] shrink-0 flex-col justify-center text-white lg:w-[820px]">
            <div>
              <div className="inline-flex border-[3px] border-white bg-black px-3 py-1.5 font-black uppercase italic tracking-[0.18em] text-[#00E676] text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:text-xs">
                customer signal log
              </div>
              <h2
                className="mt-4 max-w-[12ch] text-wrap font-black uppercase italic leading-[0.88] text-[clamp(2.35rem,8vw,5.9rem)] sm:mt-5 sm:text-[clamp(3rem,7.5vw,6.7rem)]"
                style={{
                  WebkitTextStroke: 'clamp(1px, 0.16vw, 1.5px) white',
                  textShadow: 'clamp(5px, 0.8vw, 9px) clamp(5px, 0.8vw, 9px) 0 #00E676, clamp(9px, 1.2vw, 14px) clamp(9px, 1.2vw, 14px) 0 rgba(0,0,0,0.5)',
                }}
              >
                Teams that caught it first.
              </h2>
            </div>
            <div className="mt-5 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-7 sm:gap-3">
              {['MTTR', 'NOISE', 'RCA'].map((label, index) => (
                <div key={label} className="border-[3px] border-white bg-black px-2 py-3 text-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:px-3 sm:py-4">
                  <span className="block font-black uppercase tracking-[0.12em] text-[9px] sm:text-[10px]">{label}</span>
                  <span className="mt-1 block font-black text-xl leading-none sm:text-3xl">{['-34%', '-52%', '2.4x'][index]}</span>
                </div>
              ))}
            </div>
          </div>

            {testimonials.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.name}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className="relative flex h-[min(390px,76svh)] w-[88vw] max-w-[540px] shrink-0 flex-col justify-between border-[4px] border-white bg-black p-4 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1),0_0_28px_rgba(0,230,118,0.08)] sm:w-[500px] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Quote className="h-9 w-9 text-[#00E676]" strokeWidth={3.4} />
                    <div className="grid h-14 w-14 shrink-0 place-items-center border-[3px] border-white bg-black">
                      <Icon className="h-7 w-7 text-[#00E676]" strokeWidth={3.2} />
                    </div>
                  </div>
                  <p className="mt-4 font-black uppercase italic leading-[1.02] text-[clamp(1.05rem,3.6vw,1.78rem)] sm:mt-5 sm:leading-[0.98]">
                    {item.quote}
                  </p>
                  <div className="mt-4 border-t-[3px] border-white pt-3 sm:mt-5 sm:pt-4">
                    <span className="inline-flex border-[3px] border-white bg-black px-2 py-1 font-black uppercase tracking-[0.13em] text-[#00E676] text-[10px]">
                      {item.metric}
                    </span>
                    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                      <div className="min-w-0 pr-1">
                        <h3 className="break-words font-black uppercase text-lg leading-[0.95] sm:text-xl">{item.name}</h3>
                        <p className="mt-1 break-words font-bold uppercase tracking-[0.08em] text-white/70 text-[10px] sm:text-xs">
                          {item.role} / {item.company}
                        </p>
                      </div>
                      <span className="shrink-0 border-2 border-white px-2 py-1 font-black text-xs">0{index + 1}</span>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
