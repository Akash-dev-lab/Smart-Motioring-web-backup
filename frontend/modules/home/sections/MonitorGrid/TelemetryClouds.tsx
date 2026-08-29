import React from "react";

interface TelemetryCloudsProps {
    cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

interface TelemetryCardData {
    index: number;
    title: string;
    value: string;
    positionClass: string;
    delay: string;
    accentColor: string;
    icon: React.ReactNode;
    extra?: React.ReactNode;
}

export default function TelemetryClouds({ cardRefs }: TelemetryCloudsProps) {
    const cards: TelemetryCardData[] = [
        {
            index: 0,
            title: "Uptime Monitoring",
            value: "99.98% SLA",
            positionClass: "top-[10%] left-[15%] w-64",
            delay: "0s",
            accentColor: "#75ff9e",
            icon: (
                <svg className="w-4 h-4 text-[#75ff9e]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            extra: <div className="w-2 h-2 bg-[#75ff9e] rounded-full" />,
        },
        {
            index: 1,
            title: "Real-Time Alerts",
            value: "2 Incidents Detected",
            positionClass: "top-[25%] right-[10%] w-72",
            delay: "1s",
            accentColor: "#ffb4ab",
            icon: (
                <svg className="w-4 h-4 text-[#ffb4ab]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            extra: (
                <svg className="w-4 h-4 text-[#ffb4ab]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            index: 2,
            title: "Multi-Region Checks",
            value: "US-EAST · EU-WEST · AP-SOUTH",
            positionClass: "bottom-[15%] left-[10%] w-72",
            delay: "2s",
            accentColor: "#bacbb9",
            icon: (
                <svg className="w-4 h-4 text-[#bacbb9]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            index: 3,
            title: "Latency",
            value: "142ms Average",
            positionClass: "bottom-[25%] right-[15%] w-64",
            delay: "0.5s",
            accentColor: "#d0bcff",
            icon: (
                <svg className="w-4 h-4 text-[#d0bcff]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            extra: (
                <div className="w-full h-1 bg-[#333538] rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-[#d0bcff] w-[60%]" />
                </div>
            ),
        },
        {
            index: 4,
            title: "AI Analysis",
            value: "Root cause identified in DB-04",
            positionClass: "top-[40%] left-[2%] w-72 hidden md:block",
            delay: "1.5s",
            accentColor: "#c4abff",
            icon: (
                <svg className="w-4 h-4 text-[#c4abff]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            index: 5,
            title: "Dashboards & Logs",
            value: "1,284 checks / hour",
            positionClass: "bottom-[5%] right-[30%] w-64 hidden md:block",
            delay: "2.5s",
            accentColor: "#bacbb9",
            icon: (
                <svg className="w-4 h-4 text-[#bacbb9]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            {cards.map((card) => (
                <div
                    key={card.index}
                    ref={(el) => {
                        cardRefs.current[card.index] = el;
                    }}
                    className={`telemetry-cloud absolute ${card.positionClass} animate-float opacity-0`}
                    data-card-index={card.index}
                    style={{
                        animation: "float 6s ease-in-out infinite",
                        animationDelay: card.delay,
                        background: "rgba(7, 19, 38, 0.55)",
                        border: "1px solid rgba(90, 120, 170, 0.35)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "40px",
                        padding: "16px 24px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        zIndex: 20,
                    }}
                >
                    <div className="flex items-center gap-3 mb-1">
                        {card.icon}
                        <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">
                            {card.title}
                        </span>
                    </div>
                    {card.index === 3 ? (
                        <div className="flex flex-col gap-1">
                            <div className="font-[Geist] text-[13px]" style={{ color: card.accentColor }}>
                                {card.value}
                            </div>
                            {card.extra}
                        </div>
                    ) : (
                        <div
                            className="font-[Geist] text-[13px] flex items-center justify-between"
                            style={{ color: card.accentColor }}
                        >
                            <span>{card.value}</span>
                            {card.extra}
                        </div>
                    )}
                </div>
            ))}
        </>
    );
}
