<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Smart Monitoring - Features</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                "on-primary": "#003918",
                "surface": "#111317",
                "on-secondary-fixed-variant": "#5516be",
                "primary": "#75ff9e",
                "surface-tint": "#00e475",
                "secondary-fixed": "#e9ddff",
                "secondary-container": "#571bc1",
                "inverse-primary": "#006d35",
                "surface-dim": "#111317",
                "background": "#030D22", // Custom background per prompt
                "on-primary-container": "#00612e",
                "tertiary-fixed": "#ffdad7",
                "error": "#ffb4ab",
                "surface-container-lowest": "#0c0e11",
                "tertiary-container": "#ffb6b1",
                "secondary": "#d0bcff",
                "inverse-on-surface": "#2f3034",
                "on-secondary-container": "#c4abff",
                "tertiary": "#ffddda",
                "surface-container-low": "#1a1c1f",
                "on-tertiary-fixed": "#410004",
                "surface-variant": "#333538",
                "primary-fixed-dim": "#00e475",
                "on-tertiary-fixed-variant": "#930015",
                "surface-bright": "#37393d",
                "on-background": "#e2e2e6",
                "on-surface-variant": "#bacbb9",
                "surface-container-high": "#282a2d",
                "on-secondary-fixed": "#23005c",
                "on-secondary": "#3c0091",
                "error-container": "#93000a",
                "tertiary-fixed-dim": "#ffb3ae",
                "on-tertiary": "#68000c",
                "outline": "#859585",
                "secondary-fixed-dim": "#d0bcff",
                "on-primary-fixed": "#00210b",
                "on-surface": "#e2e2e6",
                "on-primary-fixed-variant": "#005226",
                "outline-variant": "#3b4a3d",
                "surface-container": "#1e2023",
                "primary-container": "#00e676",
                "on-error-container": "#ffdad6",
                "inverse-surface": "#e2e2e6",
                "on-tertiary-container": "#a90d1e",
                "surface-container-highest": "#333538",
                "primary-fixed": "#62ff96",
                "on-error": "#690005"
              },
              borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
              },
              spacing: {
                "stack-lg": "32px",
                "stack-md": "16px",
                "unit": "4px",
                "container-max": "1440px",
                "margin": "24px",
                "gutter": "16px",
                "stack-xs": "4px",
                "stack-sm": "8px"
              },
              fontFamily: {
                "headline-md": ["Geist"],
                "label-sm": ["Geist"],
                "headline-lg": ["Geist"],
                "display-lg": ["Geist"],
                "code-md": ["JetBrains Mono"],
                "body-lg": ["Geist"],
                "body-md": ["Geist"]
              },
              fontSize: {
                "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
                "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
                "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" }],
                "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "600" }],
                "code-md": ["13px", { lineHeight: "20px", fontWeight: "400" }],
                "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
                "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }]
              }
            }
          }
        }
    </script>
<style>
        /* Custom Background Grid & Paths */
        .bg-grid-circuit {
            background-image: 
                linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 40px 40px;
        }

        /* Glassmorphic Telemetry Clouds */
        .telemetry-cloud {
            background: rgba(7, 19, 38, 0.55);
            border: 1px solid rgba(90, 120, 170, 0.35);
            backdrop-filter: blur(12px);
            border-radius: 40px; /* Soft cloud shape */
            padding: 16px 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .telemetry-cloud:hover {
            border-color: rgba(117, 255, 158, 0.5); /* Primary glow */
            transform: translateY(-2px);
        }

        /* Animations */
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(2); opacity: 0; }
        }
        .animate-pulse-ring::before {
            content: '';
            position: absolute;
            left: 50%; top: 50%;
            width: 100%; height: 100%;
            background: rgba(117, 255, 158, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            z-index: -1;
        }

        /* Connector Lines SVG Base */
        .connector-line {
            stroke: rgba(90, 120, 170, 0.3);
            stroke-width: 1.5;
            fill: none;
        }
        .data-packet {
            fill: #75ff9e;
            filter: drop-shadow(0 0 4px #75ff9e);
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body-md antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary">
<!-- TopNavBar (Shared Component) -->
<nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-surface-container-low/80 backdrop-blur-md rounded-full mt-4 mx-margin max-w-container-max lg:mx-auto border border-white/10 shadow-md">
<div class="flex items-center gap-6">
<span class="font-headline-md text-headline-md font-bold text-primary">Smart Monitoring</span>
<div class="hidden md:flex gap-4">
<a class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md active:scale-95 duration-200" href="#">Overview</a>
<a class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md active:scale-95 duration-200" href="#">Monitors</a>
<a class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md active:scale-95 duration-200" href="#">Incidents</a>
<a class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md active:scale-95 duration-200" href="#">Logs</a>
<a class="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm uppercase tracking-wider hover:bg-surface-variant/50 transition-colors px-3 py-1 rounded-md active:scale-95 duration-200" href="#">AI Insights</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">notifications</button>
<button class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">help_outline</button>
<button class="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-wider px-4 py-2 rounded-full hover:bg-primary-fixed transition-colors shadow-[0_0_12px_rgba(117,255,158,0.15)] hover:shadow-[0_0_16px_rgba(117,255,158,0.3)]">Deploy Agent</button>
</div>
</nav>
<!-- Main Features Section -->
<main class="relative w-full h-[100vh] min-h-[800px] flex flex-col items-center justify-center overflow-hidden bg-grid-circuit">
<!-- Background Vignette/Gradient -->
<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#030D22_80%)] pointer-events-none z-0"></div>
<!-- Header Content -->
<div class="absolute top-32 left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-2xl px-6 pointer-events-none">
<div class="inline-flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-primary text-sm">search</span>
<span class="font-label-sm text-label-sm text-primary uppercase tracking-wider border-b border-primary/30 pb-0.5">Features</span>
</div>
<h1 class="font-headline-lg text-headline-lg text-on-surface mb-4 font-bold">Everything your infrastructure needs to stay visible.</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto leading-relaxed">
                Autonomous telemetry gathering with predictive AI diagnostics. Deploy globally, monitor centrally.
            </p>
</div>
<!-- Interactive Canvas Area -->
<div class="relative w-full max-w-6xl h-[600px] mt-24 z-10" id="agent-canvas">
<!-- SVG Connectors (Drawn via JS for dynamic following) -->
<svg class="absolute inset-0 w-full h-full pointer-events-none z-0" id="connector-svg" style="filter: drop-shadow(0 0 2px rgba(117,255,158,0.2));">
<!-- Lines will be injected here -->
</svg>
<!-- Center Character (Agent Bot) -->
<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#0A0E17] rounded-full cursor-grab active:cursor-grabbing border-2 border-white/5 shadow-[inset_0_4px_12px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center z-30 animate-pulse-ring" id="monitoring-agent" style="backdrop-filter: blur(8px);">
<!-- Face/Eyes -->
<div class="flex gap-4 items-center">
<div class="w-4 h-2 bg-primary rounded-full shadow-[0_0_8px_#75ff9e]"></div>
<div class="w-4 h-2 bg-primary rounded-full shadow-[0_0_8px_#75ff9e]"></div>
</div>
<!-- Status LED -->
<div class="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_6px_#75ff9e] animate-pulse"></div>
</div>
<!-- Telemetry Clouds -->
<!-- 1. UPTIME -->
<div class="telemetry-cloud absolute top-[10%] left-[15%] w-64 animate-float" style="animation-delay: 0s;">
<div class="flex items-center gap-3 mb-1">
<span class="material-symbols-outlined text-primary text-sm">schedule</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase">Uptime Monitoring</span>
</div>
<div class="font-code-md text-code-md text-primary flex items-center justify-between">
<span>99.98% SLA</span>
<div class="w-2 h-2 bg-primary rounded-full"></div>
</div>
</div>
<!-- 2. ALERTS -->
<div class="telemetry-cloud absolute top-[25%] right-[10%] w-72 animate-float" style="animation-delay: 1s;">
<div class="flex items-center gap-3 mb-1">
<span class="material-symbols-outlined text-error text-sm">warning</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase">Real-Time Alerts</span>
</div>
<div class="font-code-md text-code-md text-error flex items-center justify-between">
<span>2 Incidents Detected</span>
<span class="material-symbols-outlined text-sm">error</span>
</div>
</div>
<!-- 3. MULTI-REGION -->
<div class="telemetry-cloud absolute bottom-[15%] left-[10%] w-72 animate-float" style="animation-delay: 2s;">
<div class="flex items-center gap-3 mb-1">
<span class="material-symbols-outlined text-on-surface-variant text-sm">public</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase">Multi-Region Checks</span>
</div>
<div class="font-code-md text-code-md text-on-surface-variant">
                    US-EAST · EU-WEST · AP-SOUTH
                </div>
</div>
<!-- 4. LATENCY -->
<div class="telemetry-cloud absolute bottom-[25%] right-[15%] w-64 animate-float" style="animation-delay: 0.5s;">
<div class="flex items-center gap-3 mb-1">
<span class="material-symbols-outlined text-secondary text-sm">speed</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase">Latency</span>
</div>
<div class="flex flex-col gap-1">
<div class="font-code-md text-code-md text-secondary">142ms Average</div>
<div class="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
<div class="h-full bg-secondary w-[60%]"></div>
</div>
</div>
</div>
<!-- 5. AI INCIDENT -->
<div class="telemetry-cloud absolute top-[40%] left-[2%] w-72 animate-float hidden md:block" style="animation-delay: 1.5s;">
<div class="flex items-center gap-3 mb-1">
<span class="material-symbols-outlined text-on-secondary-container text-sm">psychology</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase">AI Analysis</span>
</div>
<div class="font-code-md text-code-md text-on-secondary-container">
                    Root cause identified in DB-04
                </div>
</div>
<!-- 6. LOGS -->
<div class="telemetry-cloud absolute bottom-[5%] right-[30%] w-64 animate-float hidden md:block" style="animation-delay: 2.5s;">
<div class="flex items-center gap-3 mb-1">
<span class="material-symbols-outlined text-on-surface-variant text-sm">subject</span>
<span class="font-label-sm text-label-sm text-on-surface uppercase">Dashboards &amp; Logs</span>
</div>
<div class="font-code-md text-code-md text-on-surface-variant">
                    1,284 checks / hour
                </div>
</div>
</div>
</main>
<script>
        // Very basic mock of spring physics for visual effect since external document isn't loaded
        const agent = document.getElementById('monitoring-agent');
        const canvas = document.getElementById('agent-canvas');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        // Position reset variables
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;

        agent.addEventListener('mousedown', (e) => {
            isDragging = true;
            agent.style.transition = 'none';
            
            const rect = agent.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            
            // Calculate current offset relative to canvas center
            initialX = rect.left - canvasRect.left + (rect.width/2) - (canvasRect.width/2);
            initialY = rect.top - canvasRect.top + (rect.height/2) - (canvasRect.height/2);
            
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            const newX = initialX + dx;
            const newY = initialY + dy;

            // Apply translation and subtle tilt
            agent.style.transform = `translate(calc(-50% + ${newX}px), calc(-50% + ${newY}px)) rotate(${dx * 0.05}deg)`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Snap back to center with CSS transition
                agent.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                agent.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            }
        });
        
        // Simple parallax on mouse move for non-drag state
        document.addEventListener('mousemove', (e) => {
            if(isDragging) return;
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            agent.style.transition = 'transform 0.1s ease-out';
            agent.style.transform = `translate(calc(-50% + ${-xAxis}px), calc(-50% + ${-yAxis}px))`;
        });
    </script>
</body></html>