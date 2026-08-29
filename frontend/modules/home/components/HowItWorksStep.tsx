import React, { forwardRef } from "react";
import { Activity, BellRing, Globe2, Wrench } from "lucide-react";
import { HowItWorksStepData } from "../data/content";

const iconMap: Record<string, React.ElementType> = {
    connect: Globe2,
    probe: Activity,
    alert: BellRing,
    resolve: Wrench,
};

interface HowItWorksStepProps {
    step: HowItWorksStepData;
    className?: string;
    style?: React.CSSProperties;
}

const HowItWorksStep = forwardRef<HTMLElement, HowItWorksStepProps>(
    ({ step, className = "", style }, ref) => {
        const Icon = iconMap[step.id] || Activity;
        const isAlertCard = step.id === "alert";
        const isResolveCard = step.id === "resolve";

        // Special visual for Alert / Detect Incident card
        if (isAlertCard) {
            return (
                <article
                    ref={ref}
                    className={`bg-black rounded-xl p-8 ${className}`}
                    style={style}
                >
                    {/* Top gradient line */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "1px",
                            background:
                                "linear-gradient(90deg, transparent, rgba(117, 255, 158, 0.5), rgba(208, 188, 255, 0.5), transparent)",
                            opacity: 0.5,
                        }}
                    />

                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                        <div className="font-mono text-[13px] text-[#bacbb9] tracking-wider flex items-center gap-2 opacity-80">
                            <span className="text-[#75ff9e] font-bold">{step.label}</span>
                            <span className="text-white/20">/</span>
                            STEP {step.label}
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0C0E12] border border-white/10 rounded font-mono text-[10px] text-[#bacbb9] uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] animate-pulse shadow-[0_0_5px_#75ff9e]"></div>
                            {step.metric}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="mb-10 text-center">
                        <h3 className="font-[Geist] text-[32px] leading-tight font-semibold text-white mb-3 uppercase">
                            {step.title}
                        </h3>
                        <p className="font-[Geist] text-[14px] text-[#bacbb9] max-w-md mx-auto">
                            {step.copy}
                        </p>
                    </div>

                    {/* Visual Workflow - Incident Pipeline */}
                    <div className="bg-[#141414] border border-white/5 rounded-lg p-6 relative overflow-hidden">
                        {/* Top Bar of Incident Card */}
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/20 flex items-center justify-center relative shadow-[0_0_16px_rgba(255,180,171,0.2)]">
                                    <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span>
                                    <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                                    <BellRing className="w-4 h-4 text-[#ffb4ab]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-mono text-[11px] text-[#e2e2e6]">
                                        INCIDENT_PIPELINE
                                    </span>
                                    <span className="font-mono text-[9px] text-[#ffb4ab] flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[#ffb4ab]"></span>{" "}
                                        LIVE
                                    </span>
                                </div>
                            </div>
                            <span className="font-mono text-[10px] text-[#bacbb9]">
                                REGION: US-EAST-1
                            </span>
                        </div>

                        {/* Pipeline Flow Visualization */}
                        <div className="relative py-6">
                            {/* Main flow line */}
                            <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2"></div>
                            <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 overflow-hidden">
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "-50%",
                                        width: "50%",
                                        height: "100%",
                                        background:
                                            "linear-gradient(90deg, transparent, rgba(255, 180, 171, 0.8), transparent)",
                                        animation: "pulse-travel 2s infinite ease-in-out",
                                    }}
                                />
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                {/* Left: Event Node */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-full bg-[#0C0E12] border border-[#ffb4ab]/30 flex items-center justify-center relative shadow-[0_0_16px_rgba(255,180,171,0.2)]">
                                        <div className="absolute inset-0 rounded-full border border-[#ffb4ab]/50 animate-pulse"></div>
                                        <svg
                                            className="w-6 h-6 text-[#ffb4ab]"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-mono text-[10px] text-[#e2e2e6]">
                                            DB_TIMEOUT
                                        </div>
                                        <div className="font-mono text-[9px] text-[#ffb4ab]">
                                            SEV: HIGH
                                        </div>
                                    </div>
                                </div>

                                {/* Middle: Processing Engine */}
                                <div className="flex flex-col items-center gap-2 relative">
                                    <div className="w-28 py-2.5 px-3 bg-[#0C0E12] border border-[#A78BFA]/30 rounded-lg flex flex-col items-center justify-center gap-1.5 relative">
                                        <div className="absolute inset-0 bg-[#A78BFA]/5 rounded-lg"></div>
                                        <svg
                                            className="w-5 h-5 text-[#A78BFA]"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                        </svg>
                                        <span className="font-mono text-[9px] text-[#e2e2e6] tracking-widest text-center leading-tight">
                                            INCIDENT
                                            <br />
                                            COMMAND
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Alert Channels */}
                                <div className="flex flex-col gap-2">
                                    {/* Channel 1 */}
                                    <div className="flex items-center gap-2 bg-[#0C0E12] border border-white/10 px-2.5 py-1.5 rounded-md">
                                        <svg
                                            className="w-3.5 h-3.5 text-[#bacbb9]"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                        </svg>
                                        <span className="font-mono text-[9px] text-[#e2e2e6]">
                                            #alerts-sev1
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] ml-auto"></span>
                                    </div>
                                    {/* Channel 2 - PagerDuty (Active) */}
                                    <div className="flex items-center gap-2 bg-[#0C0E12] border-l-2 border-[#ffb4ab] px-2.5 py-1.5 rounded-md relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[#ffb4ab]/10"></div>
                                        <svg
                                            className="w-3.5 h-3.5 text-[#ffb4ab] relative z-10"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        <span className="font-mono text-[9px] text-[#e2e2e6] relative z-10">
                                            PagerDuty
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] ml-auto relative z-10 animate-pulse"></span>
                                    </div>
                                    {/* Channel 3 */}
                                    <div className="flex items-center gap-2 bg-[#0C0E12] border border-white/10 px-2.5 py-1.5 rounded-md">
                                        <svg
                                            className="w-3.5 h-3.5 text-[#bacbb9]"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span className="font-mono text-[9px] text-[#e2e2e6]">
                                            on-call@sys
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] ml-auto"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Telemetry */}
                        <div className="mt-6 border-t border-white/10 pt-3 flex justify-between">
                            <span className="font-mono text-[9px] text-[#bacbb9]">
                                CORRELATION_ID: 9a8b-4c2d-11ef
                            </span>
                            <span className="font-mono text-[9px] text-[#bacbb9]">
                                T+ 0.045s
                            </span>
                        </div>
                    </div>
                </article>
            );
        }

        // Special visual for Resolve with Context card
        if (isResolveCard) {
            return (
                <article
                    ref={ref}
                    className={`bg-black rounded-xl p-8 ${className}`}
                    style={style}
                >
                    {/* Top gradient line */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: "1px",
                            background:
                                "linear-gradient(90deg, transparent, rgba(117, 255, 158, 0.5), rgba(208, 188, 255, 0.5), transparent)",
                            opacity: 0.5,
                        }}
                    />

                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                        <div className="font-mono text-[13px] text-[#bacbb9] tracking-wider flex items-center gap-2 opacity-80">
                            <span className="text-[#75ff9e] font-bold">{step.label}</span>
                            <span className="text-white/20">/</span>
                            STEP {step.label}
                        </div>
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0C0E12] border border-white/10 rounded font-mono text-[10px] text-[#bacbb9] uppercase tracking-wider">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] animate-pulse shadow-[0_0_5px_#75ff9e]"></div>
                            {step.metric}
                        </div>
                    </div>

                    {/* Card Content */}
                    <div className="mb-10 text-center">
                        <h3 className="font-[Geist] text-[32px] leading-tight font-semibold text-white mb-3 uppercase">
                            {step.title}
                        </h3>
                        <p className="font-[Geist] text-[14px] text-[#bacbb9] max-w-md mx-auto">
                            {step.copy}
                        </p>
                    </div>

                    {/* Visual Workflow - AI Summary & Logs */}
                    <div className="bg-[#141414] border border-white/5 rounded-lg p-6 relative overflow-hidden flex flex-col gap-4">
                        {/* AI Summary Box */}
                        <div className="rounded border border-[#75ff9e]/20 bg-[#75ff9e]/5 p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#75ff9e]"></div>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-[#75ff9e]"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                                    </svg>
                                    <span className="font-mono text-[10px] text-[#75ff9e] uppercase tracking-wider">
                                        Root Cause Analysis
                                    </span>
                                </div>
                                <span className="font-mono text-[9px] bg-[#75ff9e] text-black px-1.5 py-0.5 rounded font-bold tracking-wide">
                                    FIX
                                </span>
                            </div>
                            <p className="font-[Geist] text-[12px] text-[#bacbb9] leading-relaxed mb-3">
                                Memory leak detected in{" "}
                                <code className="bg-black/30 px-1 py-0.5 rounded text-[#75ff9e] font-mono">
                                    user-auth-service
                                </code>{" "}
                                pod. Garbage collection cycles failing to clear heap due to lingering WebSocket
                                connections.
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="bg-[#0C0E12] hover:bg-[#282a2d] border border-white/10 px-2.5 py-1.5 rounded text-[10px] font-mono transition-colors flex items-center gap-1.5 text-[#e2e2e6] cursor-pointer">
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Restart Pod
                                </button>
                                <button className="bg-[#0C0E12] hover:bg-[#282a2d] border border-white/10 px-2.5 py-1.5 rounded text-[10px] font-mono transition-colors flex items-center gap-1.5 text-[#e2e2e6] cursor-pointer">
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    View PR #892
                                </button>
                            </div>
                        </div>

                        {/* Log Snippet */}
                        <div className="rounded border border-white/10 bg-black p-3 font-mono text-[10px] overflow-hidden">
                            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-[#bacbb9]/50">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#75ff9e]"></span>
                                <span className="ml-2">auth-service-logs</span>
                            </div>
                            <div className="space-y-1 text-[#bacbb9] opacity-80">
                                <div className="flex gap-2">
                                    <span className="text-[#859585] w-14 shrink-0">14:02:11</span>
                                    <span className="text-[#ffb4ab]">[ERR]</span>
                                    <span>OOMKilled pod user-auth-service-v8</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[#859585] w-14 shrink-0">14:02:15</span>
                                    <span className="text-[#75ff9e]">[INFO]</span>
                                    <span>Kubernetes restarting pod...</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-[#859585] w-14 shrink-0">14:02:18</span>
                                    <span className="text-[#75ff9e]">[INFO]</span>
                                    <span>Pod healthy. Readiness probe passed.</span>
                                </div>
                                <div className="flex gap-2 bg-[#75ff9e]/10 border-l-2 border-[#75ff9e] pl-2 py-1 -ml-2">
                                    <span className="text-[#859585] w-14 shrink-0">14:02:20</span>
                                    <span className="text-[#75ff9e]">[SYS]</span>
                                    <span className="text-[#e2e2e6]">
                                        Incident auto-resolved by remediation rule #42.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            );
        }

        // Default visual for other cards (Connect & Probe)
        return (
            <article
                ref={ref}
                className={`bg-black rounded-xl p-8 ${className}`}
                style={style}
            >
                {/* Top gradient line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background:
                            "linear-gradient(90deg, transparent, rgba(117, 255, 158, 0.5), rgba(208, 188, 255, 0.5), transparent)",
                        opacity: 0.5,
                    }}
                />

                {/* Card Header */}
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <div className="font-mono text-[13px] text-[#bacbb9] tracking-wider flex items-center gap-2 opacity-80">
                        <span className="text-[#75ff9e] font-bold">{step.label}</span>
                        <span className="text-white/20">/</span>
                        STEP {step.label}
                    </div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#0C0E12] border border-white/10 rounded font-mono text-[10px] text-[#bacbb9] uppercase tracking-wider">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] animate-pulse shadow-[0_0_5px_#75ff9e]"></div>
                        {step.metric}
                    </div>
                </div>

                {/* Card Content */}
                <div className="mb-10 text-center">
                    <h3 className="font-[Geist] text-[32px] leading-tight font-semibold text-white mb-3 uppercase">
                        {step.title}
                    </h3>
                    <p className="font-[Geist] text-[14px] text-[#bacbb9] max-w-md mx-auto">
                        {step.copy}
                    </p>
                </div>

                {/* Visual Workflow */}
                <div className="bg-[#141414] border border-white/5 rounded-lg p-6 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Top Node */}
                        <div className="bg-black border border-white/10 rounded px-4 py-2 font-mono text-[13px] text-[#e2e2e6] flex items-center gap-2 shadow-lg">
                            <svg
                                className="w-4 h-4 text-[#75ff9e]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            https://api.example.com
                        </div>

                        {/* Flow Line Down */}
                        <div
                            className="h-10 my-1 relative overflow-hidden"
                            style={{
                                width: "2px",
                                background: "rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "30%",
                                    background:
                                        "linear-gradient(to bottom, transparent, #75ff9e, transparent)",
                                    animation: "signal 2s linear infinite",
                                }}
                            />
                        </div>

                        {/* Engine Node */}
                        <div className="bg-[#282a2d] border border-[#75ff9e]/20 rounded px-4 py-2 font-mono text-[13px] text-[#75ff9e] font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(117,255,158,0.1)]">
                            <Icon className="w-4 h-4" />
                            MONITORING ENGINE
                        </div>

                        {/* Flow Split */}
                        <div className="relative w-full max-w-75 h-10 mt-1 flex justify-center">
                            <div className="absolute top-0 w-0.5 h-4 bg-white/10"></div>
                            <div className="absolute top-4 w-56 h-px bg-white/10"></div>
                            <div className="absolute top-4 left-10 w-px h-6 bg-white/10 overflow-hidden">
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background:
                                            "linear-gradient(to bottom, transparent, rgba(117, 255, 158, 0.5), transparent)",
                                        animation: "signal 2s linear infinite 0.2s",
                                    }}
                                />
                            </div>
                            <div className="absolute top-4 left-1/2 w-px h-6 bg-white/10 -translate-x-1/2 overflow-hidden">
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background:
                                            "linear-gradient(to bottom, transparent, rgba(117, 255, 158, 0.5), transparent)",
                                        animation: "signal 2s linear infinite",
                                    }}
                                />
                            </div>
                            <div className="absolute top-4 right-9 w-px h-6 bg-white/10 overflow-hidden">
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background:
                                            "linear-gradient(to bottom, transparent, rgba(117, 255, 158, 0.5), transparent)",
                                        animation: "signal 2s linear infinite 0.4s",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Region Nodes */}
                        <div className="flex justify-between w-full max-w-[320px] gap-6">
                            <div className="flex-1 bg-[#000000] border border-white/5 rounded px-2 py-1.5 flex flex-col items-center gap-1">
                                <span className="font-mono text-[10px] text-[#bacbb9]">
                                    US-EAST
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] shadow-[0_0_4px_#75ff9e]"></div>
                            </div>
                            <div className="flex-1 bg-[#000000] border border-white/5 rounded px-2 py-1.5 flex flex-col items-center gap-1">
                                <span className="font-mono text-[10px] text-[#bacbb9]">
                                    EU-WEST
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] shadow-[0_0_4px_#75ff9e]"></div>
                            </div>
                            <div className="flex-1 bg-[#000000] border border-white/5 rounded px-2 py-1.5 flex flex-col items-center gap-1">
                                <span className="font-mono text-[10px] text-[#bacbb9]">
                                    AP-SOUTH
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#75ff9e] shadow-[0_0_4px_#75ff9e]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        );
    }
);

HowItWorksStep.displayName = "HowItWorksStep";

export default HowItWorksStep;
