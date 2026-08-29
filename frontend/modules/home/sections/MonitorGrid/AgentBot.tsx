import React from "react";

interface AgentBotProps {
    botRef: React.RefObject<HTMLDivElement | null>;
}

export default function AgentBot({ botRef }: AgentBotProps) {
    return (
        <div
            ref={botRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-25 h-25 bg-[#0A0E17] rounded-full border-2 border-white/5 shadow-[inset_0_4px_12px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center z-30"
            id="monitoring-agent"
            style={{
                backdropFilter: "blur(8px)",
                imageRendering: "crisp-edges",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale",
                transformStyle: "preserve-3d",
                zIndex: 30,
            }}
        >
            {/* Pulse Ring Effect */}
            <div
                className="absolute inset-0 bg-[#75ff9e]/20 rounded-full animate-ping opacity-75"
                style={{
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                }}
            />

            {/* Face/Eyes */}
            <div
                className="flex gap-4 items-center relative z-10"
                style={{
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                }}
            >
                <div
                    className="bot-eye w-4 h-2 bg-[#75ff9e] rounded-full shadow-[0_0_8px_#75ff9e]"
                    style={{
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                    }}
                />
                <div
                    className="bot-eye w-4 h-2 bg-[#75ff9e] rounded-full shadow-[0_0_8px_#75ff9e]"
                    style={{
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                    }}
                />
            </div>

            {/* Status LED */}
            <div
                className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#75ff9e] rounded-full shadow-[0_0_6px_#75ff9e] animate-pulse"
                style={{
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                }}
            />
        </div>
    );
}
