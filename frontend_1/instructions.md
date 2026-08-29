<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>SMART MONITORING - Dashboard</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&amp;family=JetBrains+Mono:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "text-secondary": "#B0B3B8",
                        "on-error-container": "#ffdad6",
                        "on-primary-container": "#00612e",
                        "on-tertiary-container": "#794810",
                        "primary-fixed": "#62ff96",
                        "inverse-primary": "#006d35",
                        "grid-line": "rgba(0, 230, 118, 0.05)",
                        "on-error": "#690005",
                        "surface-variant": "#323538",
                        "on-background": "#e1e2e6",
                        "on-secondary": "#003918",
                        "primary": "#75ff9e",
                        "surface-container-high": "#282a2d",
                        "secondary-container": "#00ea76",
                        "surface-container-low": "#191c1e",
                        "background": "#111416",
                        "tertiary-fixed": "#ffdcbf",
                        "on-surface-variant": "#bacbb9",
                        "secondary-fixed": "#63ff95",
                        "on-surface": "#e1e2e6",
                        "secondary-fixed-dim": "#00e473",
                        "tertiary-container": "#ffba79",
                        "surface-container-highest": "#323538",
                        "on-secondary-fixed": "#00210b",
                        "on-primary-fixed": "#00210b",
                        "surface": "#080B0D",
                        "on-tertiary": "#4b2800",
                        "tertiary": "#ffdec4",
                        "inverse-surface": "#e1e2e6",
                        "error": "#ffb4ab",
                        "on-secondary-container": "#00642f",
                        "on-secondary-fixed-variant": "#005225",
                        "inverse-on-surface": "#2e3133",
                        "surface-bright": "#37393c",
                        "primary-fixed-dim": "#00e475",
                        "on-primary-fixed-variant": "#005226",
                        "outline-variant": "#3b4a3d",
                        "on-tertiary-fixed-variant": "#6a3c03",
                        "outline": "#859585",
                        "surface-container-lowest": "#0c0e11",
                        "surface-container": "#1d2022",
                        "on-primary": "#003918",
                        "secondary": "#93ffac",
                        "neon-border": "rgba(0, 230, 118, 0.3)",
                        "primary-container": "#00e676",
                        "error-container": "#93000a",
                        "text-primary": "#F5F5F5",
                        "surface-tint": "#00e475",
                        "on-tertiary-fixed": "#2d1600",
                        "tertiary-fixed-dim": "#fdb878",
                        "surface-dim": "#111416"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "column-gap": "12px",
                        "margin-desktop": "24px",
                        "margin-mobile": "16px",
                        "gutter": "16px",
                        "unit": "4px"
                    },
                    "fontFamily": {
                        "body-lg": ["Geist"],
                        "display-lg": ["Geist"],
                        "label-tech-sm": ["JetBrains Mono"],
                        "body-md": ["Geist"],
                        "headline-md": ["Geist"],
                        "label-tech-lg": ["JetBrains Mono"],
                        "label-tech-md": ["JetBrains Mono"],
                        "headline-lg-mobile": ["Geist"],
                        "headline-lg": ["Geist"]
                    },
                    "fontSize": {
                        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "display-lg": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "600" }],
                        "label-tech-sm": ["10px", { "lineHeight": "14px", "fontWeight": "700" }],
                        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "headline-md": ["20px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "label-tech-lg": ["14px", { "lineHeight": "20px", "letterSpacing": "0.02em", "fontWeight": "500" }],
                        "label-tech-md": ["12px", { "lineHeight": "16px", "fontWeight": "400" }],
                        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }]
                    }
                },
            },
        }
    </script>
<style>
        body {
            background-color: #050709;
            background-image: 
                linear-gradient(rgba(0, 230, 118, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 230, 118, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
            color: #F5F5F5;
        }
        
        .panel {
            background-color: #080B0D;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 200ms ease-in-out;
        }
        
        .panel:hover {
            border-color: #00E676;
            box-shadow: 0 0 8px rgba(0, 230, 118, 0.2);
        }
        
        .btn-ghost {
            background-color: transparent;
            border: 1px solid #00E676;
            color: #00E676;
            transition: all 200ms ease;
        }
        
        .btn-ghost:hover {
            background-color: rgba(0, 230, 118, 0.1);
            box-shadow: 0 0 8px rgba(0, 230, 118, 0.2);
        }
        
        .metric-value {
            font-family: 'JetBrains Mono', monospace;
            font-size: 2rem;
            font-weight: 700;
        }

        .stagger-1 { animation: fadeUp 0.4s ease-out 0.1s both; }
        .stagger-2 { animation: fadeUp 0.4s ease-out 0.2s both; }
        .stagger-3 { animation: fadeUp 0.4s ease-out 0.3s both; }
        .stagger-4 { animation: fadeUp 0.4s ease-out 0.4s both; }
        
        @keyframes fadeUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .header-accent {
            border-top: 2px solid #00E676;
        }
    </style>
</head>
<body class="antialiased min-h-screen flex text-on-surface">
<!-- SideNavBar (Shared Component JSON) -->
<nav class="hidden md:flex flex-col bg-surface-container border-r border-white/10 w-[240px] h-screen fixed left-0 top-0 py-stack-md z-40">
<div class="px-margin-desktop mb-8 flex items-center gap-3">
<div class="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-label-tech-lg font-bold">D</div>
<div>
<h1 class="font-headline-sm text-headline-sm text-primary font-bold tracking-tighter">DRISHYAM</h1>
<p class="font-label-tech-sm text-label-tech-sm text-on-surface-variant uppercase">MONITOR OS</p>
</div>
</div>
<div class="flex flex-col flex-1 px-4 gap-2">
<!-- Active Nav Item -->
<a class="flex items-center gap-3 px-4 py-3 bg-primary-container/10 text-primary border-r-2 border-primary rounded-l transition-all duration-150 ease-in-out" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">dashboard</span>
<span class="font-code-md text-code-md font-medium">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-150 ease-in-out rounded" href="#">
<span class="material-symbols-outlined">error</span>
<span class="font-code-md text-code-md">Incidents</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-150 ease-in-out rounded" href="#">
<span class="material-symbols-outlined">speed</span>
<span class="font-code-md text-code-md">API Latency</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-150 ease-in-out rounded" href="#">
<span class="material-symbols-outlined">terminal</span>
<span class="font-code-md text-code-md">Infrastructure</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-150 ease-in-out rounded" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-code-md text-code-md">Settings</span>
</a>
</div>
<div class="px-4 mt-auto">
<button class="w-full py-2 btn-ghost rounded font-label-tech-md text-label-tech-md flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm">add</span>
                New Monitor
            </button>
</div>
</nav>
<!-- Main Content Area -->
<main class="flex-1 md:ml-[240px] flex flex-col min-h-screen">
<!-- Top App Bar Area -->
<header class="w-full flex justify-between items-center px-margin-desktop py-6 border-b border-white/5 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
<div>
<p class="font-label-tech-sm text-label-tech-sm text-primary uppercase tracking-widest mb-1">COMMAND CENTER</p>
<h2 class="font-headline-lg text-headline-lg font-bold italic">Overview</h2>
</div>
<div class="flex items-center gap-4">
<button class="p-2 border border-white/10 rounded hover:border-primary hover:text-primary transition-colors text-text-secondary">
<span class="material-symbols-outlined">refresh</span>
</button>
</div>
</header>
<div class="p-margin-desktop md:p-8 flex-1">
<!-- Metrics Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-column-gap mb-column-gap">
<!-- Metric 1 -->
<div class="panel p-6 rounded stagger-1 flex flex-col relative overflow-hidden group">
<div class="flex justify-between items-start mb-4">
<span class="font-label-tech-md text-label-tech-md text-text-secondary uppercase">Total monitors</span>
<span class="material-symbols-outlined text-primary">bar_chart</span>
</div>
<div class="metric-value text-on-surface">1</div>
<p class="font-body-md text-body-md text-text-secondary mt-2">Stored in backend</p>
</div>
<!-- Metric 2 -->
<div class="panel p-6 rounded stagger-2 flex flex-col">
<div class="flex justify-between items-start mb-4">
<span class="font-label-tech-md text-label-tech-md text-text-secondary uppercase">Active monitors</span>
<span class="material-symbols-outlined text-secondary">check_circle</span>
</div>
<div class="metric-value text-on-surface">1</div>
<p class="font-body-md text-body-md text-text-secondary mt-2">Scheduler eligible</p>
</div>
<!-- Metric 3 -->
<div class="panel p-6 rounded stagger-3 flex flex-col">
<div class="flex justify-between items-start mb-4">
<span class="font-label-tech-md text-label-tech-md text-text-secondary uppercase">Paused monitors</span>
<span class="material-symbols-outlined text-tertiary-container">warning</span>
</div>
<div class="metric-value text-on-surface">0</div>
<p class="font-body-md text-body-md text-text-secondary mt-2">Currently disabled</p>
</div>
<!-- Metric 4 -->
<div class="panel p-6 rounded stagger-4 flex flex-col">
<div class="flex justify-between items-start mb-4">
<span class="font-label-tech-md text-label-tech-md text-text-secondary uppercase">Avg interval</span>
<span class="material-symbols-outlined text-primary-fixed">timer</span>
</div>
<div class="metric-value text-on-surface">45s</div>
<p class="font-body-md text-body-md text-text-secondary mt-2">From monitor records</p>
</div>
</div>
<!-- Complex Panels Grid -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-column-gap mb-column-gap">
<!-- Monitor State -->
<div class="panel rounded p-6 col-span-1 lg:col-span-5 header-accent flex flex-col justify-center stagger-3">
<div class="flex items-center gap-8">
<div class="relative w-32 h-32 flex-shrink-0">
<!-- Circular Progress Placeholder (CSS representation) -->
<svg class="w-full h-full transform -rotate-90" viewbox="0 0 100 100">
<circle cx="50" cy="50" fill="transparent" r="40" stroke="rgba(255,255,255,0.05)" stroke-width="8"></circle>
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#00E676" stroke-dasharray="251.2" stroke-dashoffset="0" stroke-width="8"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center text-center">
<span class="font-headline-md text-headline-md font-bold">100%</span>
<span class="font-label-tech-sm text-label-tech-sm text-primary">ACTIVE</span>
</div>
</div>
<div>
<h3 class="font-headline-md text-headline-md font-bold mb-2">Monitor state</h3>
<p class="font-body-md text-body-md text-text-secondary mb-4">Active records are eligible for backend scheduler checks.</p>
<ul class="space-y-2">
<li class="flex items-center gap-2 font-label-tech-md text-label-tech-md">
<span class="w-3 h-3 rounded-full bg-primary border border-primary"></span>
<span>Active 1</span>
</li>
<li class="flex items-center gap-2 font-label-tech-md text-label-tech-md text-text-secondary">
<span class="w-3 h-3 rounded-full border border-text-secondary"></span>
<span>Paused 0</span>
</li>
</ul>
</div>
</div>
</div>
<!-- Log Coverage -->
<div class="panel rounded p-6 col-span-1 lg:col-span-7 header-accent stagger-4 flex flex-col justify-center">
<h3 class="font-headline-md text-headline-md font-bold mb-2">Log coverage</h3>
<p class="font-body-md text-body-md text-text-secondary mb-6">Recent check counts from backend log analytics.</p>
<div class="w-full">
<div class="flex justify-between items-end mb-2">
<span class="font-label-tech-md text-label-tech-md uppercase tracking-wider">GITHUB.COM</span>
<span class="font-label-tech-sm text-label-tech-sm">0 CHECKS</span>
</div>
<div class="w-full h-3 bg-surface border border-white/10 rounded-full overflow-hidden">
<div class="h-full bg-primary w-[10%] rounded-full shadow-[0_0_8px_rgba(0,230,118,0.5)]"></div>
</div>
</div>
</div>
</div>
<!-- Bottom Data Row -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-column-gap pb-8">
<!-- Monitor Records -->
<div class="panel rounded p-6 col-span-1 lg:col-span-7 stagger-4">
<div class="flex justify-between items-start mb-6">
<div>
<h3 class="font-headline-md text-headline-md font-bold">Monitor records</h3>
<p class="font-body-md text-body-md text-text-secondary mt-1">Backend-backed monitor configuration and active state.</p>
</div>
<button class="btn-ghost px-4 py-2 rounded font-label-tech-md text-label-tech-md">View monitors</button>
</div>
<div class="border border-white/10 rounded p-4 hover:border-primary/50 transition-colors bg-surface-container-low group">
<div class="flex justify-between items-start">
<div>
<h4 class="font-headline-md text-headline-md font-bold mb-1">github.com</h4>
<p class="font-label-tech-md text-label-tech-md text-text-secondary mb-2">GET http://github.com</p>
<span class="font-label-tech-sm text-label-tech-sm text-text-secondary">45000MS</span>
</div>
<span class="px-2 py-1 border border-primary text-primary font-label-tech-sm text-label-tech-sm rounded bg-primary/5">ACTIVE</span>
</div>
</div>
</div>
<!-- Check Intervals -->
<div class="panel rounded p-6 col-span-1 lg:col-span-5 stagger-4 flex flex-col">
<h3 class="font-headline-md text-headline-md font-bold mb-2">Check intervals</h3>
<p class="font-body-md text-body-md text-text-secondary mb-6">Per-monitor interval values stored by the backend.</p>
<div class="mt-auto">
<div class="flex justify-between items-end mb-2">
<span class="font-label-tech-md text-label-tech-md uppercase tracking-wider">GITHUB.COM</span>
<span class="font-label-tech-sm text-label-tech-sm">45000MS</span>
</div>
<div class="w-full h-3 bg-surface border border-white/10 rounded-full overflow-hidden">
<div class="h-full bg-blue-500 w-full rounded-full opacity-80"></div>
</div>
</div>
</div>
</div>
</div>
</main>
</body></html>