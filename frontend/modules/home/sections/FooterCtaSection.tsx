"use client";

/**
 * FooterCtaSection — Client Component
 *
 * Must be "use client" because all four GSAP animations reference DOM elements
 * via useRef and depend on the mounted DOM for measurements:
 *
 *   1. Floor perspective tilt — GSAP ScrollTrigger on `floorRef` (the 3D
 *      checkered floor panel). rotateX: 90 → 65 on scroll-scrub.
 *   2. Windows landing — `.drop-window` elements animate from y: -500 on entry.
 *   3. Footer nav points — `.footer-point` items slide in from the left.
 *   4. Ticker strip — infinite `xPercent: -50` loop on `stripTrackRef`.
 *
 * TechnicalBackground (circuit SVG + rAF pulse) is reused from:
 *   @/modules/home/sections/TechnicalBackground.client
 *
 * Footer data is sourced from:
 *   @/modules/home/data/content
 *
 * IconTileLink and WindowDots are small presentational utilities from the old
 * `src/pages/home/components/` folder — inlined here since they are private to
 * this section and not used anywhere else.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Activity,
    ArrowRight,
    Code2,
    Hash,
    Mail,
    Zap,
    type LucideIcon,
} from "lucide-react";

import TechnicalBackground from "@/modules/home/sections/TechnicalBackground.client";
import { footerGroups, tickerItems } from "@/modules/home/data/content";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── Inlined sub-components (private to this footer) ─────────────────────────

interface IconTileLinkProps {
    href?: string;
    label: string;
    className?: string;
    children: React.ReactNode;
}

function IconTileLink({ href = "#", label, className = "", children }: IconTileLinkProps) {
    return (
        <a
            className={`grid h-10 w-10 place-items-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 md:h-11 md:w-11 md:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${className}`}
            href={href}
            aria-label={label}
        >
            {children}
        </a>
    );
}

const DEFAULT_DOT_COLORS = ["bg-[#FF5F56]", "bg-[#FFBD2E]", "bg-[#00E676]"] as const;

interface WindowDotsProps {
    className?: string;
    dotClassName?: string;
    colors?: readonly string[];
}

function WindowDots({
    className = "",
    dotClassName = "",
    colors = DEFAULT_DOT_COLORS,
}: WindowDotsProps) {
    return (
        <div className={`flex gap-1.5 ${className}`}>
            {colors.map((color, index) => (
                <span
                    key={`${color}-${index}`}
                    className={`h-1.5 w-1.5 rounded-full border-black md:h-2 md:w-2 ${color} ${dotClassName}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                />
            ))}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FooterCtaSection() {
    const sectionRef    = useRef<HTMLElement>(null);
    const floorRef      = useRef<HTMLDivElement>(null);
    const stripTrackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. FLOOR PERSPECTIVE — tilts from flat (90°) into a slight incline (65°) as
            //    the section enters the viewport from below.
            gsap.fromTo(
                floorRef.current,
                { rotateX: 90, y: 0 },
                {
                    rotateX: 65,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    },
                }
            );

            // 2. WINDOWS LANDING — CTA windows drop in from above.
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
                },
            });

            // 3. FOOTER NAV POINTS — footer link rows slide in from the left.
            gsap.from(".footer-point", {
                x: -28,
                autoAlpha: 0,
                stagger: 0.055,
                duration: 0.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".footer-nav",
                    start: "top 82%",
                },
            });

            // 4. TICKER STRIP — infinite left-running marquee via GSAP (no CSS needed).
            gsap.to(stripTrackRef.current, {
                xPercent: -50,
                duration: 18,
                ease: "none",
                repeat: -1,
            });

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={sectionRef}
            className="relative w-full bg-[#1c1c1c] pt-32 pb-16 md:pb-24 overflow-hidden font-mono"
            style={{ perspective: "1500px", perspectiveOrigin: "50% 0%" }}
        >
            {/* ── 3D Checkered floor — CTA background ── */}
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
                    backgroundSize: "100px 100px",
                    backgroundPosition: "0 0, 0 50px, 50px -50px, -50px 0px",
                    backgroundColor: "#1c1c1c",
                    transformOrigin: "top center",
                    borderTop: "6px solid black",
                }}
            />

            {/* ── Tech background only behind lower footer / nav area ── */}
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 top-[31.25rem] z-[1] overflow-hidden"
                aria-hidden="true"
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute inset-0 bg-grain opacity-80" />
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-white/[0.025] blur-[120px]" />
                    <div className="absolute bottom-1/4 left-1/4 h-1/3 w-1/3 rounded-full bg-white/[0.035] blur-[100px]" />
                </div>
                <TechnicalBackground />
            </div>

            {/* ── Ticker strip ── */}
            <div className="absolute inset-x-0 top-0 z-[5] overflow-hidden border-y-[6px] border-black bg-[#000000] py-2 shadow-[0_8px_0px_0px_rgba(0,0,0,1)]">
                <div
                    ref={stripTrackRef}
                    className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform"
                >
                    {[0, 1].map((repeatIndex) => (
                        <div key={repeatIndex} className="flex items-center gap-8">
                            {tickerItems.map((item) => (
                                <span
                                    key={`${repeatIndex}-${item}`}
                                    className="flex items-center gap-3 font-black uppercase italic tracking-[0.18em] text-green-500 text-[10px] sm:text-xs"
                                >
                                    <span className="h-2.5 w-2.5 border-2 border-black bg-[#fafafa]" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

                {/* ── CTA content stack ── */}
                <div className="relative h-100 md:h-125 flex items-center justify-center">

                    {/* Main CTA window */}
                    <div className="drop-window relative w-full max-w-[90vw] md:max-w-md bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] md:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
                        <div className="bg-black border-b-[6px] border-black p-2 md:p-3 flex justify-between items-center text-white">
                            <WindowDots
                                dotClassName="h-3 w-3 border-2 md:h-4 md:w-4 animate-dot"
                                colors={["bg-[#FF5F56]", "bg-[#FFBD2E]", "bg-[#00E676]"]}
                            />
                            <span className="text-[9px] md:text-[10px] font-black italic text-green-400 tracking-widest uppercase">
                                System_Active
                            </span>
                        </div>

                        <div className="p-6 md:p-10 text-center">
                            <h2 className="font-black text-black leading-[0.85] text-4xl sm:text-5xl md:text-6xl uppercase italic mb-6 md:mb-8">
                                FIND <br />THE{" "}
                                <span className="bg-[#53ff1e] text-white px-1.5 md:px-2">
                                    SIGNAL.
                                </span>
                            </h2>
                            <button
                                type="button"
                                className="group w-full bg-[#FFFF00] cursor-pointer border-4 border-black p-3 md:p-4 text-black font-black uppercase italic text-base md:text-xl flex items-center justify-between hover:translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                <span>Launch_Console</span>
                                <Zap fill="currentColor" size={20} className="md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Floating activity badge — hidden on very small screens */}
                    <div className="drop-window absolute -right-4 top-16 md:-right-6 md:top-10 bg-black border-4 border-black p-3 md:p-5 rotate-[8deg] z-30 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hidden sm:block">
                        <Activity className="text-[#00E676] w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
                        <p className="text-[8px] md:text-[10px] font-black text-white mt-2 uppercase tracking-tighter">
                            Live_Pulse
                        </p>
                    </div>
                </div>

                {/* ── Brutalist nav grid ── */}
                <div className="footer-nav grid gap-12 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.05fr_1fr_1fr_1fr] mt-12 md:mt-24">

                    {/* Branding column */}
                    <div className="space-y-6 lg:pr-6">
                        <div className="bg-black text-white p-4 inline-block transform -skew-x-12 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,230,118,1)]">
                            <h3 className="text-2xl md:text-3xl font-black italic uppercase leading-none tracking-tighter">
                                Smart Monitoring
                            </h3>
                        </div>
                        <p className="max-w-xs text-xs md:text-sm font-black uppercase italic leading-tight text-white">
                            Production monitoring that turns alert noise into a readable incident trail.
                        </p>
                        <div className="flex gap-3">
                            <IconTileLink className="bg-white text-black" label="Email Drishyam">
                                <Mail className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={3} />
                            </IconTileLink>
                            <IconTileLink className="bg-[#3cff00] text-black" label="Developer resources">
                                <Code2 className="h-[18px] w-[18px] md:h-5 md:w-5" strokeWidth={3} />
                            </IconTileLink>
                        </div>
                    </div>

                    {/* Link group columns */}
                    {footerGroups.map((group, groupIndex) => {
                        // Global 1-based index for numbering badge (counts all preceding links)
                        const groupOffset = footerGroups
                            .slice(0, groupIndex)
                            .reduce((total, g) => total + g.links.length, 0);

                        return (
                            <div key={group.title}>
                                <div className="mb-5 flex items-end justify-between gap-3 border-b-4 border-white pb-3">
                                    <div>
                                        <h4 className="inline-block border-2 border-black bg-[#04ff00] px-2 font-black uppercase italic tracking-widest text-black text-[9px] md:text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            {group.title}
                                        </h4>
                                        <p className="mt-2 md:mt-3 font-black uppercase tracking-[0.16em] text-white text-[8px] md:text-[9px]">
                                            {group.kicker}
                                        </p>
                                    </div>
                                    <Hash className="h-4 w-4 text-white md:h-[18px] md:w-[18px]" strokeWidth={4} />
                                </div>

                                <ul className="grid gap-3">
                                    {group.links.map((link, linkIndex) => {
                                        const globalIndex = groupOffset + linkIndex + 1;

                                        return (
                                            <li key={link.label} className="footer-point">
                                                <a
                                                    href={link.href ?? "#"}
                                                    className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] md:grid-cols-[2.35rem_minmax(0,1fr)_auto] items-center gap-2 md:gap-3 border-4 border-black bg-white/95 p-2 md:p-3 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-[#00E676] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
                                                >
                                                    <span className="grid h-8 w-8 md:h-9 md:w-9 place-items-center border-2 border-black bg-[#26ff1e] font-black text-black text-[9px] md:text-[10px]">
                                                        {String(globalIndex).padStart(2, "0")}
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
                                                        className="h-[15px] w-[15px] transition-transform group-hover:translate-x-1 md:h-[17px] md:w-[17px]"
                                                        strokeWidth={4}
                                                    />
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
}
