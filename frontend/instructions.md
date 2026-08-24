<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SMART MONITORING - How It Works Step 4</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&amp;family=JetBrains+Mono:wght@100..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary": "#ffddda",
                        "primary-container": "#00e676",
                        "on-error": "#690005",
                        "on-secondary-fixed-variant": "#5516be",
                        "inverse-primary": "#006d35",
                        "inverse-surface": "#e2e2e6",
                        "inverse-on-surface": "#2f3034",
                        "on-secondary-container": "#c4abff",
                        "primary": "#75ff9e",
                        "secondary-container": "#571bc1",
                        "on-surface": "#e2e2e6",
                        "primary-fixed": "#62ff96",
                        "surface-dim": "#111317",
                        "on-secondary-fixed": "#23005c",
                        "secondary-fixed-dim": "#d0bcff",
                        "on-primary-fixed-variant": "#005226",
                        "surface-tint": "#00e475",
                        "outline": "#859585",
                        "on-background": "#e2e2e6",
                        "primary-fixed-dim": "#00e475",
                        "on-primary-container": "#00612e",
                        "surface-container": "#1e2023",
                        "surface-variant": "#333538",
                        "on-tertiary-fixed": "#410004",
                        "outline-variant": "#3b4a3d",
                        "tertiary-fixed": "#ffdad7",
                        "surface-container-lowest": "#0c0e11",
                        "on-primary-fixed": "#00210b",
                        "secondary-fixed": "#e9ddff",
                        "error": "#ffb4ab",
                        "surface-bright": "#37393d",
                        "on-tertiary": "#68000c",
                        "surface-container-high": "#282a2d",
                        "on-secondary": "#3c0091",
                        "tertiary-container": "#ffb6b1",
                        "on-primary": "#003918",
                        "error-container": "#93000a",
                        "on-error-container": "#ffdad6",
                        "tertiary-fixed-dim": "#ffb3ae",
                        "secondary": "#d0bcff",
                        "surface-container-highest": "#333538",
                        "on-tertiary-fixed-variant": "#930015",
                        "surface": "#111317",
                        "background": "#111317",
                        "surface-container-low": "#1a1c1f",
                        "on-surface-variant": "#bacbb9",
                        "on-tertiary-container": "#a90d1e"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "stack-sm": "8px",
                        "margin": "24px",
                        "stack-lg": "32px",
                        "container-max": "1440px",
                        "stack-md": "16px",
                        "unit": "4px",
                        "stack-xs": "4px",
                        "gutter": "16px"
                    },
                    "fontFamily": {
                        "headline-md": ["Geist"],
                        "body-lg": ["Geist"],
                        "display-lg": ["Geist"],
                        "headline-lg": ["Geist"],
                        "label-sm": ["Geist"],
                        "code-md": ["JetBrains Mono"],
                        "body-md": ["Geist"]
                    },
                    "fontSize": {
                        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "500" }],
                        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
                        "label-sm": ["11px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600" }],
                        "code-md": ["13px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
<style>
        .bg-grid-pattern {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        .glow-node {
            box-shadow: 0 0 12px 2px rgba(0, 230, 118, 0.4);
        }
        .circuit-path {
            background: linear-gradient(90deg, transparent, rgba(0, 230, 118, 0.5), transparent);
        }
        .glass-panel {
            background: rgba(12, 14, 18, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .text-watermark {
            font-size: 15vw;
            line-height: 0.8;
            letter-spacing: -0.05em;
            color: rgba(255, 255, 255, 0.03);
            text-align: center;
            font-weight: 800;
            user-select: none;
            white-space: nowrap;
        }
    </style>
</head>
<body class="bg-background text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
<!-- TopNavBar -->
<nav class="bg-surface dark:bg-surface docked full-width top-0 border-b border-white/10 flex justify-between items-center w-full px-container-margin py-stack-md max-w-full mx-auto z-50 fixed">
<div class="flex items-center gap-gutter">
<a class="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface dark:text-on-surface flex items-center gap-2" href="#">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">monitoring</span>
                SMART MONITORING
            </a>
<div class="hidden md:flex gap-stack-lg ml-margin">
<a class="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary transition-colors duration-200 active:opacity-80 transition-all font-body-md text-body-md" href="#">Features</a>
<a class="text-primary dark:text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md" href="#">Flow</a>
<a class="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-primary transition-colors duration-200 active:opacity-80 transition-all font-body-md text-body-md" href="#">Pricing</a>
</div>
</div>
<div class="flex items-center gap-stack-md">
<a class="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hidden sm:block" href="#">Sign In</a>
<button class="bg-primary hover:bg-primary-fixed text-on-primary font-label-sm text-label-sm px-4 py-2 rounded transition-colors duration-200 shadow-[0_0_12px_rgba(117,255,158,0.15)] hover:shadow-[0_0_16px_rgba(117,255,158,0.25)]">
                Start Monitoring
            </button>
</div>
</nav>
<!-- Main Content Area -->
<main class="flex-grow relative overflow-hidden flex flex-col justify-center pt-[80px]">
<!-- Background Elements -->
<div class="absolute inset-0 bg-grid-pattern opacity-50 z-0 pointer-events-none"></div>
<!-- Circuit Paths and Nodes (Decorative) -->
<div class="absolute top-1/4 left-1/4 w-32 h-[1px] circuit-path z-0 hidden md:block"></div>
<div class="absolute top-1/4 left-[calc(25%+128px)] w-2 h-2 rounded-full bg-primary glow-node z-0 hidden md:block"></div>
<div class="absolute bottom-1/3 right-1/4 w-64 h-[1px] circuit-path z-0 hidden lg:block"></div>
<div class="absolute bottom-1/3 right-[calc(25%+256px)] w-1.5 h-1.5 rounded-full bg-primary glow-node z-0 hidden lg:block"></div>
<div class="absolute top-1/2 left-10 w-1.5 h-1.5 rounded-full bg-secondary glow-node z-0"></div>
<div class="absolute bottom-10 right-20 w-2 h-2 rounded-full bg-primary glow-node z-0"></div>
<!-- Huge Background Watermark -->
<div class="absolute inset-0 flex items-center justify-center z-0 pointer-events-none overflow-hidden">
<h1 class="text-watermark font-display-lg opacity-20">HOW IT WORKS</h1>
</div>
<!-- Content Container -->
<div class="relative z-10 container mx-auto px-container-margin max-w-5xl py-stack-lg flex flex-col items-center">
<!-- Section Badge -->
<div class="mb-stack-lg inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-surface/50 backdrop-blur-sm">
<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span class="font-code-md text-code-md text-primary uppercase tracking-widest text-[10px]">SYSTEM FLOW</span>
</div>
<!-- Main Feature Card -->
<div class="glass-panel w-full rounded-xl overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col md:flex-row relative group">
<!-- Subtle Gradient Glow behind card -->
<div class="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500 z-[-1]"></div>
<!-- Left Content Side -->
<div class="p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative z-10 border-b md:border-b-0 md:border-r border-white/5">
<div class="flex items-center justify-between mb-stack-lg">
<span class="font-code-md text-code-md text-primary opacity-80">04 / STEP 04</span>
<div class="w-10 h-10 rounded bg-surface border border-white/10 flex items-center justify-center shadow-inner">
<span class="material-symbols-outlined text-primary text-xl">handyman</span>
</div>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface mb-stack-md group-hover:text-primary transition-colors duration-300">
                        RESOLVE WITH CONTEXT
                    </h2>
<p class="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg">
                        Dashboards, logs, and AI summaries turn noise into clear next actions.
                    </p>
<!-- Action Tags -->
<div class="flex flex-wrap gap-2 mt-auto pt-stack-lg">
<span class="font-code-md text-[11px] px-2 py-1 rounded bg-surface border border-white/10 text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">smart_toy</span> AI Summary
                        </span>
<span class="font-code-md text-[11px] px-2 py-1 rounded bg-surface border border-white/10 text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">receipt_long</span> Contextual Logs
                        </span>
<span class="font-code-md text-[11px] px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">done_all</span> Auto-Fix
                        </span>
</div>
</div>
<!-- Right Visual Side -->
<div class="p-8 md:w-1/2 bg-surface-container-lowest relative z-10 flex flex-col gap-stack-md">
<!-- AI Summary Box -->
<div class="rounded border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
<div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
<div class="flex justify-between items-start mb-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-sm">auto_awesome</span>
<span class="font-label-sm text-label-sm text-primary uppercase">Root Cause Analysis</span>
</div>
<span class="font-code-md text-[10px] bg-primary text-on-primary px-1.5 py-0.5 rounded font-bold tracking-wide">FIX</span>
</div>
<p class="font-body-md text-[13px] text-on-surface-variant leading-relaxed">
                            Memory leak detected in <code>user-auth-service</code> pod. Garbage collection cycles failing to clear heap due to lingering WebSocket connections.
                        </p>
<div class="mt-3 flex items-center gap-2">
<button class="bg-surface hover:bg-surface-variant border border-white/10 px-3 py-1 rounded text-xs font-code-md transition-colors flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-[14px]">restart_alt</span> Restart Pod
                            </button>
<button class="bg-surface hover:bg-surface-variant border border-white/10 px-3 py-1 rounded text-xs font-code-md transition-colors flex items-center gap-1 text-on-surface">
<span class="material-symbols-outlined text-[14px]">code</span> View PR #892
                            </button>
</div>
</div>
<!-- Log Snippet -->
<div class="rounded border border-white/10 bg-surface p-3 font-code-md text-[11px] overflow-hidden">
<div class="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-on-surface-variant/50">
<span class="w-2 h-2 rounded-full bg-error"></span>
<span class="w-2 h-2 rounded-full bg-secondary"></span>
<span class="w-2 h-2 rounded-full bg-primary"></span>
<span class="ml-2">auth-service-logs</span>
</div>
<div class="space-y-1 text-on-surface-variant opacity-80">
<div class="flex"><span class="text-outline w-16 opacity-50">14:02:11</span> <span class="text-error mr-2">[ERR]</span> OOMKilled pod user-auth-service-v8</div>
<div class="flex"><span class="text-outline w-16 opacity-50">14:02:15</span> <span class="text-primary mr-2">[INFO]</span> Kubernetes restarting pod...</div>
<div class="flex"><span class="text-outline w-16 opacity-50">14:02:18</span> <span class="text-primary mr-2">[INFO]</span> Pod healthy. Readiness probe passed.</div>
<div class="flex bg-primary/10 border-l-2 border-primary pl-2 py-0.5"><span class="text-outline w-14 opacity-50">14:02:20</span> <span class="text-primary mr-2">[SYS]</span> <span class="text-on-surface">Incident auto-resolved by remediation rule #42.</span></div>
</div>
</div>
</div>
</div>
<!-- Stepper -->
<div class="mt-stack-lg flex items-center justify-center gap-4 w-full max-w-md mx-auto">
<div class="flex items-center gap-2 group cursor-pointer">
<span class="font-code-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">01</span>
<div class="w-8 h-[2px] bg-white/10 group-hover:bg-white/30 transition-colors"></div>
</div>
<div class="flex items-center gap-2 group cursor-pointer">
<span class="font-code-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">02</span>
<div class="w-8 h-[2px] bg-white/10 group-hover:bg-white/30 transition-colors"></div>
</div>
<div class="flex items-center gap-2 group cursor-pointer">
<span class="font-code-md text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">03</span>
<div class="w-8 h-[2px] bg-white/10 group-hover:bg-white/30 transition-colors"></div>
</div>
<div class="flex items-center gap-2">
<span class="font-code-md text-sm text-primary font-bold shadow-[0_0_8px_rgba(117,255,158,0.5)]">04</span>
<div class="w-12 h-[2px] bg-primary shadow-[0_0_8px_rgba(117,255,158,0.5)]"></div>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="bg-surface-container-lowest dark:bg-surface-container-lowest full-width border-t border-white/10 flat flex flex-col md:flex-row justify-between items-center px-container-margin py-stack-lg w-full mt-auto relative z-20">
<div class="font-code-md text-code-md text-on-surface mb-4 md:mb-0">
<span class="material-symbols-outlined text-primary align-middle mr-1 text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            © 2024 SMART MONITORING. All systems operational.
        </div>
<div class="flex gap-margin">
<a class="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors" href="#">Status</a>
<a class="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors" href="#">API Docs</a>
<a class="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors" href="#">Privacy</a>
<a class="font-label-sm text-label-sm text-outline hover:text-on-surface transition-colors" href="#">Security</a>
</div>
</footer>
</body></html>