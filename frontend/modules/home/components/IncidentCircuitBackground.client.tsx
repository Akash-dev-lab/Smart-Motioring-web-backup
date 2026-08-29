"use client";

/**
 * IncidentCircuitBackground
 *
 * Renders the SVG circuit-path background with a travelling green pulse.
 * Uses requestAnimationFrame (browser-only) so it must be a Client Component.
 */
import { useEffect, useRef } from "react";

const PATHS = [
    "M 450 0 V 200 H 100 V 500 H 600 V 1000",
    "M 0 750 H 350 V 600 H 900 V 850 H 1500",
    "M 1100 0 V 450 H 1300",
    "M 600 200 H 1000 V 0",
] as const;

const NODES: [number, number][] = [
    [450, 200],
    [100, 500],
    [600, 500],
    [350, 600],
    [900, 600],
];

/** Duration for one full path traversal in milliseconds. */
const DURATION = 3200;
/** Pause between the end of one path and the start of the next. */
const GAP = 250;

export default function IncidentCircuitBackground() {
    const pulseRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        const pulsePaths = pulseRefs.current.filter(
            (el): el is SVGPathElement => el !== null
        );

        if (!pulsePaths.length) return;

        let cancelled = false;
        let frameId = 0;
        let currentIndex = 0;

        const animatePath = (index: number): void => {
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

            const tick = (now: number): void => {
                if (cancelled) return;

                const elapsed = now - start;
                const rawProgress = Math.min(elapsed / DURATION, 1);

                // Ease-in-out
                const progress =
                    rawProgress < 0.5
                        ? 2 * rawProgress * rawProgress
                        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

                path.style.strokeDashoffset = `${length * (1 - progress)}`;

                // Fade in at start, fade out near end
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

                path.style.opacity = "0";
                path.style.strokeDashoffset = `${-pulseLength}`;

                currentIndex = (index + 1) % pulsePaths.length;
                window.setTimeout(() => {
                    if (!cancelled) animatePath(currentIndex);
                }, GAP);
            };

            frameId = requestAnimationFrame(tick);
        };

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
                    {/* Glow around the travelling pulse */}
                    <filter id="ir-pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Subtle glow around circuit nodes */}
                    <filter id="ir-nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Static circuit paths */}
                <g fill="none" stroke="#4ae176" strokeWidth="0.5" opacity="0.45">
                    {PATHS.map((d, i) => (
                        <path key={i} d={d} />
                    ))}
                </g>

                {/* Travelling pulse — one active at a time, driven by rAF */}
                <g
                    fill="none"
                    stroke="#4ae176"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#ir-pulseGlow)"
                >
                    {PATHS.map((d, i) => (
                        <path
                            key={`pulse-${i}`}
                            ref={(el) => { pulseRefs.current[i] = el; }}
                            d={d}
                            opacity="0"
                        />
                    ))}
                </g>

                {/* Junction nodes */}
                <g fill="#4ae176">
                    {NODES.map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="5" />
                    ))}
                    <circle cx="280" cy="150" r="6" />
                    <circle cx="850" cy="800" r="5" />
                    <circle cx="50"  cy="820" r="6" />
                </g>

                {/* Node glow overlay */}
                <g fill="#4ae176" opacity="0.28" filter="url(#ir-nodeGlow)">
                    {NODES.map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="7" />
                    ))}
                </g>
            </svg>
        </div>
    );
}
