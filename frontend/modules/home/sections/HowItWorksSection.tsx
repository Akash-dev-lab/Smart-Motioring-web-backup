import TechnicalBackground from "./TechnicalBackground.client";
import HowItWorksCards from "../components/HowItWorksCards.client";
import { howItWorksContent } from "../data/content";

const connectorDots = [
    { top: "18%", left: "10%" },
    { top: "38%", right: "9%" },
    { bottom: "20%", left: "18%" },
    { bottom: "12%", right: "22%" },
];

interface HowItWorksSectionProps {
    className?: string;
}

export default function HowItWorksSection({ className = "" }: HowItWorksSectionProps) {
    const { eyebrow, title, steps } = howItWorksContent;

    return (
        <section
            id="how-it-works"
            className={`relative z-100 min-h-screen w-screen max-w-full bg-[#111317] font-mono bg-grain overflow-hidden ${className}`}
        >
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

            {/* SCALED WATERMARK */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.14] z-0">
                <h2 className="text-[clamp(7rem,32vw,28rem)] font-black italic text-slate-600 leading-none tracking-normal sm:tracking-tighter uppercase">
                    FLOW
                </h2>
            </div>

            <div className="sticky top-0 h-screen sm:h-svh overflow-hidden">
                {/* Connector dots */}
                {connectorDots.map((style, index) => (
                    <div
                        key={index}
                        className="absolute h-2.5 w-2.5 rounded-full bg-black sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 z-10"
                        style={style}
                    />
                ))}

                {/* PERSISTENT HEADER UI */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-3 text-center select-none sm:px-4">
                    <span className="inline-flex max-w-[92vw] bg-none border border-green-400 px-3 py-1.5 font-black uppercase italic text-[10px] tracking-widest sm:text-xs text-green-500">
                        {eyebrow}
                    </span>
                    <h2 className="mt-4 max-w-[94vw] font-black italic uppercase text-white text-[clamp(3.15rem,14vw,12rem)] leading-[0.86] opacity-95 sm:mt-5 sm:max-w-[96vw] sm:text-[clamp(4.4rem,15vw,12rem)] sm:leading-[0.78]">
                        {title}
                    </h2>
                    <div className="mt-5 max-w-[92vw] bg-[#FFD600] border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] px-3 py-2 sm:mt-8 sm:border-4 sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:px-5 sm:py-3">
                        <p className="font-black uppercase italic text-[10px] leading-tight sm:text-sm md:text-base text-black">
                            monitor, detect, explain, resolve
                        </p>
                    </div>
                </div>

                {/* STACKING CARDS LAYER */}
                <HowItWorksCards steps={steps} />
            </div>
        </section>
    );
}
