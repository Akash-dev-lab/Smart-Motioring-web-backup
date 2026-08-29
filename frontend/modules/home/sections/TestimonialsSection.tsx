"use client";

/**
 * TestimonialsSection — Client Component
 *
 * Must be a Client Component because the GSAP ScrollTrigger animation:
 *   1. Pins the entire section (`pin: true` on `sectionRef`).
 *   2. Dynamically measures DOM to calculate horizontal travel distance.
 *   3. Drives a scrubbed horizontal carousel (`trackRef`) and card stagger
 *      (`cardRefs`) — all refs span the full section wrapper.
 *
 * TechnicalBackground (the circuit-path rAF pulse) is reused from:
 *   @/modules/home/sections/TechnicalBackground.client
 *
 * Testimonial data is sourced from:
 *   @/modules/home/data/content
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Activity,
    Quote,
    RadioTower,
    ServerCrash,
    ShieldCheck,
    TerminalSquare,
    type LucideIcon,
} from "lucide-react";

import TechnicalBackground from "@/modules/home/sections/TechnicalBackground.client";
import {
    testimonials,
    testimonialStats,
    type TestimonialIconKey,
} from "@/modules/home/data/content";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── Icon registry ────────────────────────────────────────────────────────────
// Maps the serialisable icon key stored in content.ts to the real Lucide component.
const ICON_MAP: Record<TestimonialIconKey, LucideIcon> = {
    Activity,
    Quote,
    RadioTower,
    ServerCrash,
    ShieldCheck,
    TerminalSquare,
};

// Initial card rotations — exactly as in the original implementation.
const CARD_ROTATIONS = [-2, 1.5, -1, 1, -1.4];

export default function TestimonialsSection() {
    const sectionRef  = useRef<HTMLElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef    = useRef<HTMLDivElement>(null);
    const cardRefs    = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const cards = cardRefs.current.filter(
            (el): el is HTMLElement => el !== null
        );
        if (!cards.length) return;

        const ctx = gsap.context(() => {
            // Set initial off-screen + rotated state for each card.
            gsap.set(cards, {
                autoAlpha: 0,
                x: 80,
                rotation: (index: number) => CARD_ROTATIONS[index] ?? 0,
            });

            // Calculate how far the track must travel so the last card
            // is fully visible at the right edge of the viewport.
            const getTravel = () => {
                const viewport = viewportRef.current;
                const lastCard = cards.at(-1);
                return lastCard && viewport
                    ? Math.max(0, lastCard.offsetLeft + lastCard.offsetWidth - viewport.clientWidth)
                    : 0;
            };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => `+=${getTravel()}`,
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            // Cards fade + slide in first, then the track shifts left in parallel.
            tl.to(
                cards,
                { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.25, ease: "none" },
                0
            ).to(
                trackRef.current,
                { x: () => -getTravel(), duration: 1, ease: "none" },
                0.08
            );

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative z-[60] h-screen h-[100svh] w-screen max-w-full overflow-hidden border-b-[6px] border-black bg-[#050709] font-mono text-white"
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

            {/* ── Circuit paths + travelling pulse (rAF — reused client component) ── */}
            <TechnicalBackground />

            {/* ── Bottom rule strip ── */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-14 border-t-[3px] border-white/10 bg-black/20" />

            {/* ── Horizontal carousel viewport ── */}
            <div ref={viewportRef} className="relative z-10 h-full overflow-hidden">
                <div
                    ref={trackRef}
                    className="flex h-full w-max items-center gap-4 px-8 py-7 sm:gap-6 sm:px-12 lg:px-20"
                >
                    {/* ── Intro panel ── */}
                    <div className="flex h-[min(520px,78svh)] w-[88vw] max-w-[920px] shrink-0 flex-col justify-center text-white lg:w-[820px]">
                        <div>
                            <div className="inline-flex bg-[#FFFF00] px-3 py-1.5 font-black uppercase italic tracking-[0.18em] text-black text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:text-xs">
                                customer signal log
                            </div>
                            <h2
                                className="mt-4 max-w-[12ch] text-wrap font-black uppercase italic leading-[0.88] text-[clamp(2.35rem,8vw,5.9rem)] sm:mt-5 sm:text-[clamp(3rem,7.5vw,6.7rem)]"
                                style={{
                                    WebkitTextStroke: "clamp(1px, 0.16vw, 1.5px) white",
                                }}
                            >
                                Teams that caught it first.
                            </h2>
                        </div>

                        {/* ── Summary stat tiles ── */}
                        <div className="mt-5 grid w-full max-w-lg grid-cols-3 gap-2 sm:mt-7 sm:gap-3">
                            {testimonialStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="border-[3px] border-white bg-black px-2 py-3 text-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:px-3 sm:py-4"
                                >
                                    <span className="block font-black uppercase tracking-[0.12em] text-[9px] sm:text-[10px]">
                                        {stat.label}
                                    </span>
                                    <span className="mt-1 block font-black text-green-400 text-xl leading-none sm:text-3xl">
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Testimonial cards ── */}
                    {testimonials.map((item, index) => {
                        const Icon = ICON_MAP[item.iconKey];

                        return (
                            <article
                                key={item.name}
                                ref={(el) => { cardRefs.current[index] = el; }}
                                className="relative flex h-[min(390px,76svh)] w-[88vw] max-w-[540px] shrink-0 flex-col justify-between border-2 border-green-400 rounded-lg bg-black p-4 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1),0_0_28px_rgba(0,230,118,0.08)] sm:w-[500px] sm:p-5"
                            >
                                {/* Quote icon + category badge */}
                                <div className="flex items-start justify-between gap-4">
                                    <Quote className="h-9 w-9 text-[#00E676]" strokeWidth={3.4} />
                                    <div className="grid h-14 w-14 shrink-0 place-items-center bg-[#FFFF00]">
                                        <Icon className="h-7 w-7 text-[#000000]" />
                                    </div>
                                </div>

                                {/* Quote text */}
                                <p className="mt-4 font-black uppercase italic leading-[1.02] text-[clamp(1.05rem,3.6vw,1.78rem)] sm:mt-5 sm:leading-[0.98]">
                                    {item.quote}
                                </p>

                                {/* Footer — metric + attribution + index */}
                                <div className="mt-4 border-t-[3px] border-white pt-3 sm:mt-5 sm:pt-4">
                                    <span className="inline-flex border-[3px] border-white bg-black px-2 py-1 font-black uppercase tracking-[0.13em] text-[#FFFF00] text-[10px]">
                                        {item.metric}
                                    </span>
                                    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                                        <div className="min-w-0 pr-1">
                                            <h3 className="break-words font-black uppercase text-lg leading-[0.95] sm:text-xl">
                                                {item.name}
                                            </h3>
                                            <p className="mt-1 break-words font-bold uppercase tracking-[0.08em] text-white/70 text-[10px] sm:text-xs">
                                                {item.role} / {item.company}
                                            </p>
                                        </div>
                                        <span className="shrink-0 border-2 border-green-400 text-green-400 px-2 py-1 font-black text-xs">
                                            0{index + 1}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
