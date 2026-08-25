import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

const plans = [
  {
    name: 'Signal Desk',
    price: '$29',
    cadence: 'monitor / month',
    note: 'For small surfaces that need clean signal.',
    tint: 'bg-black',
    accent: 'bg-[#00E676]',
    includes: ['Uptime checks', 'Latency alerts', '7 day history'],
  },
  {
    name: 'War Room',
    price: '$99',
    cadence: 'service / month',
    note: 'For teams that need context before the call starts.',
    tint: 'bg-black',
    accent: 'bg-[#00E676]',
    includes: ['Trace map', 'RCA timeline', 'Noise scoring'],
  },
  {
    name: 'Autopilot RCA',
    price: 'Custom',
    cadence: 'production scale',
    note: 'For high-traffic systems with private workflows.',
    tint: 'bg-black',
    accent: 'bg-[#00E676]',
    includes: ['Runbook actions', 'Private integrations', 'Priority support'],
  },
];

const PricingSection = ({ className = '' }) => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.set(cards, { autoAlpha: 0, y: 32 });

      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 74%',
          end: 'center 45%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className={`relative z-[60] w-screen max-w-full overflow-hidden border-b-[6px] border-black bg-[#050709] px-3 py-16 font-mono text-white sm:px-5 sm:py-20 lg:py-24 ${className}`}
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

      <div className="relative z-10 mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <article
            key={plan.name}
            ref={(el) => (cardRefs.current[index] = el)}
            className={`relative flex min-h-[360px] flex-col overflow-hidden border-[4px] border-white ${plan.tint} p-4 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1),0_0_28px_rgba(0,230,118,0.08)] sm:p-5`}
          >
            <div className={`absolute inset-x-0 top-0 h-1.5 ${plan.accent}`} />
            <div className="border-b-[3px] border-white pb-4 pt-2">
              <h3 className="font-black uppercase italic leading-none text-2xl sm:text-3xl">{plan.name}</h3>
              <p className="mt-3 max-w-[24rem] font-bold uppercase leading-snug text-xs text-white/70">{plan.note}</p>
            </div>

            <div className="py-7">
              <div className="font-black uppercase italic leading-none tracking-normal text-[clamp(3.9rem,11vw,6.3rem)]">
                {plan.price}
              </div>
              <div className="mt-2 font-black uppercase tracking-[0.12em] text-[10px] text-white/55 sm:text-xs">
                {plan.cadence}
              </div>
            </div>

            <ul className="mt-auto grid gap-2 border-t-[3px] border-white pt-4">
              {plan.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 font-black uppercase leading-tight text-xs">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E676]" />
                  {item}
                </li>
              ))}
            </ul>

            <button className="mt-5 border-[3px] border-white bg-[#00E676] px-3 py-3 text-left font-black uppercase italic tracking-[0.12em] text-black transition-colors hover:bg-white">
              Select plan
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
