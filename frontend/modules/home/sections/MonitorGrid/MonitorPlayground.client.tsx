"use client";

import { useRef } from "react";
import TelemetryClouds from "./TelemetryClouds";
import AgentBot from "./AgentBot";
import { useMonitorPlaygroundAnimation } from "./useMonitorPlaygroundAnimation";

interface MonitorPlaygroundProps {
    className?: string;
}

export default function MonitorPlayground({ className = "" }: MonitorPlaygroundProps) {
    const playgroundRef = useRef<HTMLDivElement | null>(null);
    const botRef = useRef<HTMLDivElement | null>(null);
    const shockwaveRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useMonitorPlaygroundAnimation({
        playgroundRef,
        botRef,
        shockwaveRef,
        cardRefs,
    });

    return (
        <div
            ref={playgroundRef}
            id="playground"
            className={`relative w-full max-w-6xl h-150 mx-auto mt-24 z-20 ${className}`}
        >
            {/* Shockwave Effect */}
            <div
                ref={shockwaveRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-25 h-25 rounded-full pointer-events-none z-40"
                style={{
                    background:
                        "radial-gradient(circle, rgba(117, 255, 158, 0.4) 0%, rgba(117, 255, 158, 0.2) 40%, rgba(117, 255, 158, 0) 70%)",
                    border: "2px solid rgba(117, 255, 158, 0.6)",
                    boxShadow:
                        "0 0 40px rgba(117, 255, 158, 0.4), inset 0 0 20px rgba(117, 255, 158, 0.3)",
                    opacity: 0,
                    transform: "scale(0.5)",
                }}
            />

            {/* SVG Connectors */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                id="connector-svg"
                style={{ filter: "drop-shadow(0 0 2px rgba(117,255,158,0.2))" }}
            />

            {/* Center Character (Agent Bot) */}
            <AgentBot botRef={botRef} />

            {/* Telemetry Clouds */}
            <TelemetryClouds cardRefs={cardRefs} />
        </div>
    );
}
