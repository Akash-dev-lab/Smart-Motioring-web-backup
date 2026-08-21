<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Smart Monitoring - Monitor Grid</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "secondary-fixed": "#e9ddff",
                        "inverse-surface": "#e2e2e6",
                        "tertiary-fixed-dim": "#ffb3ae",
                        "surface-container": "#1e2023",
                        "secondary": "#d0bcff",
                        "on-surface": "#e2e2e6",
                        "outline-variant": "#3b4a3d",
                        "tertiary-fixed": "#ffdad7",
                        "on-secondary": "#3c0091",
                        "on-error": "#690005",
                        "on-primary": "#003918",
                        "on-tertiary-fixed": "#410004",
                        "surface-container-highest": "#333538",
                        "error": "#ffb4ab",
                        "tertiary-container": "#ffb6b1",
                        "tertiary": "#ffddda",
                        "primary-fixed": "#62ff96",
                        "on-tertiary-fixed-variant": "#930015",
                        "secondary-fixed-dim": "#d0bcff",
                        "on-secondary-fixed": "#23005c",
                        "on-secondary-container": "#c4abff",
                        "primary-fixed-dim": "#00e475",
                        "background": "#111317",
                        "primary": "#75ff9e",
                        "on-secondary-fixed-variant": "#5516be",
                        "primary-container": "#00e676",
                        "secondary-container": "#571bc1",
                        "inverse-primary": "#006d35",
                        "error-container": "#93000a",
                        "on-error-container": "#ffdad6",
                        "surface-variant": "#333538",
                        "on-primary-fixed-variant": "#005226",
                        "surface-container-low": "#1a1c1f",
                        "on-primary-fixed": "#00210b",
                        "on-surface-variant": "#bacbb9",
                        "on-tertiary-container": "#a90d1e",
                        "surface-container-lowest": "#0c0e11",
                        "on-primary-container": "#00612e",
                        "surface-dim": "#111317",
                        "outline": "#859585",
                        "surface-container-high": "#282a2d",
                        "surface-tint": "#00e475",
                        "inverse-on-surface": "#2f3034",
                        "surface-bright": "#37393d",
                        "on-background": "#e2e2e6",
                        "surface": "#111317",
                        "on-tertiary": "#68000c",
                        "tech-yellow": "#FFD600",
                        "tech-green": "#00E676",
                        "tech-white": "#F5F7FA",
                        "tech-red": "#FF5252"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "stack-md": "16px",
                        "unit": "4px",
                        "margin": "24px",
                        "container-max": "1440px",
                        "stack-sm": "8px",
                        "stack-lg": "32px",
                        "stack-xs": "4px",
                        "gutter": "16px"
                    },
                    fontFamily: {
                        "headline-lg": ["Geist"],
                        "code-md": ["JetBrains Mono"],
                        "body-lg": ["Geist"],
                        "display-lg": ["Geist"],
                        "headline-md": ["Geist"],
                        "label-sm": ["Geist"],
                        "body-md": ["Geist"]
                    },
                    backgroundImage: {
                        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")"
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-color: #080A0D;
            color: #e2e2e6;
        }
        
        .hardware-card {
            background-color: #0C0E12;
            border: 1px solid rgba(255,255,255,0.08);
            transition: all 0.3s ease;
        }
        
        .hardware-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .window-bar {
            background-color: #14171C;
            border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .progress-bar-bg {
            background-color: #1a1c1f;
            border: 1px solid rgba(255,255,255,0.1);
        }
    </style>
</head>
<body class="min-h-screen font-body-md antialiased relative overflow-x-hidden">
<!-- TopNavBar -->
<nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-surface-container-low/80 backdrop-blur-md rounded-full mt-4 mx-margin max-w-container-max mx-auto border border-white/10 shadow-md">
<div class="flex items-center gap-6">
<span class="font-headline-md text-headline-md font-bold text-primary">Smart Monitoring</span>
<div class="hidden md:flex gap-4">
<a class="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md font-label-sm text-label-sm uppercase tracking-wider" href="#">Overview</a>
<a class="text-primary border-b-2 border-primary pb-1 px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider" href="#">Monitors</a>
<a class="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md font-label-sm text-label-sm uppercase tracking-wider" href="#">Incidents</a>
<a class="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md font-label-sm text-label-sm uppercase tracking-wider" href="#">Logs</a>
<a class="text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md font-label-sm text-label-sm uppercase tracking-wider" href="#">AI Insights</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="bg-primary text-on-primary px-4 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider hover:bg-primary-container transition-colors active:scale-95 duration-200">Deploy Agent</button>
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface" data-icon="notifications">notifications</span>
<span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface" data-icon="help_outline">help_outline</span>
<img alt="User profile" class="w-8 h-8 rounded-full border border-outline-variant object-cover" data-alt="A small circular user profile picture featuring a high-tech looking abstract geometric pattern in vibrant neon green and dark charcoal, lit by subtle rim lighting, professional and sleek." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRhlPYktGx8IYcz8XK9jtEIfZaw0A3DQXTI6eA9cFDlkFb6mWwm756E95RPe3suhnLdH-jJgi1py47cXbMqxxIKTqjnyB9ClkZ58EOAOX943-hLvbWmYXG9MRnk_kl2S3LvcqxcLSdargcYMI0byb-HJ5JJAoDSLHKiZInkFZ8PJEtnBnTeVZi0CKPWIdm_Vo3_yKGEYuI7YqAOgfJczm62rIi10k0FiyaO20pHAxofL6oJiRBqFOe"/>
</div>
</nav>
<!-- Main Content Canvas -->
<main class="pt-32 pb-margin px-margin max-w-container-max mx-auto relative z-10 min-h-screen">
<!-- Technical Grid Background -->
<div class="absolute inset-0 bg-grid-pattern opacity-50 z-0 pointer-events-none"></div>
<header class="mb-stack-lg relative z-10">
<h1 class="font-display-lg text-display-lg text-on-surface mb-stack-sm">Observability Grid</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Real-time telemetry and status across all critical infrastructure layers. High-density signals prioritize active incidents and anomalous latency.</p>
</header>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter relative z-10">
<!-- Card 1: UPTIME MONITORING -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-yellow/30 hover:border-tech-yellow/60">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow"></div>
<div class="w-2 h-2 rounded-full bg-tech-green/50"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">SYS.UPTIME</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<!-- Subtle Glow Background -->
<div class="absolute -top-10 -right-10 w-32 h-32 bg-tech-yellow/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<h3 class="font-headline-md text-headline-md font-semibold text-tech-yellow mb-stack-xs uppercase tracking-wide">Uptime Monitoring</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Track website availability 24/7 with zero blind spots.</p>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-tech-yellow/10 text-tech-yellow px-1 py-0.5 rounded border border-tech-yellow/20">INTERNET</span>
<span class="font-code-md text-[10px] text-on-surface-variant">99.99%</span>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden">
<div class="h-full bg-tech-yellow w-[95%] relative">
<div class="absolute inset-0 bg-white/20 animate-pulse"></div>
</div>
</div>
</div>
</div>
</article>
<!-- Card 2: LATENCY TRACKING -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-green/30 hover:border-tech-green/60 lg:col-span-1 lg:row-span-2">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-green"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">NET.LATENCY</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<div class="absolute -bottom-10 -right-10 w-40 h-40 bg-tech-green/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<h3 class="font-headline-md text-headline-md font-semibold text-tech-green mb-stack-xs uppercase tracking-wide">Latency Tracking</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Measure response times and detect slowdowns instantly across global edges.</p>
<!-- Decorative Chart Area -->
<div class="flex-grow min-h-[100px] border-b border-dashed border-white/10 mb-stack-md relative flex items-end">
<div class="w-full h-1/2 bg-gradient-to-t from-tech-green/20 to-transparent border-t border-tech-green/50"></div>
<div class="absolute bottom-2 right-0 font-code-md text-[10px] text-tech-green bg-surface-container-low px-1 rounded border border-white/5">42ms avg</div>
</div>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-tech-green/10 text-tech-green px-1 py-0.5 rounded border border-tech-green/20">MS_TRACK</span>
<div class="w-2 h-2 rounded-full bg-tech-green animate-pulse"></div>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden flex">
<div class="h-full bg-tech-green w-[30%] border-r border-background"></div>
<div class="h-full bg-tech-green w-[20%] border-r border-background opacity-80"></div>
<div class="h-full bg-tech-green w-[15%] border-r border-background opacity-60"></div>
</div>
</div>
</div>
</article>
<!-- Card 3: API MONITORING -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-white/30 hover:border-tech-white/60">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-green"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">API.SYNC</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<div class="absolute -top-10 -left-10 w-32 h-32 bg-tech-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
<h3 class="font-headline-md text-[20px] font-semibold text-tech-white mb-stack-xs uppercase tracking-wide leading-tight">API Monitoring</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Continuously test and validate your API endpoints.</p>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-white/5 text-tech-white px-1 py-0.5 rounded border border-white/10">SYNC_V4</span>
<span class="font-code-md text-[10px] text-on-surface-variant">200 OK</span>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden flex gap-[1px]">
<div class="h-full bg-tech-white w-[20%]"></div>
<div class="h-full bg-tech-white w-[20%]"></div>
<div class="h-full bg-tech-white w-[20%]"></div>
<div class="h-full bg-tech-white w-[20%]"></div>
<div class="h-full bg-surface-variant w-[20%]"></div>
</div>
</div>
</div>
</article>
<!-- Card 4: REAL-TIME ALERTS -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-red/30 hover:border-tech-red/60 lg:col-span-1 lg:row-span-2">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red animate-pulse"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-green/50"></div>
<span class="ml-auto font-code-md text-[10px] text-tech-red tracking-widest">CRIT.ALERT</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden bg-tech-red/5">
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-tech-red/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
<h3 class="font-headline-md text-headline-md font-semibold text-tech-red mb-stack-xs uppercase tracking-wide">Real-Time Alerts</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Get notified the moment something breaks.</p>
<div class="flex-grow flex flex-col justify-center gap-2 mb-stack-md relative z-10">
<div class="border border-tech-red/30 bg-tech-red/10 rounded p-2 flex items-start gap-2">
<span class="material-symbols-outlined text-[16px] text-tech-red" data-icon="warning">warning</span>
<div class="font-code-md text-[10px] leading-tight">
<span class="text-tech-red block font-bold">NODE_FAIL</span>
<span class="text-on-surface-variant">US-EAST-1a unreachable</span>
</div>
</div>
</div>
<div class="mt-auto relative z-10">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-tech-red/20 text-tech-red px-1 py-0.5 rounded border border-tech-red/40 font-bold">PREDICTIVE</span>
<span class="font-code-md text-[10px] text-tech-red animate-pulse">ACTIVE</span>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden">
<div class="h-full bg-tech-red w-[85%] relative">
<div class="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 animate-[pulse_1s_infinite]"></div>
</div>
</div>
</div>
</div>
</article>
<!-- Card 5: AI INCIDENT SUMMARIES -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-yellow/30 hover:border-tech-yellow/60">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow"></div>
<div class="w-2 h-2 rounded-full bg-tech-green/50"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">AI.LOGIC</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<h3 class="font-headline-md text-[18px] font-semibold text-tech-yellow mb-stack-xs uppercase tracking-wide leading-tight">AI Incident Summaries</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Turn errors into clear, actionable insights automatically.</p>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-tech-yellow/10 text-tech-yellow px-1 py-0.5 rounded border border-tech-yellow/20">OF THINGS</span>
<span class="material-symbols-outlined text-[14px] text-tech-yellow" data-icon="psychology">psychology</span>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden">
<div class="h-full bg-gradient-to-r from-tech-yellow/50 to-tech-yellow w-[60%]"></div>
</div>
</div>
</div>
</article>
<!-- Card 6: DASHBOARDS AND LOGS -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-red/30 hover:border-tech-red/60">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-green/50"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">SYS.VIEWS</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<h3 class="font-headline-md text-[20px] font-semibold text-tech-red mb-stack-xs uppercase tracking-wide leading-tight">Dashboards &amp; Logs</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Visualize performance and debug issues faster.</p>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-tech-red/10 text-tech-red px-1 py-0.5 rounded border border-tech-red/20">NET_LOGS</span>
<div class="flex gap-[2px]">
<div class="w-1 h-3 bg-tech-red/40"></div>
<div class="w-1 h-3 bg-tech-red/60"></div>
<div class="w-1 h-3 bg-tech-red"></div>
</div>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden">
<div class="h-full bg-tech-red w-[45%]"></div>
</div>
</div>
</div>
</article>
<!-- Card 7: SECURE MONITORING -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-white/30 hover:border-tech-white/60">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-green/50"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">SEC.AUDIT</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<h3 class="font-headline-md text-headline-md font-semibold text-tech-white mb-stack-xs uppercase tracking-wide">Secure Monitoring</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Keep your data safe with reliable infrastructure.</p>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-white/5 text-tech-white px-1 py-0.5 rounded border border-white/10">ENCRYPTED</span>
<span class="material-symbols-outlined text-[14px] text-tech-white" data-icon="lock">lock</span>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden">
<div class="h-full bg-tech-white w-[100%] opacity-20"></div>
</div>
</div>
</div>
</article>
<!-- Card 8: MULTI-LOCATION CHECKS -->
<article class="hardware-card flex flex-col rounded-lg overflow-hidden group border-tech-green/30 hover:border-tech-green/60">
<div class="window-bar px-3 py-2 flex items-center gap-2">
<div class="w-2 h-2 rounded-full bg-tech-red/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-yellow/50"></div>
<div class="w-2 h-2 rounded-full bg-tech-green"></div>
<span class="ml-auto font-code-md text-[10px] text-on-surface-variant tracking-widest">GEO.PING</span>
</div>
<div class="p-stack-md flex-grow flex flex-col relative overflow-hidden">
<h3 class="font-headline-md text-headline-md font-semibold text-tech-green mb-stack-xs uppercase tracking-wide leading-tight">Multi-Location Checks</h3>
<p class="font-body-sm text-xs text-on-surface-variant mb-stack-md">Monitor from different regions for accurate status.</p>
<div class="mt-auto">
<div class="flex items-center justify-between mb-1">
<span class="font-code-md text-[10px] bg-tech-green/10 text-tech-green px-1 py-0.5 rounded border border-tech-green/20">GLOBAL_NET</span>
<div class="flex gap-1">
<span class="w-1.5 h-1.5 rounded-full bg-tech-green"></span>
<span class="w-1.5 h-1.5 rounded-full bg-tech-green opacity-50"></span>
<span class="w-1.5 h-1.5 rounded-full bg-tech-green opacity-25"></span>
</div>
</div>
<div class="progress-bar-bg h-2 w-full rounded-full overflow-hidden">
<div class="h-full bg-tech-green w-[75%] relative">
<div class="absolute right-0 top-0 h-full w-2 bg-white/50"></div>
</div>
</div>
</div>
</div>
</article>
</div>
</main>
<!-- Footer -->
<footer class="flex justify-between items-center px-margin py-stack-lg w-full bg-surface-container-lowest border-t border-outline-variant relative z-10 mt-auto">
<span class="font-headline-md text-headline-md text-on-surface">© 2024 Smart Monitoring. Precision Observability.</span>
<div class="flex gap-4">
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">API Reference</a>
<a class="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Status Page</a>
</div>
</footer>
</body></html>