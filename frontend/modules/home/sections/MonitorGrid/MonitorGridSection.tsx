import TechnicalBackground from "../TechnicalBackground.client";
import MonitorPlayground from "./MonitorPlayground.client";

interface CircuitNodeConfig {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    delay: number;
}

const circuitNodes: CircuitNodeConfig[] = [
    { top: "20%", left: "25%", delay: 0 },
    { top: "30%", right: "22%", delay: 0.05 },
    { bottom: "28%", left: "20%", delay: 0.1 },
    { bottom: "20%", right: "28%", delay: 0.15 },
    { top: "45%", left: "18%", delay: 0.08 },
    { top: "50%", right: "15%", delay: 0.12 },
];

const clusterDots = [
    { top: "42%", left: "44%" },
    { bottom: "35%", right: "28%" },
    { top: "12%", left: "12%" },
    { bottom: "15%", left: "45%" },
    { top: "65%", right: "10%" },
    { bottom: "10%", left: "10%" },
];

export default function MonitorGridSection() {
    return (
        <section
            id="features"
            className="relative min-h-195 w-full overflow-hidden bg-[#111317] font-mono bg-grain sm:h-svh sm:min-h-0"
        >
            {/* Background wrapper for shiver effect */}
            <div className="background-shiver absolute inset-0">
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

                {/* Circuit Lines Background */}
                <TechnicalBackground />

                {/* Circuit nodes for reaction */}
                {circuitNodes.map((style, i) => (
                    <div
                        key={i}
                        className="circuit-node absolute w-2 h-2 bg-[#75ff9e] rounded-full opacity-60 z-10 pointer-events-none"
                        style={{
                            ...style,
                            boxShadow: "0 0 8px #75ff9e",
                            transition: "all 0.3s ease",
                        }}
                    />
                ))}

                {/* SCALED WATERMARK - Responsive scale */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.14] z-0">
                    <h2 className="text-[clamp(7rem,32vw,28rem)] font-black italic text-slate-600 leading-none tracking-normal sm:tracking-tighter uppercase">
                        CORE
                    </h2>
                </div>
            </div>

            {/* SEARCH BAR - Typing Animation */}
            <div className="absolute top-2 left-[50%] -translate-x-1/2 z-200 w-max max-w-[92vw]">
                <div className="bg-none border border-green-400 px-4 sm:px-6 md:px-10 py-1.5 sm:py-2 md:py-2.5 rounded-xl flex items-center gap-3 sm:gap-4 md:gap-6">
                    <div className="animate-typing">
                        <span className="font-black uppercase italic tracking-[0.08em] sm:tracking-widest text-green-500 text-base sm:text-lg md:text-xl">
                            FEATURES
                        </span>
                    </div>
                </div>
            </div>

            {/* CLUSTERED DOTS - Distributed across screen gutters */}
            {clusterDots.map((style, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-black rounded-full z-10 pointer-events-none"
                    style={style}
                />
            ))}

            {/* Interactive Canvas Area with Bot and Telemetry Clouds */}
            <MonitorPlayground />
        </section>
    );
}
