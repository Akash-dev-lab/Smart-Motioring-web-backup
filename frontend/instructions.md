<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Smart Monitoring - Real-time Observability</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed": "#00210b",
                        "on-error": "#690005",
                        "on-secondary": "#3c0091",
                        "surface-container-lowest": "#0c0e11",
                        "error": "#ffb4ab",
                        "surface-container": "#1e2023",
                        "on-tertiary-container": "#a90d1e",
                        "tertiary": "#ffddda",
                        "on-surface-variant": "#bacbb9",
                        "tertiary-container": "#ffb6b1",
                        "tertiary-fixed": "#ffdad7",
                        "secondary": "#d0bcff",
                        "surface-variant": "#333538",
                        "surface-dim": "#111317",
                        "surface-bright": "#37393d",
                        "surface-container-high": "#282a2d",
                        "error-container": "#93000a",
                        "primary": "#75ff9e",
                        "on-tertiary": "#68000c",
                        "secondary-fixed": "#e9ddff",
                        "on-error-container": "#ffdad6",
                        "background": "#111317",
                        "inverse-on-surface": "#2f3034",
                        "inverse-primary": "#006d35",
                        "surface-container-highest": "#333538",
                        "primary-fixed-dim": "#00e475",
                        "on-primary-container": "#00612e",
                        "primary-container": "#00e676",
                        "on-tertiary-fixed-variant": "#930015",
                        "secondary-container": "#571bc1",
                        "on-primary-fixed-variant": "#005226",
                        "on-secondary-container": "#c4abff",
                        "on-background": "#e2e2e6",
                        "surface-container-low": "#1a1c1f",
                        "outline": "#859585",
                        "on-primary": "#003918",
                        "on-secondary-fixed": "#23005c",
                        "outline-variant": "#3b4a3d",
                        "on-surface": "#e2e2e6",
                        "on-secondary-fixed-variant": "#5516be",
                        "primary-fixed": "#62ff96",
                        "tertiary-fixed-dim": "#ffb3ae",
                        "secondary-fixed-dim": "#d0bcff",
                        "inverse-surface": "#e2e2e6",
                        "on-tertiary-fixed": "#410004",
                        "surface-tint": "#00e475",
                        "surface": "#111317"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "margin": "24px",
                        "stack-md": "16px",
                        "stack-xs": "4px",
                        "gutter": "16px",
                        "stack-sm": "8px",
                        "unit": "4px",
                        "stack-lg": "32px",
                        "container-max": "1440px"
                    },
                    "fontFamily": {
                        "label-sm": ["Geist"],
                        "body-md": ["Geist"],
                        "body-lg": ["Geist"],
                        "headline-md": ["Geist"],
                        "display-lg": ["Geist"],
                        "code-md": ["JetBrains Mono"],
                        "headline-lg": ["Geist"]
                    },
                    "fontSize": {
                        "label-sm": ["11px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "500" }],
                        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "code-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
<style>
        .glow-text { text-shadow: 0 0 10px rgba(117, 255, 158, 0.5); }
        .glow-box:hover { box-shadow: 0 0 12px rgba(117, 255, 158, 0.15); }
        .grid-bg { background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
        .led-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; box-shadow: 0 0 0 0 rgba(117, 255, 158, 0.7); } 70% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(117, 255, 158, 0); } 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(117, 255, 158, 0); } }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col relative overflow-x-hidden">
<!-- Ambient Background Glow -->
<div class="absolute inset-0 z-0 pointer-events-none">
<div class="absolute top-1/4 right-1/4 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[120px]"></div>
<div class="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px]"></div>
</div>
<div class="absolute inset-0 grid-bg z-0 pointer-events-none"></div>
<!-- TopNavBar -->
<nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-surface-container-low/80 backdrop-blur-md rounded-full mt-4 mx-margin max-w-container-max mx-auto border border-white/10 shadow-md">
<div class="flex items-center gap-gutter">
<div class="flex items-center justify-center w-8 h-8 rounded bg-surface-container border border-outline-variant">
<span class="font-headline-md text-headline-md font-bold text-primary">S</span>
</div>
<span class="font-headline-md text-headline-md font-bold text-primary hidden md:block">Smart Monitoring</span>
</div>
<div class="hidden md:flex items-center gap-stack-lg">
<a class="font-label-sm text-label-sm uppercase tracking-wider text-primary border-b-2 border-primary pb-1 active:scale-95 duration-200" href="#">Overview</a>
<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-2 py-1 rounded active:scale-95 duration-200" href="#">Monitors</a>
<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-2 py-1 rounded active:scale-95 duration-200" href="#">Incidents</a>
<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-2 py-1 rounded active:scale-95 duration-200" href="#">Logs</a>
<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-2 py-1 rounded active:scale-95 duration-200" href="#">AI Insights</a>
<a class="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-2 py-1 rounded active:scale-95 duration-200" href="#">Settings</a>
</div>
<div class="flex items-center gap-stack-sm">
<button class="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant/50 transition-colors active:scale-95 duration-200">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">notifications</span>
</button>
<button class="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-variant/50 transition-colors active:scale-95 duration-200 hidden sm:block">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">help_outline</span>
</button>
<button class="bg-primary text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider px-4 py-2 rounded glow-box active:scale-95 duration-200 hidden sm:block ml-2">
                Deploy Agent
            </button>
<div class="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden ml-2">
<img class="w-full h-full object-cover" data-alt="A minimalist tech avatar, highly stylized, geometric shapes, dark mode, high contrast, crisp edges." src="https://lh3.googleusercontent.com/aida-public/AB6AXuADcmbVgf13_VoL4H0zUfTmwyPlu9AXR9p2tCV6m_aaLknwYVVe7O9msrHz-kQ31CHMg1d5BS3svzgPD5K09bW0ughwiJIbb1sz2Yt6s7cajgmtczlo74ULGCZybTSgI0ASDPbblL3UGWMN2BSmHFslw9zR0ldB6h5CDv-rjd4ne3zvC0QTvZ5rAQc5RIs1kPITjL06ajBlKKQBe7ZNIVPSDfVJR0EuzOgu_I_Z9APnKvZfcRTTcvP-"/>
</div>
</div>
</nav>
<!-- Main Hero Content -->
<main class="flex-grow flex items-center justify-center pt-32 pb-24 px-margin z-10 relative">
<div class="max-w-container-max w-full grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
<!-- Left Column: Copy & CTA -->
<div class="flex flex-col gap-stack-md pr-0 lg:pr-12">
<div class="inline-flex items-center gap-2 border border-outline-variant rounded-full px-3 py-1 bg-surface-container-low w-max">
<div class="w-2 h-2 rounded-full bg-secondary/80"></div>
<span class="font-code-md text-code-md uppercase text-on-surface-variant tracking-widest text-[10px]">REAL-TIME OBSERVABILITY</span>
</div>
<h1 class="font-display-lg text-display-lg text-on-surface tracking-tighter">
                    Know when your <br/><span class="text-on-surface">systems fail.</span>
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed mt-4">
                    Real-time website and API monitoring with regional checks, incident detection, AI-powered analysis and live status updates.
                </p>
<div class="flex flex-wrap items-center gap-4 mt-8">
<button class="bg-primary text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider px-6 py-3 rounded glow-box active:scale-95 duration-200 flex items-center gap-2">
                        Start Monitoring
                        <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<button class="border border-outline-variant text-on-surface font-label-sm text-label-sm uppercase tracking-wider px-6 py-3 rounded hover:bg-surface-variant/50 transition-colors active:scale-95 duration-200">
                        View Demo
                    </button>
</div>
<div class="flex items-center gap-3 mt-12 pt-6 border-t border-white/5 font-code-md text-code-md text-[11px] text-on-surface-variant tracking-wider uppercase">
<div class="w-2 h-2 rounded-full bg-primary led-pulse"></div>
<span>Monitoring Active</span>
<span class="text-outline-variant">•</span>
<span>Realtime Connected</span>
</div>
</div>
<!-- Right Column: Monitoring Console -->
<div class="relative w-full h-[500px] lg:h-[600px] mt-12 lg:mt-0 perspective-1000">
<div class="absolute inset-0 bg-surface-container-lowest border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col backdrop-blur-xl bg-opacity-90">
<!-- Console Header -->
<div class="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-container-low/50">
<span class="font-code-md text-code-md text-on-surface-variant tracking-wider uppercase text-xs">SMART MONITOR</span>
<div class="flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-primary led-pulse"></div>
<span class="font-code-md text-code-md text-primary tracking-wider uppercase text-xs">LIVE</span>
</div>
</div>
<!-- Metrics Top Row -->
<div class="grid grid-cols-3 gap-4 p-6 border-b border-white/5">
<div class="flex flex-col gap-1">
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest">TARGET</span>
<div class="flex items-center gap-2">
<span class="font-code-md text-code-md text-on-surface">api.example.com</span>
<span class="text-xs text-on-surface-variant">(GET)</span>
</div>
</div>
<div class="flex flex-col gap-1 items-end">
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest">LATENCY</span>
<span class="font-code-md text-code-md text-on-surface text-lg">142ms</span>
</div>
<div class="flex flex-col gap-1 items-end">
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest">CHECKS (1H)</span>
<span class="font-code-md text-code-md text-on-surface text-lg">1,284</span>
</div>
</div>
<!-- Main Chart Area -->
<div class="p-6 grow flex flex-col border-b border-white/5 relative group">
<div class="flex justify-between items-center mb-4">
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest">LIVE LATENCY</span>
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest">LAST 60 MIN</span>
</div>
<div class="relative w-full h-full flex items-end">
<!-- Abstract Chart Path -->
<svg class="absolute inset-0 w-full h-full" preserveaspectratio="none" viewbox="0 0 100 100">
<path d="M0,80 Q20,90 40,70 T80,30 T100,60 L100,100 L0,100 Z" fill="rgba(117, 255, 158, 0.05)"></path>
<path d="M0,80 Q20,90 40,70 T80,30 T100,60" fill="none" stroke="rgba(117, 255, 158, 0.5)" stroke-width="1.5"></path>
<circle class="glow-text" cx="80" cy="30" fill="#75ff9e" r="2"></circle>
</svg>
<!-- Grid lines -->
<div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
<div class="border-t border-white/20 w-full h-0"></div>
<div class="border-t border-white/20 w-full h-0"></div>
<div class="border-t border-white/20 w-full h-0"></div>
</div>
</div>
</div>
<!-- Bottom Panels -->
<div class="grid grid-cols-2 gap-px bg-white/5 min-h-[140px]">
<!-- Regions -->
<div class="bg-surface-container-lowest p-5 flex flex-col gap-3">
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">REGIONAL CHECKS</span>
<div class="flex justify-between items-center">
<span class="font-code-md text-code-md text-xs text-on-surface">US-EAST</span>
<div class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#75ff9e]"></div>
</div>
<div class="flex justify-between items-center">
<span class="font-code-md text-code-md text-xs text-on-surface">EU-WEST</span>
<div class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#75ff9e]"></div>
</div>
<div class="flex justify-between items-center">
<span class="font-code-md text-code-md text-xs text-on-surface">AP-SOUTH</span>
<div class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#75ff9e]"></div>
</div>
</div>
<!-- Activity Feed -->
<div class="bg-surface-container-lowest p-5 flex flex-col gap-2 overflow-hidden relative">
<span class="font-code-md text-code-md text-on-surface-variant text-[10px] uppercase tracking-widest mb-1">ACTIVITY FEED</span>
<div class="flex flex-col gap-1.5 text-[10px] font-code-md text-on-surface-variant">
<div class="flex gap-2"><span>14:31:08</span> <span class="text-on-surface">CHECK 200 OK</span> <span>- 145ms</span></div>
<div class="flex gap-2"><span>14:30:08</span> <span class="text-on-surface">CHECK 200 OK</span> <span>- 139ms</span></div>
<div class="flex gap-2 text-primary"><span>14:29:08</span> <span>SYNC COMPLETE</span></div>
<div class="flex gap-2 opacity-50"><span>14:28:08</span> <span>CHECK 200 OK</span> <span>- 141ms</span></div>
</div>
<!-- AI Overlay -->
<div class="absolute bottom-3 right-3 bg-secondary-container/80 backdrop-blur-sm border border-secondary/30 rounded px-2 py-1 flex items-center gap-1.5">
<div class="w-1.5 h-1.5 rounded-full bg-secondary led-pulse"></div>
<span class="font-code-md text-[9px] text-on-secondary-container tracking-wider uppercase">AI INCIDENT ANALYSIS</span>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="flex justify-between items-center px-margin py-stack-lg w-full bg-surface-container-lowest border-t border-outline-variant mt-auto z-10 relative">
<span class="font-headline-md text-headline-md text-on-surface">Smart Monitoring</span>
<div class="flex gap-stack-md hidden sm:flex">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Terms of Service</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">API Reference</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface transition-colors" href="#">Status Page</a>
</div>
<span class="font-label-sm text-label-sm text-on-surface-variant">© 2024 Smart Monitoring. Precision Observability.</span>
</footer>
</body></html>