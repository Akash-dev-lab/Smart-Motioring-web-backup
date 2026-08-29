export interface HowItWorksStepData {
    id: "connect" | "probe" | "alert" | "resolve" | string;
    label: string;
    title: string;
    copy: string;
    metric: string;
}

export interface HowItWorksContent {
    eyebrow: string;
    title: string;
    steps: HowItWorksStepData[];
}

export const howItWorksContent: HowItWorksContent = {
    eyebrow: "SYSTEM FLOW",
    title: "How It Works",
    steps: [
        {
            id: "connect",
            label: "01",
            title: "Connect Targets",
            copy: "Add websites, APIs, and critical paths that need constant checks.",
            metric: "URL/API",
        },
        {
            id: "probe",
            label: "02",
            title: "Run Global Checks",
            copy: "Regional probes watch uptime, latency, and response health in real time.",
            metric: "24/7",
        },
        {
            id: "alert",
            label: "03",
            title: "Detect Incidents",
            copy: "Failures are grouped, scored, and pushed into the alert pipeline fast.",
            metric: "LIVE",
        },
        {
            id: "resolve",
            label: "04",
            title: "Resolve With Context",
            copy: "Dashboards, logs, and AI summaries turn noise into clear next actions.",
            metric: "FIX",
        },
    ],
};

// ─── Incident Resolution Section ────────────────────────────────────────────

export interface IncidentPhaseGroup {
    label: string;
    items: string[];
}

export interface IncidentPhase {
    id: string;
    glyph: string;
    eyebrow: string;
    title: string;
    /** Tailwind classes for the accent border + text colour */
    accentClass: string;
    /** Tailwind classes for the background label badge */
    backgroundLabelClass: string;
    /** Tailwind opacity class for the decorative glyph layer */
    backgroundLabelOpacity: string;
    /** Tailwind classes for the LIVE status badge */
    statusClass: string;
    /** Tailwind classes for the progress meter fill bar */
    meterClass: string;
    summary: string;
    /** Two-column signal/metric rows (used on phases 1 & 2) */
    lines?: [string, string][];
    /** Grouped key-value blocks (used on phase 3) */
    groups?: IncidentPhaseGroup[];
    /** Optional extra Tailwind classes for the outer panel */
    panelClass?: string;
    /** Background panel grid-line colour */
    gridLine?: string;
    /** Optional extra Tailwind classes for the outer background layer */
    backgroundClass?: string;
}

export interface MarginGlyph {
    x: string;
    y: string;
    rotate: number;
    scale: number;
    label: string;
}

export const incidentPhases: IncidentPhase[] = [
    {
        id: "error",
        glyph: "!",
        eyebrow: "Incident detected",
        title: "Payment API Failure",
        accentClass: "border-[#00E676] text-[#00E676]",
        backgroundLabelClass: "border-[#00E676]/60 bg-[#00E676]/[0.025] text-[#00E676] shadow-[0_0_18px_rgba(0,230,118,0.04)]",
        backgroundLabelOpacity: "opacity-[0.18] md:opacity-[0.24]",
        statusClass: "bg-[#00E676] text-[#050709]",
        meterClass: "bg-[#00E676] w-[72%]",
        summary: "The checkout path is timing out under live traffic.",
        lines: [
            ["Signal", "502 Bad Gateway"],
            ["Service", "payment-api"],
            ["Latency", "3200ms"],
            ["State", "Failing"],
        ],
    },
    {
        id: "analyzing",
        glyph: "?",
        eyebrow: "Trace in progress",
        title: "From Signal To Cause",
        accentClass: "border-[#00E676] text-[#00E676]",
        backgroundLabelClass: "border-[#00E676]/60 bg-[#00E676]/[0.025] text-[#00E676] shadow-[0_0_18px_rgba(0,230,118,0.04)]",
        backgroundLabelOpacity: "opacity-[0.18] md:opacity-[0.24]",
        statusClass: "bg-[#00E676] text-[#050709]",
        meterClass: "bg-[#00E676] w-[86%]",
        summary: "Logs, checks, and dependency signals collapse into one readable trail.",
        lines: [
            ["Step 01", "Scanning logs"],
            ["Step 02", "Matching patterns"],
            ["Step 03", "Tracing dependency"],
            ["Step 04", "Ranking cause"],
        ],
    },
    {
        id: "identified",
        glyph: "+",
        eyebrow: "Cause identified",
        title: "Issue Identified",
        accentClass: "border-[#00E676] text-[#00E676]",
        backgroundLabelClass: "border-[#00E676]/60 bg-[#00E676]/[0.025] text-[#00E676] shadow-[0_0_18px_rgba(0,230,118,0.04)]",
        backgroundLabelOpacity: "opacity-[0.18] md:opacity-[0.24]",
        statusClass: "bg-[#00E676] text-[#050709]",
        meterClass: "bg-[#00E676] w-full",
        summary: "Payment API is failing because the upstream server is responding too slowly.",
        groups: [
            {
                label: "Likely cause",
                items: ["Third-party timeout", "Retry budget exhausted"],
            },
            {
                label: "Suggested fix",
                items: ["Add fallback cache", "Raise timeout guard"],
            },
        ],
    },
];

export const marginGlyphs: MarginGlyph[] = [
    { x: "8%",  y: "14%", rotate: -12, scale: 1.05, label: "ERR"   },
    { x: "82%", y: "10%", rotate:   9, scale:  0.9, label: "API"   },
    { x: "91%", y: "28%", rotate:  -7, scale: 1.18, label: "502"   },
    { x: "6%",  y: "37%", rotate:  14, scale: 0.82, label: "LOG"   },
    { x: "88%", y: "55%", rotate:  12, scale:    1, label: "SLA"   },
    { x: "13%", y: "73%", rotate:  -9, scale: 1.12, label: "FIX"   },
    { x: "72%", y: "86%", rotate:   7, scale: 0.86, label: "TRACE" },
    { x: "28%", y: "91%", rotate: -15, scale: 0.95, label: "PING"  },
    { x: "4%",  y: "88%", rotate:   8, scale: 0.78, label: "DB"    },
    { x: "95%", y: "80%", rotate: -12, scale: 0.78, label: "TTL"   },
];

// ─── Pricing Section ─────────────────────────────────────────────────────────

export interface PricingPlan {
    /** Plan display name */
    name: string;
    /** Price string, e.g. "₹999" or "Custom" */
    price: string;
    /** Short descriptor shown below the price */
    cadence: string;
    /** One-liner describing who this plan is for */
    note: string;
    /** Tailwind background class for the card */
    tint: string;
    /** Tailwind background class for the top accent bar */
    accent: string;
    /** Bullet features included in the plan */
    includes: string[];
}

export const pricingPlans: PricingPlan[] = [
    {
        name: "Signal Desk",
        price: "₹999",
        cadence: "monitor / month",
        note: "For small surfaces that need clean signal.",
        tint: "bg-black",
        accent: "bg-[#FFFF00]",
        includes: ["Uptime checks", "Latency alerts", "7 day history"],
    },
    {
        name: "War Room",
        price: "₹3000",
        cadence: "service / month",
        note: "For teams that need context before the call starts.",
        tint: "bg-black",
        accent: "bg-[#FFFF00]",
        includes: ["Trace map", "RCA timeline", "Noise scoring"],
    },
    {
        name: "Autopilot RCA",
        price: "Custom",
        cadence: "production scale",
        note: "For high-traffic systems with private workflows.",
        tint: "bg-black",
        accent: "bg-[#FFFF00]",
        includes: [
            "Runbook actions",
            "Private integrations",
            "Priority support",
        ],
    },
];

// ─── Testimonials Section ─────────────────────────────────────────────────────

/**
 * Icon name must be a valid lucide-react named export.
 * We store the string so this data file stays server-serialisable.
 * The component maps iconKey → the actual React component at render time.
 */
export type TestimonialIconKey =
    | "Activity"
    | "Quote"
    | "RadioTower"
    | "ServerCrash"
    | "ShieldCheck"
    | "TerminalSquare";

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    company: string;
    /** Short outcome metric shown in the card footer */
    metric: string;
    /** lucide-react icon name for the yellow badge */
    iconKey: TestimonialIconKey;
}

/** Summary stats shown in the intro panel */
export interface TestimonialStat {
    label: string;
    value: string;
}

export const testimonialStats: TestimonialStat[] = [
    { label: "MTTR",  value: "-34%" },
    { label: "NOISE", value: "-52%" },
    { label: "RCA",   value: "2.4x" },
];

export const testimonials: Testimonial[] = [
    {
        quote:
            "Drishyam gave us the exact service, impact, and likely cause before the war room even filled up.",
        name: "Aarav Mehta",
        role: "SRE Lead",
        company: "FinOps Cloud",
        metric: "41% faster triage",
        iconKey: "ShieldCheck",
    },
    {
        quote:
            "The alert was readable. No log archaeology, no mystery graphs, just a clean path from symptom to cause.",
        name: "Nisha Rao",
        role: "Platform Engineer",
        company: "CartPilot",
        metric: "18m saved",
        iconKey: "TerminalSquare",
    },
    {
        quote:
            "We caught repeat API failures the first week. The team finally trusted the signal instead of muting it.",
        name: "Kabir Sethi",
        role: "Engineering Manager",
        company: "RelayStack",
        metric: "63% fewer repeats",
        iconKey: "RadioTower",
    },
    {
        quote:
            "Incident reviews became sharper because every timeline had evidence, ownership, and the fix trail in one view.",
        name: "Mira Shah",
        role: "Head of Infra",
        company: "Northstar Labs",
        metric: "2.4x clearer RCA",
        iconKey: "ServerCrash",
    },
    {
        quote:
            "It feels like a second pair of eyes on production: calm, fast, and annoyingly accurate when something breaks.",
        name: "Dev Arora",
        role: "On-call Engineer",
        company: "PulseOps",
        metric: "52% less noise",
        iconKey: "Activity",
    },
];

// ─── Footer Section ───────────────────────────────────────────────────────────

export interface FooterLink {
    label: string;
    note: string;
    href?: string;
}

export interface FooterGroup {
    /** Code-word column heading shown in the green badge */
    title: string;
    /** Subtitle below the badge */
    kicker: string;
    links: FooterLink[];
}

export const footerGroups: FooterGroup[] = [
    {
        title: "SYSTEM",
        kicker: "Product routes",
        links: [
            { label: "Monitoring",   note: "Live checks, latency, uptime", href: "#" },
            { label: "Incident RCA", note: "Root cause timelines",          href: "#" },
            { label: "Pricing",      note: "Plans for every service",       href: "#" },
        ],
    },
    {
        title: "DEBUG",
        kicker: "Ops library",
        links: [
            { label: "Status page", note: "Public health reports",     href: "#" },
            { label: "Runbooks",    note: "Repeatable recovery flows",  href: "#" },
            { label: "Docs",        note: "Setup and API guides",       href: "#" },
        ],
    },
    {
        title: "CORE",
        kicker: "Company signal",
        links: [
            { label: "About",   note: "Why Drishyam exists",       href: "#" },
            { label: "Careers", note: "Build calmer on-call tools", href: "#" },
            { label: "Contact", note: "Reach the team directly",    href: "#" },
        ],
    },
];

/** Repeating items for the ticker strip */
export const tickerItems: string[] = [
    "SIGNAL LOCKED",
    "INCIDENT TRAIL READY",
    "NOISE FILTER ONLINE",
    "RCA PATH OPEN",
    "DEPLOY WITH CONTEXT",
];



