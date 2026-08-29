/**
 * IncidentPhasePanel
 *
 * Pure-presentational Server Component.
 * Renders a single incident phase card (the "incident console" UI).
 * No browser APIs, no React state — safe to render on the server.
 */
import type { IncidentPhase } from "@/modules/home/data/content";

// ─── TimelineRail ────────────────────────────────────────────────────────────

interface TimelineRailProps {
    phases: Pick<IncidentPhase, "id" | "eyebrow">[];
    activeId: string;
}

function TimelineRail({ phases, activeId }: TimelineRailProps) {
    return (
        <div className="mb-2 grid grid-cols-3 border-white sm:mb-0 sm:border-b">
            {phases.map((phase, index) => (
                <div
                    key={phase.id}
                    className={`flex min-h-8 items-center gap-1 px-1.5 py-1 last:border-r-0 sm:min-h-12 sm:gap-2 sm:border-green-400 sm:px-4 sm:py-2 ${
                        phase.id === activeId
                            ? "bg-[#e6db00] text-[#050709]"
                            : "bg-black/35 text-white/80"
                    }`}
                >
                    <span className="grid h-5 w-5 shrink-0 place-items-center border-2 border-current bg-[#e6b000] font-black text-[9px] text-[#050709] sm:h-6 sm:w-6 sm:text-[10px]">
                        0{index + 1}
                    </span>
                    <span className="min-w-0 truncate font-black uppercase tracking-[0.04em] text-[7px] min-[380px]:text-[8px] sm:tracking-[0.12em] sm:text-[10px] md:text-xs">
                        {phase.eyebrow}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── IncidentPhasePanel ──────────────────────────────────────────────────────

interface IncidentPhasePanelProps {
    phase: IncidentPhase;
    allPhases: Pick<IncidentPhase, "id" | "eyebrow">[];
}

export default function IncidentPhasePanel({
    phase,
    allPhases,
}: IncidentPhasePanelProps) {
    return (
        <div className="relative z-50 flex h-[calc(100svh-180px)] max-h-[590px] min-h-[500px] w-full max-w-[calc(100vw-1rem)] items-center justify-center sm:h-[590px] sm:max-w-[94vw] md:max-w-[980px]">
            <div
                className={`relative z-10 flex h-full w-full flex-col overflow-hidden shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] backdrop-blur-[2px] sm:border sm:border-black sm:rounded-md sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${phase.panelClass ?? ""}`}
                style={{
                    backgroundImage: `linear-gradient(${phase.gridLine ?? "rgba(255,255,255,0.04)"} 1px, transparent 1px), linear-gradient(90deg, ${phase.gridLine ?? "rgba(255,255,255,0.04)"} 1px, transparent 1px)`,
                    backgroundSize: "clamp(2rem, 5vw, 3.5rem) clamp(2rem, 5vw, 3.5rem)",
                    backgroundPosition: "-1px -1px",
                }}
            >
                {/* ── Top bar ── */}
                <div className="grid grid-cols-[1fr_auto] items-center border-b-[3px] border-white bg-[#050709] text-[#00E676] sm:border-b">
                    <div className="flex min-w-0 items-center gap-2 px-3 py-2 sm:px-4 sm:py-3">
                        {/* Window traffic-light dots — desktop only */}
                        <div className="hidden items-center justify-between border-b-[4px] border-black bg-black p-3 text-white sm:flex">
                            <div className="flex gap-2">
                                <span className="h-3.5 w-3.5 rounded-full bg-[#FF5F56] animate-dot" style={{ animationDelay: "0s" }} />
                                <span className="h-3.5 w-3.5 rounded-full bg-[#FFBD2E] animate-dot" style={{ animationDelay: "0.25s" }} />
                                <span className="h-3.5 w-3.5 rounded-full bg-[#00E676] animate-dot" style={{ animationDelay: "0.5s" }} />
                            </div>
                        </div>
                        <span className="ml-1 truncate font-black uppercase italic tracking-[0.16em] text-[10px] sm:text-xs">
                            incident console
                        </span>
                    </div>
                    <span
                        className={`m-1.5 border-2 border-[#00E676] px-2 py-1 font-black uppercase tracking-[0.14em] text-[9px] shadow-[0_0_12px_rgba(0,230,118,0.15)] sm:m-2 sm:text-[10px] ${phase.statusClass}`}
                    >
                        live
                    </span>
                </div>

                {/* ── Phase timeline rail ── */}
                <TimelineRail phases={allPhases} activeId={phase.id} />

                {/* ── Body ── */}
                <div className="relative min-h-0 flex-1 grid lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
                    {/* Left — title, summary, meter */}
                    <div className="relative overflow-hidden border-b-[3px] border-current/70 p-2 text-left min-[380px]:p-3 sm:p-6 lg:border-b-0 lg:border-r-[4px] lg:p-8">
                        {/* Floating glyph badge */}
                        <div className="float-right ml-2 mb-1 grid h-9 w-9 rotate-6 place-items-center border-[3px] border-[#dee600] bg-[#dee600] text-[#050709] shadow-[4px_4px_0px_0px_rgba(0,230,118,0.18)] sm:ml-3 sm:mb-2 sm:h-16 sm:w-16 sm:shadow-[0_0_22px_rgba(0,230,118,0.16)]">
                            <span className="font-black text-2xl leading-none sm:text-4xl">
                                {phase.glyph}
                            </span>
                        </div>

                        {/* Eyebrow */}
                        <p
                            className={`inline-flex max-w-[calc(100%-2.75rem)] text-amber-400 px-1.5 py-0.5 font-black uppercase italic tracking-[0.08em] text-[8px] min-[380px]:text-[9px] sm:max-w-none sm:px-2 sm:py-1 sm:tracking-[0.16em] sm:text-xs ${phase.accentClass}`}
                        >
                            {phase.eyebrow}
                        </p>

                        {/* Title */}
                        <h2
                            className={`mt-2 font-black italic uppercase leading-[0.88] tracking-normal text-[clamp(1.65rem,9vw,2.45rem)] sm:mt-4 sm:leading-[0.88] sm:text-[clamp(1.85rem,10.5vw,5.9rem)] ${
                                phase.id === "analyzing" ? "max-w-[18ch]" : "max-w-[14ch]"
                            }`}
                        >
                            {phase.title}
                        </h2>

                        {/* Summary */}
                        <p className="mt-2 max-w-[34rem] border-t-2 border-current/55 pt-2 font-black uppercase leading-tight text-[10px] min-[380px]:text-[11px] sm:mt-4 sm:pt-3 sm:leading-snug sm:text-sm md:text-base">
                            {phase.summary}
                        </p>

                        {/* Progress meter */}
                        <div className="mt-3 border-[2px] border-[#00E676]/70 bg-black/40 p-1 shadow-[0_0_18px_rgba(0,230,118,0.06)] sm:mt-5">
                            <div className="h-2 border-2 border-[#00E676]/70 bg-[#00E676]/[0.06] sm:h-3">
                                <div className={`h-full border-r-2 border-current ${phase.meterClass}`} />
                            </div>
                        </div>
                    </div>

                    {/* Right — signal lines or grouped blocks */}
                    <div className="grid bg-[#050709]/70 text-left sm:grid-cols-2 lg:grid-cols-1">
                        {phase.lines?.map((line) => (
                            <div
                                key={line.join("-")}
                                className="grid min-h-10 content-center border-b border-current/45 px-3 py-2 last:border-b-0 sm:min-h-16 sm:px-5 sm:py-3 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0"
                            >
                                <span className={`font-black uppercase tracking-[0.14em] text-[8px] sm:tracking-[0.18em] sm:text-xs ${phase.accentClass}`}>
                                    {line[0]}
                                </span>
                                <span className="mt-0.5 break-words font-black uppercase text-xs sm:mt-1 sm:text-base">
                                    {line[1]}
                                </span>
                            </div>
                        ))}

                        {phase.groups?.map((group) => (
                            <div
                                key={group.label}
                                className="border-b border-current/45 px-3 py-3 last:border-b-0 sm:px-5 sm:py-4 sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0"
                            >
                                <h3 className={`font-black uppercase tracking-[0.14em] text-[8px] sm:tracking-[0.18em] sm:text-xs ${phase.accentClass}`}>
                                    {group.label}
                                </h3>
                                <ul className="mt-2 grid gap-1.5 font-bold uppercase leading-tight text-[10px] sm:mt-3 sm:gap-2 sm:leading-snug sm:text-sm">
                                    {group.items.map((item) => (
                                        <li key={item} className="border-l-[3px] border-current/70 pl-3">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
