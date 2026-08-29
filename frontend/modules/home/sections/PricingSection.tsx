/**
 * PricingSection — Server Component
 *
 * All background layers, grid, glow, and section markup are static and
 * server-renderable. The only browser-dependent piece is the GSAP
 * ScrollTrigger card-entrance animation, which is isolated in:
 *
 *   PricingCards.client.tsx
 *
 * TechnicalBackground (the circuit-path SVG + rAF pulse) is reused from the
 * existing migrated component at:
 *
 *   @/modules/home/sections/TechnicalBackground.client
 */

import TechnicalBackground from "@/modules/home/sections/TechnicalBackground.client";
import PricingCards from "@/modules/home/components/PricingCards.client";
import { pricingPlans } from "@/modules/home/data/content";

export default function PricingSection() {
    return (
        <section
            id="pricing"
            className="relative z-[60] w-screen max-w-full overflow-hidden border-b-[6px] border-black bg-[#050709] px-3 py-16 font-mono text-white sm:px-5 sm:py-20 lg:py-24"
        >
            {/* ── Dot grid ── */}
            <div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* ── Grain texture overlay ── */}
            <div className="pointer-events-none absolute inset-0 z-[2] bg-grain opacity-80" />

            {/* ── Ambient glow ── */}
            <div className="pointer-events-none absolute inset-0 z-[3]">
                <div className="absolute inset-0 bg-white/[0.025] blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/[0.035] blur-[100px]" />
            </div>

            {/* ── Circuit paths + travelling pulse (rAF — client only) ── */}
            <TechnicalBackground />

            {/* ── Bottom rule strip ── */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-14 border-t-[3px] border-white/10 bg-black/20" />

            {/* ── Pricing cards (GSAP scroll-entrance — client boundary) ── */}
            <PricingCards plans={pricingPlans} />
        </section>
    );
}
