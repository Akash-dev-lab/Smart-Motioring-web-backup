"use client";

/**
 * IncidentResolutionSection
 *
 * Must be a Client Component because the GSAP ScrollTrigger animation
 * pins `panelRef` (the full-height viewport panel) and drives opacity
 * transitions on `phaseRefs` — refs that span the entire section wrapper.
 * There is no practical way to isolate this into a narrower client boundary
 * without passing refs across a Server→Client boundary, which Next.js does
 * not support.
 *
 * The circuit-pulse SVG background is extracted into:
 *   IncidentCircuitBackground.client.tsx
 * The phase card markup lives in the pure Server-compatible:
 *   IncidentPhasePanel.tsx
 */

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import IncidentCircuitBackground from "@/modules/home/components/IncidentCircuitBackground.client";
import IncidentPhasePanel from "@/modules/home/components/IncidentPhasePanel";
import {
    incidentPhases,
    marginGlyphs,
} from "@/modules/home/data/content";

// Guard against SSR — same pattern as HowItWorksCards.client.tsx
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── Initial phase visibility ─────────────────────────────────────────────────
// We set phases 1 and 2 to invisible via inline CSS so the SSR HTML already
// shows only phase 0, preventing a flash of phase 3 (highest z-index) before
// GSAP hydrates. GSAP's autoAlpha then takes full control after mount.
const PHASE_INITIAL_STYLE = (index: number): React.CSSProperties => ({
    zIndex: 24 + index,
    opacity: index === 0 ? 1 : 0,
    visibility: index === 0 ? "visible" : "hidden",
});

export default function IncidentResolutionSection() {
    const containerRef = useRef<HTMLElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Pre-compute the slim shape the rail needs (id + eyebrow only)
    const railPhases = useMemo(
        () => incidentPhases.map(({ id, eyebrow }) => ({ id, eyebrow })),
        []
    );

    useEffect(() => {
        const ctx = gsap.context(() => {
            const phaseLayers = phaseRefs.current.filter(
                (el): el is HTMLDivElement => el !== null
            );

            if (phaseLayers.length < incidentPhases.length) return;

            // Ensure GSAP takes ownership of visibility from the inline styles
            gsap.set(phaseLayers, { autoAlpha: 0 });
            gsap.set(phaseLayers[0], { autoAlpha: 1 });

            const phaseTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+=${(incidentPhases.length - 1) * 100}%`,
                    pin: panelRef.current,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    scrub: 1,
                },
            });

            // Phase 1 → Phase 2
            phaseTimeline
                .to(
                    phaseLayers[0],
                    { autoAlpha: 0, duration: 0.35, ease: "power2.inOut" },
                    0
                )
                .fromTo(
                    phaseLayers[1],
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 0.35, ease: "power2.inOut" },
                    0.2
                )
                // Hold Phase 2
                .to({}, { duration: 0.2 })
                // Phase 2 → Phase 3
                .to(phaseLayers[1], {
                    autoAlpha: 0,
                    duration: 0.35,
                    ease: "power2.inOut",
                })
                .fromTo(
                    phaseLayers[2],
                    { autoAlpha: 0 },
                    { autoAlpha: 1, duration: 0.35, ease: "power2.inOut" },
                    ">-0.15"
                )
                // Hold Phase 3
                .to({}, { duration: 0.2 });

            // Stagger-in the decorative glyph tiles when section enters viewport
            gsap.from(".incident-grid-item", {
                autoAlpha: 0,
                y: 22,
                stagger: 0.08,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    end: "top 20%",
                    scrub: 1,
                },
            });

            // Recalculate positions after all layout has settled.
            // Critical in Next.js where SSR markup may differ in height
            // from client layout before JS runs.
            ScrollTrigger.refresh();
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-screen max-w-full overflow-x-hidden bg-[#111317] font-mono text-white"
        >
            <div
                ref={panelRef}
                className="relative h-screen w-full overflow-hidden bg-grain"
                style={{ backgroundColor: "#111317" }}
            >
                {/* ── Dot grid overlay ── */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* ── Whitish centre glow ── */}
                <div className="absolute inset-0 z-[2] pointer-events-none">
                    <div className="absolute w-full h-full bg-white/20 blur-[300px]" />
                    <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[100px]" />
                </div>

                {/* ── Animated circuit paths (rAF — client only) ── */}
                <IncidentCircuitBackground />

                {/* ── Incident phase layers (GSAP crossfade) ── */}
                {incidentPhases.map((phase, index) => (
                    <div
                        key={phase.id}
                        ref={(el) => { phaseRefs.current[index] = el; }}
                        className={`absolute inset-0 flex items-center justify-center overflow-hidden px-2 text-center will-change-transform sm:px-4 ${phase.backgroundClass ?? ""}`}
                        style={PHASE_INITIAL_STYLE(index)}
                    >
                        {/* Decorative background glyph tiles */}
                        <div
                            className={`pointer-events-none absolute inset-0 z-0 ${phase.backgroundLabelOpacity}`}
                            aria-hidden="true"
                        >
                            {marginGlyphs.map((tile) => (
                                <span
                                    key={`${phase.id}-${tile.label}`}
                                    className={`incident-grid-item absolute border-[3px] px-2 py-1 font-black uppercase italic leading-none text-[clamp(0.75rem,1.8vw,1.4rem)] ${phase.backgroundLabelClass}`}
                                    style={{
                                        left: tile.x,
                                        top: tile.y,
                                        transform: `rotate(${tile.rotate}deg) scale(${tile.scale})`,
                                    }}
                                >
                                    {tile.label}
                                </span>
                            ))}
                        </div>

                        {/* Phase card */}
                        <IncidentPhasePanel phase={phase} allPhases={railPhases} />
                    </div>
                ))}
            </div>
        </section>
    );
}
