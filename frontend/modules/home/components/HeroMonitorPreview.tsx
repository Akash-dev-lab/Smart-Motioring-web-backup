import React from "react";

export default function HeroMonitorPreview() {
    return (
        <div
            className="
                relative flex h-125 w-full flex-col overflow-hidden
                rounded-[18px]
                border border-transparent
                bg-transparent
                shadow-[0_0_35px_rgba(74,225,118,0.12)]
                transition-all duration-500
                hover:shadow-[0_0_55px_rgba(117,255,158,0.20)]
            "
        >
            <div
                className="
                    pointer-events-none absolute inset-0 z-0
                    rounded-[18px]
                    p-px
                    bg-linear-to-br
                    from-[#060a10]
                    via-[#2d5e26]
                    to-[#163720]
                    opacity-90
                "
            >
                <div className="h-full w-full rounded-[17px] bg-[#07101d]/35" />
            </div>

            {/* Header */}
            <div className="flex h-10 items-center justify-between border-b border-[#75ff9e]/20 bg-white/2.5 backdrop-blur-xl px-4 z-10">
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs font-medium tracking-wider text-white"
                        style={{
                            fontFamily: "JetBrains Mono, monospace",
                            letterSpacing: "0.05em",
                        }}
                    >
                        SMART MONITOR
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ae176]"></span>
                    <span
                        className="text-[10px] text-[#4ae176]"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                    >
                        LIVE
                    </span>
                </div>
            </div>

            <div className="flex h-full flex-col gap-6 p-6 z-10">
                {/* Top Metrics */}
                <div className="flex items-end justify-between border-b border-white/10 text-white pb-4">
                    <div>
                        <div
                            className="mb-1 text-[11px]"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            TARGET
                        </div>
                        <div
                            className="flex items-center gap-2 text-sm"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            api.example.com{" "}
                            <span
                                className="text-xs"
                                style={{ color: "rgba(255, 255, 255, 0.6)" }}
                            >
                                (GET)
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div
                            className="mb-1 inline-block rounded bg-[#4ae176]/10 px-2 py-0.5 text-xs font-medium tracking-wider text-[#4ae176]"
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                letterSpacing: "0.05em",
                            }}
                        >
                            UP
                        </div>
                        <div
                            className="text-[11px]"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            99.98% UPTIME
                        </div>
                    </div>
                    <div className="hidden text-right sm:block">
                        <div
                            className="mb-1 text-[11px]"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            LATENCY
                        </div>
                        <div
                            className="text-sm"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            142ms
                        </div>
                    </div>
                    <div className="hidden text-right md:block">
                        <div
                            className="mb-1 text-[11px]"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            CHECKS (1H)
                        </div>
                        <div
                            className="text-sm"
                            style={{ fontFamily: "JetBrains Mono, monospace" }}
                        >
                            1,284
                        </div>
                    </div>
                </div>

                {/* Graph Area */}
                <div className="relative flex grow flex-col">
                    <div className="mb-4 flex items-center justify-between">
                        <span
                            className="text-[10px] font-medium tracking-wider"
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                letterSpacing: "0.05em",
                                color: "#ffffff",
                            }}
                        >
                            LIVE LATENCY
                        </span>
                        <span
                            className="text-[10px] font-medium tracking-wider"
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                letterSpacing: "0.05em",
                                color: "rgba(255, 255, 255, 0.8)",
                            }}
                        >
                            LAST 60 MIN
                        </span>
                    </div>
                    {/* SVG Graph */}
                    <div className="relative grow border-b border-l border-white/10">
                        <svg
                            className="absolute inset-0 h-full w-full"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                        >
                            <path
                                className="text-[#75ff9e] opacity-50"
                                d="M0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                            />
                            <path
                                className="opacity-20"
                                d="M0,100 L0,80 Q10,70 20,85 T40,60 T60,75 T80,40 T100,50 L100,100 Z"
                                fill="url(#hero-monitor-grad)"
                            />
                            <defs>
                                <linearGradient
                                    id="hero-monitor-grad"
                                    x1="0"
                                    x2="0"
                                    y1="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#d0bcff"
                                        stopOpacity="1"
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="#d0bcff"
                                        stopOpacity="0"
                                    />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* Grid lines */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            <div className="h-px w-full border-t border-white/5"></div>
                            <div className="h-px w-full border-t border-white/5"></div>
                            <div className="h-px w-full border-t border-white/5"></div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Regions & Logs */}
                <div className="grid h-32 grid-cols-2 gap-6">
                    {/* Regional */}
                    <div className="flex z-10 text-white flex-col rounded border border-white/5 bg-[#191c1e] p-3">
                        <div
                            className="mb-3 text-[10px] font-medium tracking-wider"
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                letterSpacing: "0.05em",
                            }}
                        >
                            REGIONAL CHECKS
                        </div>
                        <div className="flex grow flex-col justify-between gap-1">
                            <div
                                className="flex items-center justify-between text-[11px]"
                                style={{ fontFamily: "JetBrains Mono, monospace" }}
                            >
                                <span style={{ color: "#ffffff" }}>US-EAST</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]"></span>
                            </div>
                            <div
                                className="flex items-center justify-between text-[11px]"
                                style={{ fontFamily: "JetBrains Mono, monospace" }}
                            >
                                <span style={{ color: "#ffffff" }}>EU-WEST</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]"></span>
                            </div>
                            <div
                                className="flex items-center justify-between text-[11px]"
                                style={{ fontFamily: "JetBrains Mono, monospace" }}
                            >
                                <span style={{ color: "#ffffff" }}>AP-SOUTH</span>
                                <span className="h-1.5 w-1.5 rounded-full bg-[#4ae176]"></span>
                            </div>
                        </div>
                    </div>

                    {/* Logs */}
                    <div className="relative flex flex-col overflow-hidden rounded border border-white/5 bg-black p-3">
                        <div
                            className="relative z-10 mb-2 bg-black text-[10px] font-medium tracking-wider"
                            style={{
                                fontFamily: "JetBrains Mono, monospace",
                                letterSpacing: "0.05em",
                                color: "#ffffff",
                            }}
                        >
                            ACTIVITY FEED
                        </div>
                        <div
                            className="relative grow overflow-hidden"
                            style={{
                                maskImage:
                                    "linear-gradient(to bottom, black 50%, transparent 100%)",
                                WebkitMaskImage:
                                    "linear-gradient(to bottom, black 50%, transparent 100%)",
                            }}
                        >
                            <div
                                className="absolute inset-0 flex flex-col text-[10px] leading-relaxed animate-scroll"
                                style={{
                                    fontFamily: "JetBrains Mono, monospace",
                                    color: "#ffffff",
                                }}
                            >
                                <div>14:32:08 CHECK 200 OK - 142ms</div>
                                <div>14:31:08 CHECK 200 OK - 145ms</div>
                                <div>14:30:08 CHECK 200 OK - 139ms</div>
                                <div className="text-[#4ae176]">
                                    14:29:08 SYNC COMPLETE
                                </div>
                                <div>14:28:08 CHECK 200 OK - 141ms</div>
                                <div>14:27:08 CHECK 200 OK - 140ms</div>
                                <div className="text-[#958ea0]">
                                    14:26:08 AI ANALYSIS ACTIVE
                                </div>
                                <div>14:25:08 CHECK 200 OK - 144ms</div>
                            </div>
                        </div>
                        {/* AI Indicator */}
                        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 rounded border border-[#d0bcff]/20 bg-[#101415] px-2 py-1">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d0bcff]"></span>
                            <span
                                className="text-[8px] font-medium tracking-wider     text-[#d0bcff]"
                                style={{
                                    fontFamily: "JetBrains Mono, monospace",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                AI INCIDENT ANALYSIS
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle glow effect */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-[#d0bcff] opacity-5 blur-3xl"></div>
        </div>
    );
}
