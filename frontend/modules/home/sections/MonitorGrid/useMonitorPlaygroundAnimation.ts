import { useEffect, MutableRefObject } from "react";
import { gsap } from "gsap";

interface UseMonitorAnimationParams {
    playgroundRef: MutableRefObject<HTMLDivElement | null>;
    botRef: MutableRefObject<HTMLDivElement | null>;
    shockwaveRef: MutableRefObject<HTMLDivElement | null>;
    cardRefs: MutableRefObject<(HTMLDivElement | null)[]>;
}

export function useMonitorPlaygroundAnimation({
    playgroundRef,
    botRef,
    shockwaveRef,
    cardRefs,
}: UseMonitorAnimationParams) {
    useEffect(() => {
        const playground = playgroundRef.current;
        const bot = botRef.current;
        const section = playground?.closest("section");

        if (!playground || !bot || !section) return;

        const background = section.querySelector(".background-shiver") as HTMLElement | null;

        let animationStarted = false;
        let revealTimeline: gsap.core.Timeline | null = null;
        let breakoutTimeline: gsap.core.Timeline | null = null;
        let idleTween: gsap.core.Tween | null = null;
        const createdElements = new Set<HTMLElement>();

        const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // ------------------------------------------------------------
        // 1. Element Tracking & Cleanup Helpers
        // ------------------------------------------------------------
        const trackElement = (el: HTMLElement) => {
            createdElements.add(el);
            return el;
        };

        const removeTrackedElement = (el: HTMLElement) => {
            createdElements.delete(el);
            if (el && el.parentNode) el.parentNode.removeChild(el);
        };

        // ------------------------------------------------------------
        // 2. Magnetic Mouse Tracking
        // ------------------------------------------------------------
        const handleMouseMove = (e: MouseEvent) => {
            const sectionRect = section.getBoundingClientRect();
            const mouseX = e.clientX - sectionRect.left;
            const mouseY = e.clientY - sectionRect.top;
            const centerX = sectionRect.width / 2;
            const centerY = sectionRect.height / 2;

            const xOffset = (mouseX - centerX) / 50;
            const yOffset = (mouseY - centerY) / 50;

            bot.style.transition = "transform 0.1s ease-out";
            bot.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
        };

        const handleMouseLeave = () => {
            bot.style.transition = "transform 0.3s ease-out";
            bot.style.transform = "translate(-50%, -50%)";
        };

        section.addEventListener("mousemove", handleMouseMove);
        section.addEventListener("mouseleave", handleMouseLeave);

        // ------------------------------------------------------------
        // 3. Particle & Electric Effects
        // ------------------------------------------------------------
        const triggerCircuitReaction = () => {
            section.querySelectorAll(".circuit-node").forEach((node, index) => {
                gsap.to(node, {
                    opacity: 1,
                    scale: 1.4,
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: "power2.out",
                    overwrite: true,
                });
                gsap.to(node, {
                    opacity: 0.6,
                    scale: 1,
                    duration: 0.4,
                    delay: index * 0.05 + 0.2,
                    ease: "power2.out",
                    overwrite: true,
                });
            });

            section.querySelectorAll(".telemetry-cloud").forEach((cloud, index) => {
                gsap.to(cloud, {
                    borderColor: "rgba(117, 255, 158, 0.6)",
                    duration: 0.15,
                    delay: index * 0.08,
                    ease: "power2.out",
                    overwrite: true,
                });
                gsap.to(cloud, {
                    borderColor: "rgba(90, 120, 170, 0.35)",
                    duration: 0.4,
                    delay: index * 0.08 + 0.15,
                    ease: "power2.out",
                    overwrite: true,
                });
            });
        };

        const createBotEnergyPulse = () => {
            const botRect = bot.getBoundingClientRect();
            const playgroundRect = playground.getBoundingClientRect();
            const cx = botRect.left + botRect.width / 2 - playgroundRect.left;
            const cy = botRect.top + botRect.height / 2 - playgroundRect.top;

            const pulse = trackElement(document.createElement("div"));
            pulse.style.cssText = `
                position:absolute;
                width:14px;
                height:14px;
                left:${cx}px;
                top:${cy}px;
                transform:translate(-50%,-50%) scale(.35);
                border-radius:50%;
                background:#75ff9e;
                box-shadow:0 0 18px #75ff9e,0 0 36px rgba(117,255,158,.85);
                pointer-events:none;
                z-index:35;
            `;
            playground.appendChild(pulse);

            gsap.to(pulse, {
                scale: 2.8,
                opacity: 0,
                duration: 0.28,
                ease: "power2.out",
                onComplete: () => removeTrackedElement(pulse),
            });
        };

        const createRadialElectricBurst = (count = 8) => {
            const botRect = bot.getBoundingClientRect();
            const playgroundRect = playground.getBoundingClientRect();
            const cx = botRect.left + botRect.width / 2 - playgroundRect.left;
            const cy = botRect.top + botRect.height / 2 - playgroundRect.top;

            for (let i = 0; i < count; i += 1) {
                const angle = (Math.PI * 2 * i) / count;
                const length = 46 + Math.random() * 22;
                const ray = trackElement(document.createElement("div"));

                ray.style.cssText = `
                    position:absolute;
                    width:${length}px;
                    height:1.5px;
                    left:${cx}px;
                    top:${cy}px;
                    transform-origin:0 50%;
                    transform:translateY(-50%) rotate(${angle}rad) scaleX(0);
                    border-radius:999px;
                    background:linear-gradient(90deg,#75ff9e 0%,rgba(117,255,158,.9) 55%,transparent 100%);
                    box-shadow:0 0 7px rgba(117,255,158,.85);
                    pointer-events:none;
                    z-index:25;
                `;
                playground.appendChild(ray);

                gsap.to(ray, {
                    scaleX: 1,
                    opacity: 0,
                    duration: 0.22,
                    delay: i * 0.012,
                    ease: "power2.out",
                    onComplete: () => removeTrackedElement(ray),
                });
            }
        };

        const createCircularElectricSweep = (card: HTMLElement) => {
            const botRect = bot.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const playgroundRect = playground.getBoundingClientRect();

            const botX = botRect.left + botRect.width / 2 - playgroundRect.left;
            const botY = botRect.top + botRect.height / 2 - playgroundRect.top;
            const cardX = cardRect.left + cardRect.width / 2 - playgroundRect.left;
            const cardY = cardRect.top + cardRect.height / 2 - playgroundRect.top;

            const targetAngle = Math.atan2(cardY - botY, cardX - botX) * (180 / Math.PI);
            const radius = Math.max(botRect.width, botRect.height) / 2 + 28;
            const size = radius * 2;

            const ring = trackElement(document.createElement("div"));
            ring.style.cssText = `
                position:absolute;
                width:${size}px;
                height:${size}px;
                left:${botX - radius}px;
                top:${botY - radius}px;
                border-radius:50%;
                pointer-events:none;
                z-index:25;
                background:conic-gradient(from 0deg,transparent 0deg,transparent 318deg,rgba(117,255,158,.08) 330deg,rgba(117,255,158,.38) 345deg,#75ff9e 355deg,rgba(117,255,158,.95) 360deg);
                -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 1px));
                mask:radial-gradient(farthest-side,transparent calc(100% - 2px),#000 calc(100% - 1px));
                opacity:0;
                transform-origin:50% 50%;
            `;
            playground.appendChild(ring);

            const distance = Math.hypot(cardX - botX, cardY - botY);
            const beam = trackElement(document.createElement("div"));
            beam.style.cssText = `
                position:absolute;
                width:${Math.max(0, distance - radius + 4)}px;
                height:1px;
                left:${botX + Math.cos((targetAngle * Math.PI) / 180) * radius}px;
                top:${botY + Math.sin((targetAngle * Math.PI) / 180) * radius}px;
                transform-origin:0 50%;
                transform:translateY(-50%) rotate(${targetAngle}deg) scaleX(0);
                border-radius:999px;
                background:linear-gradient(90deg,rgba(117,255,158,.95),rgba(117,255,158,.5),transparent);
                box-shadow:0 0 8px rgba(117,255,158,.75);
                pointer-events:none;
                z-index:25;
                opacity:0;
            `;
            playground.appendChild(beam);

            gsap.fromTo(
                ring,
                { rotation: -90, opacity: 0 },
                {
                    rotation: targetAngle + 90,
                    opacity: 1,
                    duration: 0.34,
                    ease: "power2.inOut",
                }
            );

            gsap.to(beam, {
                scaleX: 1,
                opacity: 1,
                duration: 1,
                delay: 0.27,
                ease: "power2.out",
            });
            gsap.to(beam, {
                scaleX: 1.04,
                opacity: 0,
                duration: 0.18,
                delay: 0.43,
                ease: "power2.in",
                onComplete: () => removeTrackedElement(beam),
            });
            gsap.to(ring, {
                opacity: 0,
                duration: 0.5,
                delay: 0.38,
                ease: "power2.out",
                onComplete: () => removeTrackedElement(ring),
            });

            const spark = trackElement(document.createElement("div"));
            spark.style.cssText = `
                position:absolute;
                width:7px;
                height:7px;
                left:${cardX}px;
                top:${cardY}px;
                transform:translate(-50%,-50%) scale(.2);
                border-radius:50%;
                background:#75ff9e;
                box-shadow:0 0 8px #75ff9e,0 0 18px rgba(117,255,158,.8);
                pointer-events:none;
                z-index:26;
                opacity:0;
            `;
            playground.appendChild(spark);
            gsap.to(spark, { opacity: 1, scale: 1.3, duration: 0.08, delay: 0.37, ease: "power2.out" });
            gsap.to(spark, {
                opacity: 0,
                scale: 0.4,
                duration: 0.18,
                delay: 0.45,
                ease: "power2.in",
                onComplete: () => removeTrackedElement(spark),
            });
        };

        const createCardCornerSparks = (card: HTMLElement) => {
            const cardRect = card.getBoundingClientRect();
            const playgroundRect = playground.getBoundingClientRect();

            const corners = [
                { x: cardRect.left - playgroundRect.left, y: cardRect.top - playgroundRect.top },
                { x: cardRect.right - playgroundRect.left, y: cardRect.top - playgroundRect.top },
                { x: cardRect.left - playgroundRect.left, y: cardRect.bottom - playgroundRect.top },
                { x: cardRect.right - playgroundRect.left, y: cardRect.bottom - playgroundRect.top },
            ];

            corners.forEach((corner, index) => {
                const spark = trackElement(document.createElement("div"));
                spark.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    left: ${corner.x}px;
                    top: ${corner.y}px;
                    transform: translate(-50%, -50%) scale(0.2);
                    border-radius: 50%;
                    background: #75ff9e;
                    box-shadow: 
                        0 0 15px #75ff9e,
                        0 0 30px rgba(117,255,158,0.8),
                        0 0 45px rgba(117,255,158,0.4);
                    pointer-events: none;
                    z-index: 30;
                `;
                playground.appendChild(spark);

                gsap.to(spark, {
                    scale: 1.5,
                    opacity: 0,
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: "power2.out",
                    onComplete: () => removeTrackedElement(spark),
                });
            });
        };

        const createActivationParticles = (card: HTMLElement) => {
            const cardRect = card.getBoundingClientRect();
            for (let i = 0; i < 12; i += 1) {
                const particle = trackElement(document.createElement("div"));
                const side = Math.floor(Math.random() * 4);
                let x = 0;
                let y = 0;

                if (side === 0) {
                    x = 20 + Math.random() * 60;
                    y = 0;
                } else if (side === 1) {
                    x = 100;
                    y = 20 + Math.random() * 60;
                } else if (side === 2) {
                    x = 20 + Math.random() * 60;
                    y = 100;
                } else {
                    x = 0;
                    y = 20 + Math.random() * 60;
                }

                particle.style.cssText = `
                    position:absolute;
                    width:3px;
                    height:3px;
                    left:${x}%;
                    top:${y}%;
                    border-radius:50%;
                    background:#75ff9e;
                    box-shadow:0 0 12px #75ff9e, 0 0 20px rgba(117,255,158,0.8);
                    pointer-events:none;
                    z-index:15;
                `;
                card.appendChild(particle);

                const angle = Math.random() * Math.PI * 2;
                const distance = 12 + Math.random() * 16;
                const targetX = x + Math.cos(angle) * (distance / cardRect.width) * 100;
                const targetY = y + Math.sin(angle) * (distance / cardRect.height) * 100;

                gsap.to(particle, {
                    left: `${targetX}%`,
                    top: `${targetY}%`,
                    opacity: 0,
                    scale: 0.3,
                    duration: 0.4 + Math.random() * 0.2,
                    delay: Math.random() * 0.1,
                    ease: "power2.out",
                    onComplete: () => removeTrackedElement(particle),
                });
            }
        };

        // ------------------------------------------------------------
        // 4. Sequential Card Reveal Timeline
        // ------------------------------------------------------------
        const startReveal = () => {
            const cards = (cardRefs.current.filter(Boolean) as HTMLDivElement[]).filter(
                (card) => window.getComputedStyle(card).display !== "none"
            );

            if (!cards.length) return;

            cards.forEach((card) => {
                gsap.set(card, {
                    opacity: 0,
                    scale: 0.985,
                    willChange: "clip-path, transform, opacity",
                });
            });

            revealTimeline = gsap.timeline({
                onComplete: () => {
                    cards.forEach((card) => {
                        gsap.set(card, {
                            clearProps: "willChange",
                            scale: 1,
                            opacity: 1,
                        });
                    });
                },
            });

            revealTimeline.add(() => { }, 0.15);

            const cardOrder = [0, 1, 3, 5, 2, 4];

            cardOrder.forEach((cardIndex, seqIndex) => {
                const card = cardRefs.current[cardIndex];
                if (!card || window.getComputedStyle(card).display === "none") return;

                const start = seqIndex * 0.45;

                revealTimeline?.add(() => {
                    const eyes = bot.querySelectorAll(".bot-eye");
                    gsap.fromTo(
                        eyes,
                        { boxShadow: "0 0 8px #75ff9e" },
                        {
                            boxShadow: "0 0 16px #75ff9e, 0 0 30px rgba(117,255,158,0.9)",
                            duration: 0.12,
                            yoyo: true,
                            repeat: 1,
                            stagger: 0.025,
                            ease: "power2.out",
                            overwrite: true,
                        }
                    );

                    if (!prefersReducedMotion) {
                        createBotEnergyPulse();
                        createRadialElectricBurst(8);
                        createCardCornerSparks(card);
                    }
                }, start);

                revealTimeline?.add(() => {
                    if (!prefersReducedMotion) createCircularElectricSweep(card);
                }, start + 0.05);

                revealTimeline?.to(
                    card,
                    {
                        scale: 1,
                        opacity: 1,
                        duration: prefersReducedMotion ? 0.25 : 0.32,
                        ease: "power2.out",
                        onStart: () => {
                            gsap.fromTo(
                                card,
                                {
                                    borderColor: "rgba(117, 255, 158, 1)",
                                    boxShadow:
                                        "0 0 40px rgba(117,255,158,0.9), 0 0 80px rgba(117,255,158,0.6), inset 0 0 30px rgba(117,255,158,0.4)",
                                },
                                {
                                    borderColor: "rgba(117, 255, 158, 0.72)",
                                    boxShadow:
                                        "0 0 22px rgba(117,255,158,0.32), 0 8px 32px rgba(0,0,0,0.22)",
                                    duration: 0.3,
                                    ease: "power2.out",
                                }
                            );
                        },
                    },
                    start + 0.36
                );

                revealTimeline?.to(
                    card,
                    {
                        borderColor: "rgba(117, 255, 158, 0.72)",
                        boxShadow: "0 0 22px rgba(117,255,158,0.32), 0 8px 32px rgba(0,0,0,0.22)",
                        duration: 0.16,
                        ease: "power2.out",
                    },
                    start + 0.58
                );

                revealTimeline?.add(() => {
                    if (!prefersReducedMotion) createActivationParticles(card);
                }, start + 0.62);

                revealTimeline?.to(
                    card,
                    {
                        borderColor: "rgba(90, 120, 170, 0.35)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                        duration: 0.28,
                        ease: "power2.inOut",
                    },
                    start + 0.78
                );
            });

            revealTimeline.to(
                bot,
                {
                    boxShadow:
                        "inset 0 4px 12px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.5)",
                    duration: 0.45,
                    ease: "power2.inOut",
                },
                "-=0.2"
            );

            revealTimeline.to(
                bot.querySelectorAll(".bot-eye"),
                {
                    boxShadow: "0 0 8px #75ff9e",
                    duration: 0.45,
                    ease: "power2.inOut",
                },
                "<"
            );

            revealTimeline.play(0);
        };

        // ------------------------------------------------------------
        // 5. 3D Screen Breakout Animation Sequence
        // ------------------------------------------------------------
        const startFeatureAnimation = () => {
            if (animationStarted) return;
            animationStarted = true;

            if (prefersReducedMotion) {
                startReveal();
                return;
            }

            gsap.set(playground, {
                perspective: 1200,
                transformStyle: "preserve-3d",
            });

            gsap.set(bot, {
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
                willChange: "transform",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
            });

            breakoutTimeline = gsap.timeline({
                onComplete: () => {
                    idleTween = gsap.to(bot, {
                        y: "+=8",
                        duration: 3,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    });

                    startReveal();
                },
            });

            // PHASE 1 — anticipation.
            breakoutTimeline.to(bot, {
                scale: 0.92,
                duration: 0.1,
                ease: "power2.in",
                onStart: () => {
                    bot.querySelectorAll(".bot-eye").forEach((eye) => {
                        gsap.to(eye, {
                            boxShadow: "0 0 16px #75ff9e",
                            duration: 0.2,
                            overwrite: true,
                        });
                    });
                },
            });

            // PHASE 2 — screen breakout.
            breakoutTimeline.to(
                bot,
                {
                    scale: 2.5,
                    z: 280,
                    rotateX: -8,
                    rotateY: 5,
                    duration: 0.3,
                    ease: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    filter: "blur(0px)",
                },
                "+=0.02"
            );

            // PHASE 3 — local background shiver.
            if (background) {
                breakoutTimeline.to(background, { x: 6, duration: 0.08, ease: "power2.out" }, "-=0.1");
                breakoutTimeline.to(background, { x: -5, duration: 0.08, ease: "power2.inOut" });
                breakoutTimeline.to(background, { x: 3, duration: 0.08, ease: "power2.inOut" });
                breakoutTimeline.to(background, { x: -1, duration: 0.08, ease: "power2.inOut" });
                breakoutTimeline.to(background, { x: 0, duration: 0.12, ease: "power2.out" });
            }

            if (shockwaveRef.current) {
                breakoutTimeline.to(
                    shockwaveRef.current,
                    { opacity: 1, scale: 1, duration: 0.01 },
                    "-=0.4"
                );
                breakoutTimeline.to(shockwaveRef.current, {
                    scale: 8,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out",
                });
            }

            breakoutTimeline.call(triggerCircuitReaction, null, "-=0.5");

            // PHASE 4 — settle.
            breakoutTimeline.to(
                bot,
                {
                    scale: 2.0,
                    z: 180,
                    rotateX: 2,
                    rotateY: 0,
                    duration: 0.28,
                    ease: "elastic.out(1, 0.5)",
                },
                "+=0.05"
            );

            breakoutTimeline.to(bot, {
                scale: 1.8,
                z: 160,
                rotateX: 0,
                rotateY: 0,
                duration: 0.2,
                ease: "power2.out",
            });

            breakoutTimeline.play(0);
        };

        // ------------------------------------------------------------
        // 6. Viewport Intersection Observer Trigger
        // ------------------------------------------------------------
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    startFeatureAnimation();
                    observer.disconnect();
                }
            },
            { threshold: 0.35 }
        );

        observer.observe(section);

        // ------------------------------------------------------------
        // 7. Cleanup on Unmount
        // ------------------------------------------------------------
        return () => {
            observer.disconnect();
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseleave", handleMouseLeave);

            if (breakoutTimeline) breakoutTimeline.kill();
            if (revealTimeline) revealTimeline.kill();
            if (idleTween) idleTween.kill();

            gsap.killTweensOf([
                bot,
                background,
                ...section.querySelectorAll(".telemetry-cloud, .circuit-node, .bot-eye"),
            ]);

            createdElements.forEach((el) => {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            });
            createdElements.clear();

            gsap.set(bot, {
                clearProps: "transform,willChange,filter,z,rotateX,rotateY,boxShadow",
            });
            if (background) {
                gsap.set(background, { clearProps: "transform" });
            }
        };
    }, [playgroundRef, botRef, shockwaveRef, cardRefs]);
}
