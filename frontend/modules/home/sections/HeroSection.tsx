import { ArrowRight } from "lucide-react";
import HeroNavbar from "../components/HeroNavbar.client";
import HeroMonitorPreview from "../components/HeroMonitorPreview";
import TechnicalBackground from "./TechnicalBackground.client";

const HeroSection = () => {
    return (
        <section className="bg-grain relative flex min-h-180 w-full flex-col items-center overflow-hidden bg-[#111317] px-3 pb-10 pt-19 font-mono sm:min-h-[112svh] sm:px-5 sm:pb-14 sm:pt-24 lg:pt-25 max-[380px]:px-2">
            {/* Grid Background */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Whitish Glow Effect in Middle */}
            <div className="absolute inset-0 z-2 pointer-events-none">
                <div className="absolute w-full h-full bg-white/20 blur-[300px]" />
                <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[100px]" />
            </div>

            {/* Technical Circuit Background */}
            <div className="pointer-events-none absolute inset-0 z-1">
                <TechnicalBackground />
            </div>

            {/* Circular Accent Overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-3 opacity-[0.11] mix-blend-multiply"
                style={{ backgroundColor: "#cbc3d7" }}
            >
                <div className="absolute left-1/2 top-1/2 h-[74vmin] w-[74vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3.5rem] border-black" />
            </div>

            {/* Header / Navbar */}
            <HeroNavbar />

            {/* Main Hero Content - Two Column Layout */}
            <main className="relative z-10 mx-auto flex w-full max-w-7xl grow items-center justify-center px-6 py-10">
                <div className="grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* Left Column: Copy */}
                    <div className="flex flex-col items-start space-y-8">
                        {/* Real-time Observability Badge */}
                        <div className="flex items-center gap-2 rounded-full border border-[#3b4a3d] bg-[#1a1c1f] px-3 py-1">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffe0bc]"></span>
                            <span
                                className="text-xs font-medium uppercase tracking-[0.05em] text-[#bacbb9]"
                                style={{
                                    fontFamily: "JetBrains Mono, monospace",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                REAL-TIME OBSERVABILITY
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1
                            className="text-5xl font-bold leading-tight text-[#e2e2e6] lg:text-6xl"
                            style={{
                                fontFamily: "Manrope, sans-serif",
                                letterSpacing: "-0.04em",
                                lineHeight: "1.17",
                                fontWeight: "700",
                            }}
                        >
                            Know when your
                            <br />
                            systems fail.
                        </h1>

                        {/* Description */}
                        <p
                            className="max-w-xl text-base leading-6 text-[#bacbb9]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Real-time website and API monitoring with regional checks,
                            incident detection, AI-powered analysis and live status updates.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4 pt-4">
                            <button className="flex items-center cursor-pointer gap-2 rounded bg-[#4ae176] px-8 py-3 font-medium text-[#00210b] transition-colors hover:bg-[#67fa98]">
                                Start Monitoring
                                <ArrowRight size={16} />
                            </button>
                            <button className="rounded border cursor-pointer border-[#859585] px-8 py-3 font-medium text-[#e2e2e6] transition-colors hover:border-[#75ff9e] hover:text-[#75ff9e]">
                                View Demo
                            </button>
                        </div>

                        {/* Live Status Indicator */}
                        <div className="flex w-full max-w-md items-center gap-3 border-t border-white/10 pt-8">
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#75ff9e]"></span>
                                <span
                                    className="text-xs font-medium uppercase tracking-[0.05em] text-[#bacbb9]"
                                    style={{
                                        fontFamily: "JetBrains Mono, monospace",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    MONITORING ACTIVE • REALTIME CONNECTED
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dashboard UI */}
                    <HeroMonitorPreview />
                </div>
            </main>
        </section>
    );
};

export default HeroSection;