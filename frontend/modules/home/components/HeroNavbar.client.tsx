"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

const navItems = [
    { label: "Features", href: "#features" },
    { label: "Flow", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
];

export default function HeroNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const navbarRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            ref={navbarRef}
            className={`absolute left-0 top-0 z-30 w-full px-2.5 py-2.5 transition-all duration-500 sm:px-5 sm:py-3 lg:px-8 ${isScrolled ? "navbar-scrolled" : ""
                }`}
        >
            <div
                className="
                    mx-auto grid max-w-7xl
                    grid-cols-[1fr_auto]
                    items-center gap-2
                    rounded-[1.1rem]
                    border border-white/10
                    bg-[#071326]/45
                    px-2.5 py-1.5
                    shadow-[0_8px_35px_rgba(0,0,0,0.16)]
                    backdrop-blur-xl
                    transition-all duration-500
                    sm:gap-3
                    sm:rounded-[1.35rem]
                    sm:px-3
                    sm:py-2
                    md:grid-cols-[1fr_auto_1fr]
                    md:px-4
                    hover:border-white/[0.14]
                "
            >
                {/* =====================================================
                    BRAND
                ===================================================== */}
                <Link
                    href="/"
                    className="flex min-w-0 items-center gap-2.5 sm:gap-3"
                    aria-label="Smart Monitoring home"
                >
                    <span
                        className="
                            relative grid h-10 w-10 shrink-0
                            place-items-center overflow-hidden
                            rounded-xl
                            border border-[#75ff9e]/30
                            bg-[#0b1730]/60
                            text-lg font-bold
                            text-[#75ff9e]
                            shadow-[inset_0_0_18px_rgba(160,120,255,0.08)]
                            sm:h-11 sm:w-11
                            sm:rounded-2xl
                            sm:text-xl
                        "
                        style={{
                            fontFamily: "Geist, sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {/* Tiny status strip */}
                        <span
                            className="
                                absolute inset-x-0 top-0
                                h-1.5
                                bg-[#4ae176]/20
                                border-b border-[#4ae176]/35
                            "
                        />
                        S
                    </span>

                    <span className="hidden min-w-0 sm:block">
                        <span
                            className="
                                block truncate
                                text-lg font-semibold
                                leading-none
                                uppercase
                                text-[#4ae176]
                                sm:text-xl
                            "
                            style={{
                                fontFamily: "Manrope, sans-serif",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            Smart Monitoring
                        </span>

                        <span
                            className="
                                mt-1 hidden truncate
                                text-[9px] font-medium
                                uppercase tracking-wider    
                                text-[#8e9ab0]
                                sm:block
                            "
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                letterSpacing: "0.05em",
                            }}
                        >
                            AI incident command
                        </span>
                    </span>
                </Link>

                {/* =====================================================
                    CENTER NAVIGATION
                ===================================================== */}
                <nav
                    className="
                        hidden items-center
                        rounded-full
                        border border-white/9
                        bg-[#081326]/35
                        p-1
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
                        backdrop-blur-lg
                        md:flex
                    "
                    aria-label="Primary navigation"
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="
                                rounded-full
                                px-4 py-2
                                text-xs font-medium
                                uppercase tracking-wider
                                text-[#aab4c5]
                                transition-all duration-300
                                hover:bg-white/6
                                hover:text-[#eef1f7]
                            "
                            style={{
                                fontFamily: "Inter, sans-serif",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* =====================================================
                    ACCOUNT ACTIONS
                ===================================================== */}
                <nav
                    className="flex items-center justify-end gap-2 sm:gap-3"
                    aria-label="Account actions"
                >
                    {/* Sign In */}
                    <Link
                        href="/signin"
                        className="
                            inline-flex h-10
                            items-center justify-center
                            gap-1.5
                            rounded-xl
                            border border-white/12
                            bg-white/[0.035]
                            px-2.5
                            text-[11px] font-medium
                            text-[#e1e6ee]
                            backdrop-blur-md
                            transition-all duration-300
                            hover:border-white/20
                            hover:bg-white/[0.07]
                            hover:text-white
                            min-[360px]:px-3
                            sm:gap-2
                            md:px-4
                            md:text-sm
                        "
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        <LogIn size={16} strokeWidth={2.5} />
                        <span className="hidden min-[380px]:inline">
                            Sign in
                        </span>
                    </Link>

                    {/* Sign Up */}
                    <Link
                        href="/signup"
                        className="
                            group inline-flex h-10
                            items-center justify-center
                            gap-1.5
                            rounded-xl
                            border border-[#75ff9e]/25
                            bg-[#75ff9e]/75
                            px-2.5
                            text-[11px] font-medium
                            text-[#00210b]
                            shadow-[0_6px_20px_rgba(117,87,220,0.16)]
                            backdrop-blur-md
                            transition-all duration-300
                            hover:border-[#75ff9e]/40
                            hover:bg-[#75ff9e]/85
                            hover:shadow-[0_8px_25px_rgba(117,87,220,0.22)]
                            min-[360px]:px-3
                            sm:gap-2
                            md:px-4
                            md:text-sm
                        "
                        style={{ fontFamily: "Manrope, sans-serif" }}
                    >
                        <UserPlus
                            size={16}
                            strokeWidth={2.5}
                            className="sm:hidden"
                        />
                        <span>Sign up</span>
                        <ArrowRight
                            size={16}
                            strokeWidth={2.5}
                            className="
                                hidden
                                transition-transform
                                group-hover:translate-x-0.5
                                sm:block
                            "
                        />
                    </Link>
                </nav>
            </div>
        </header>
    );
}