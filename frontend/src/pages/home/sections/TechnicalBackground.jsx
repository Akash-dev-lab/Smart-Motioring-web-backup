import { useEffect, useRef } from "react";

// TechnicalBackground.jsx
//
// The circuit geometry stays the same.
// A single pulse travels one complete path at a time:
//
//   PATH 1 -> PATH 2 -> PATH 3 -> PATH 4 -> repeat
//
// The next pulse is not created until the current path has
// completely finished. This is driven with requestAnimationFrame
// instead of SVG SMIL so the sequencing works reliably in Chrome.

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

export default TechnicalBackground;
