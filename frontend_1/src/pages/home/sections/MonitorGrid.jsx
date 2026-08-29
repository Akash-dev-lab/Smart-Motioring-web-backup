import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import TechnicalBackground from "./TechnicalBackground";

const MonitorGrid = () => {
  const sectionRef = useRef(null);
  const botRef = useRef(null);
  const backgroundRef = useRef(null);
  const playgroundRef = useRef(null);
  const shockwaveRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const bot = botRef.current;
    const background = backgroundRef.current;
    const playground = playgroundRef.current;

    if (!section || !bot || !background || !playground) return;

    let animationStarted = false;
    let revealTimeline = null;
    let breakoutTimeline = null;
    let idleTween = null;
    const createdElements = new Set();

    // ------------------------------------------------------------
    // Magnetic mouse effect — kept exactly local to Features.
    // ------------------------------------------------------------
    const handleMouseMove = (e) => {
      const sectionRect = section.getBoundingClientRect();

      const mouseX = e.clientX - sectionRect.left;
      const mouseY = e.clientY - sectionRect.top;
      const centerX = sectionRect.width / 2;
      const centerY = sectionRect.height / 2;

      const xOffset = (mouseX - centerX) / 50;
      const yOffset = (mouseY - centerY) / 50;

      bot.style.transition = 'transform 0.1s ease-out';
      bot.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
    };

    const handleMouseLeave = () => {
      bot.style.transition = 'transform 0.3s ease-out';
      bot.style.transform = 'translate(-50%, -50%)';
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const trackElement = (el) => {
      createdElements.add(el);
      return el;
    };

    const removeTrackedElement = (el) => {
      createdElements.delete(el);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };

    // ------------------------------------------------------------
    // Effects below are intentionally scoped to this Features DOM.
    // No document-wide ScrollTrigger cleanup and no global selectors.
    // This is the key isolation fix for the sections after Features.
    // ------------------------------------------------------------

    const triggerCircuitReaction = () => {
      section.querySelectorAll('.circuit-node').forEach((node, index) => {
        gsap.to(node, {
          opacity: 1,
          scale: 1.4,
          duration: 0.2,
          delay: index * 0.05,
          ease: 'power2.out',
          overwrite: true,
        });
        gsap.to(node, {
          opacity: 0.6,
          scale: 1,
          duration: 0.4,
          delay: index * 0.05 + 0.2,
          ease: 'power2.out',
          overwrite: true,
        });
      });

      section.querySelectorAll('.telemetry-cloud').forEach((cloud, index) => {
        gsap.to(cloud, {
          borderColor: 'rgba(117, 255, 158, 0.6)',
          duration: 0.15,
          delay: index * 0.08,
          ease: 'power2.out',
          overwrite: true,
        });
        gsap.to(cloud, {
          borderColor: 'rgba(90, 120, 170, 0.35)',
          duration: 0.4,
          delay: index * 0.08 + 0.15,
          ease: 'power2.out',
          overwrite: true,
        });
      });
    };

    const createBotEnergyPulse = () => {
      const botRect = bot.getBoundingClientRect();
      const playgroundRect = playground.getBoundingClientRect();
      const cx = botRect.left + botRect.width / 2 - playgroundRect.left;
      const cy = botRect.top + botRect.height / 2 - playgroundRect.top;

      const pulse = trackElement(document.createElement('div'));
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
        ease: 'power2.out',
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
        const ray = trackElement(document.createElement('div'));

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
          ease: 'power2.out',
          onComplete: () => removeTrackedElement(ray),
        });
      }
    };

    const createCircularElectricSweep = (card) => {
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

      const ring = trackElement(document.createElement('div'));
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
      const beam = trackElement(document.createElement('div'));
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

      gsap.fromTo(ring, { rotation: -90, opacity: 0 }, {
        rotation: targetAngle + 90,
        opacity: 1,
        duration: 0.34,
        ease: 'power2.inOut',
      });

      gsap.to(beam, {
        scaleX: 1,
        opacity: 1,
        duration: 1,
        delay: 0.27,
        ease: 'power2.out',
      });
      gsap.to(beam, {
        scaleX: 1.04,
        opacity: 0,
        duration: 0.18,
        delay: 0.43,
        ease: 'power2.in',
        onComplete: () => removeTrackedElement(beam),
      });
      gsap.to(ring, {
        opacity: 0,
        duration: 0.5,
        delay: 0.38,
        ease: 'power2.out',
        onComplete: () => removeTrackedElement(ring),
      });

      const spark = trackElement(document.createElement('div'));
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
      gsap.to(spark, { opacity: 1, scale: 1.3, duration: 0.08, delay: 0.37, ease: 'power2.out' });
      gsap.to(spark, {
        opacity: 0,
        scale: 0.4,
        duration: 0.18,
        delay: 0.45,
        ease: 'power2.in',
        onComplete: () => removeTrackedElement(spark),
      });
    };

    // Bright electrical perimeter that appears after the bot-face activation.
    // It is created only inside the current Features card and removed after the pass.
    const createCardElectricHighlight = (card) => {
      const highlight = trackElement(document.createElement('div'));
      highlight.style.cssText = `
        position:absolute;
        inset:-2px;
        border-radius:inherit;
        pointer-events:none;
        z-index:30;
        padding:2px;
        background:conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 285deg,
          rgba(117,255,158,.08) 310deg,
          rgba(117,255,158,.45) 335deg,
          #75ff9e 352deg,
          rgba(117,255,158,.95) 360deg
        );
        -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
        -webkit-mask-composite:xor;
        mask-composite:exclude;
        opacity:0;
        transform:rotate(0deg);
        filter:drop-shadow(0 0 5px rgba(117,255,158,.8));
      `;

      card.appendChild(highlight);

      gsap.fromTo(
        highlight,
        { opacity:0, rotation:0 },
        {
          opacity:1,
          rotation:360,
          duration:0.5,
          ease:'none',
          onComplete:() => {
            gsap.to(highlight, {
              opacity:0,
              duration:0.12,
              ease:'power2.out',
              onComplete:() => removeTrackedElement(highlight),
            });
          },
        }
      );
    };

    const createCardCornerSparks = (card) => {
      const cardRect = card.getBoundingClientRect();
      const playgroundRect = playground.getBoundingClientRect();
      
      // Create sparks at all 4 corners
      const corners = [
        { x: cardRect.left - playgroundRect.left, y: cardRect.top - playgroundRect.top }, // Top-left
        { x: cardRect.right - playgroundRect.left, y: cardRect.top - playgroundRect.top }, // Top-right
        { x: cardRect.left - playgroundRect.left, y: cardRect.bottom - playgroundRect.top }, // Bottom-left
        { x: cardRect.right - playgroundRect.left, y: cardRect.bottom - playgroundRect.top }, // Bottom-right
      ];

      corners.forEach((corner, index) => {
        const spark = trackElement(document.createElement('div'));
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
          ease: 'power2.out',
          onComplete: () => removeTrackedElement(spark),
        });
      });
    };

    const createActivationParticles = (card) => {
      const cardRect = card.getBoundingClientRect();
      // Increased from 3 to 12 particles for more energetic effect
      for (let i = 0; i < 12; i += 1) {
        const particle = trackElement(document.createElement('div'));
        const side = Math.floor(Math.random() * 4);
        let x;
        let y;

        if (side === 0) { x = 20 + Math.random() * 60; y = 0; }
        else if (side === 1) { x = 100; y = 20 + Math.random() * 60; }
        else if (side === 2) { x = 20 + Math.random() * 60; y = 100; }
        else { x = 0; y = 20 + Math.random() * 60; }

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
        const distance = 12 + Math.random() * 16; // Increased distance
        const targetX = x + Math.cos(angle) * (distance / cardRect.width) * 100;
        const targetY = y + Math.sin(angle) * (distance / cardRect.height) * 100;

        gsap.to(particle, {
          left: `${targetX}%`,
          top: `${targetY}%`,
          opacity: 0,
          scale: 0.3,
          duration: 0.4 + Math.random() * 0.2, // Slightly longer duration
          delay: Math.random() * 0.1,
          ease: 'power2.out',
          onComplete: () => removeTrackedElement(particle),
        });
      }
    };

    const startReveal = () => {
      const cards = cardRefs.current
        .filter(Boolean)
        .filter((card) => window.getComputedStyle(card).display !== 'none');

      if (!cards.length) return;

      // Cards never receive x/y movement. They remain in their original CSS positions.
      // The circular mask itself starts from the bot-face location, so the card
      // appears to expand out from behind the bot instead of moving from the bot.
      const revealOrigins = new Map();

      cards.forEach((card) => {
        const botRect = bot.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const botCenterX = botRect.left + botRect.width / 2;
        const botCenterY = botRect.top + botRect.height / 2;

        const originX = ((botCenterX - cardRect.left) / cardRect.width) * 100;
        const originY = ((botCenterY - cardRect.top) / cardRect.height) * 100;
        const origin = `${originX}% ${originY}%`;
        revealOrigins.set(card, origin);

        gsap.set(card, {
          opacity: 0,
          scale: 0.985,
          willChange: 'clip-path, transform, opacity',
        });
      });

      revealTimeline = gsap.timeline({
        onComplete: () => {
          cards.forEach((card) => {
            gsap.set(card, {
              clearProps: 'willChange',
              scale: 1,
              opacity: 1,
            });
          });
        },
      });

      // Short pause after the bot settles.
      revealTimeline.add(() => {}, 0.15);

      // Same clockwise order as the circular reveal version.
      const cardOrder = [0, 1, 3, 5, 2, 4];

      cardOrder.forEach((cardIndex, seqIndex) => {
        const card = cardRefs.current[cardIndex];
        if (!card || window.getComputedStyle(card).display === 'none') return;

        const start = seqIndex * 0.45;

        revealTimeline.add(() => {
          const eyes = bot.querySelectorAll('.bot-eye');
          gsap.fromTo(eyes,
            { boxShadow: '0 0 8px #75ff9e' },
            {
              boxShadow: '0 0 16px #75ff9e, 0 0 30px rgba(117,255,158,0.9)',
              duration: 0.12,
              yoyo: true,
              repeat: 1,
              stagger: 0.025,
              ease: 'power2.out',
              overwrite: true,
            }
          );

          if (!prefersReducedMotion) {
            createBotEnergyPulse();
            createRadialElectricBurst(8);
            // Add corner sparks on card reveal
            createCardCornerSparks(card);
          }
        }, start);

        revealTimeline.add(() => {
          if (!prefersReducedMotion) createCircularElectricSweep(card);
        }, start + 0.05);

        revealTimeline.to(card, {
          scale: 1,
          opacity: 1,
          duration: prefersReducedMotion ? 0.25 : 0.32,
          ease: 'power2.out',
          onStart: () => {
            // Immediate electric flash on reveal
            gsap.fromTo(card, {
              borderColor: 'rgba(117, 255, 158, 1)',
              boxShadow: '0 0 40px rgba(117,255,158,0.9), 0 0 80px rgba(117,255,158,0.6), inset 0 0 30px rgba(117,255,158,0.4)',
            }, {
              borderColor: 'rgba(117, 255, 158, 0.72)',
              boxShadow: '0 0 22px rgba(117,255,158,0.32), 0 8px 32px rgba(0,0,0,0.22)',
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        }, start + 0.36);

        revealTimeline.to(card, {
          borderColor: 'rgba(117, 255, 158, 0.72)',
          boxShadow: '0 0 22px rgba(117,255,158,0.32), 0 8px 32px rgba(0,0,0,0.22)',
          duration: 0.16,
          ease: 'power2.out',
        }, start + 0.58);

        // Once the bot-face pulse has finished, trace the card perimeter
        // with a short electric highlight. Everything else stays unchanged.
        // REMOVED: createCardElectricHighlight - thin loader removed per user request

        revealTimeline.add(() => {
          if (!prefersReducedMotion) createActivationParticles(card);
        }, start + 0.62);

        revealTimeline.to(card, {
          borderColor: 'rgba(90, 120, 170, 0.35)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          duration: 0.28,
          ease: 'power2.inOut',
        }, start + 0.78);
      });

      revealTimeline.to(bot, {
        boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.5)',
        duration: 0.45,
        ease: 'power2.inOut',
      }, '-=0.2');

      revealTimeline.to(bot.querySelectorAll('.bot-eye'), {
        boxShadow: '0 0 8px #75ff9e',
        duration: 0.45,
        ease: 'power2.inOut',
      }, '<');

      revealTimeline.play(0);
    };

    const startFeatureAnimation = () => {
      if (animationStarted) return;
      animationStarted = true;

      if (prefersReducedMotion) {
        startReveal();
        return;
      }

      gsap.set(playground, {
        perspective: 1200,
        transformStyle: 'preserve-3d',
      });

      gsap.set(bot, {
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased',
      });

      breakoutTimeline = gsap.timeline({
        onComplete: () => {
          // Keep the existing idle bot behavior.
          idleTween = gsap.to(bot, {
            y: '+=8',
            duration: 3,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });

          startReveal();
        },
      });

      // PHASE 1 — anticipation.
      breakoutTimeline.to(bot, {
        scale: 0.92,
        duration: 0.10,
        ease: 'power2.in',
        onStart: () => {
          bot.querySelectorAll('.bot-eye').forEach((eye) => {
            gsap.to(eye, {
              boxShadow: '0 0 16px #75ff9e',
              duration: 0.2,
              overwrite: true,
            });
          });
        },
      });

      // PHASE 2 — screen breakout.
      breakoutTimeline.to(bot, {
        scale: 2.5,
        z: 280,
        rotateX: -8,
        rotateY: 5,
        duration: 0.30,
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: 'blur(0px)',
      }, '+=0.02');

      // PHASE 3 — local Features background shiver only.
      breakoutTimeline.to(background, { x: 6, duration: 0.08, ease: 'power2.out' }, '-=0.1');
      breakoutTimeline.to(background, { x: -5, duration: 0.08, ease: 'power2.inOut' });
      breakoutTimeline.to(background, { x: 3, duration: 0.08, ease: 'power2.inOut' });
      breakoutTimeline.to(background, { x: -1, duration: 0.08, ease: 'power2.inOut' });
      breakoutTimeline.to(background, { x: 0, duration: 0.12, ease: 'power2.out' });

      // Shockwave remains inside this Features playground.
      if (shockwaveRef.current) {
        breakoutTimeline.to(shockwaveRef.current, { opacity: 1, scale: 1, duration: 0.01 }, '-=0.4');
        breakoutTimeline.to(shockwaveRef.current, {
          scale: 8,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
        });
      }

      breakoutTimeline.call(triggerCircuitReaction, null, '-=0.5');

      // PHASE 4 — settle.
      breakoutTimeline.to(bot, {
        scale: 2.0,
        z: 180,
        rotateX: 2,
        rotateY: 0,
        duration: 0.28,
        ease: 'elastic.out(1, 0.5)',
      }, '+=0.05');

      breakoutTimeline.to(bot, {
        scale: 1.8,
        z: 160,
        rotateX: 0,
        rotateY: 0,
        duration: 0.20,
        ease: 'power2.out',
      });

      breakoutTimeline.play(0);
    };

    // ------------------------------------------------------------
    // Local IntersectionObserver instead of ScrollTrigger.
    // This cannot kill or modify scroll animations belonging to
    // How It Works or any later section.
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

    return () => {
      observer.disconnect();
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);

      if (breakoutTimeline) breakoutTimeline.kill();
      if (revealTimeline) revealTimeline.kill();
      if (idleTween) idleTween.kill();

      gsap.killTweensOf([bot, background, ...section.querySelectorAll('.telemetry-cloud, .circuit-node, .bot-eye')]);

      createdElements.forEach((el) => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
      createdElements.clear();

      // Restore only this component's animated properties.
      gsap.set(bot, { clearProps: 'transform,willChange,filter,z,rotateX,rotateY,boxShadow' });
      gsap.set(background, { clearProps: 'transform' });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-[780px] w-full overflow-hidden bg-[#111317] font-mono bg-grain sm:h-screen sm:h-[100svh] sm:min-h-0"
    >
      {/* Background wrapper for shiver effect */}
      <div ref={backgroundRef} className="absolute inset-0">
        {/* Grid Background */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Whitish Glow Effect in Middle */}
        <div className="absolute inset-0 z-2 pointer-events-none">
          <div className="absolute w-full h-full bg-white/20 blur-[300px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-[100px]"></div>
        </div>

        <TechnicalBackground />

        {/* Circuit nodes for reaction */}
        {[
          { top: "20%", left: "25%", delay: 0 },
          { top: "30%", right: "22%", delay: 0.05 },
          { bottom: "28%", left: "20%", delay: 0.1 },
          { bottom: "20%", right: "28%", delay: 0.15 },
          { top: "45%", left: "18%", delay: 0.08 },
          { top: "50%", right: "15%", delay: 0.12 },
        ].map((style, i) => (
          <div
            key={i}
            className="circuit-node absolute w-2 h-2 bg-[#75ff9e] rounded-full opacity-60 z-10 pointer-events-none"
            style={{ 
              ...style,
              boxShadow: '0 0 8px #75ff9e',
              transition: 'all 0.3s ease'
            }}
          />
        ))}

        {/* 1. SCALED WATERMARK - Responsive scale */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.14] z-0">
          <h2 className="text-[clamp(7rem,32vw,28rem)] font-black italic text-slate-600 leading-none tracking-normal sm:tracking-tighter uppercase">
            CORE
          </h2>
        </div>
      </div>

      {/* 2. SEARCH BAR - Typing Animation */}
      <div className="absolute top-2 left-[50%] -translate-x-1/2 z-[200] w-max max-w-[92vw]">
        <div className="bg-none border border-green-400 px-4 sm:px-6 md:px-10 py-1.5 sm:py-2 md:py-2.5 rounded-xl flex items-center gap-3 sm:gap-4 md:gap-6">
          <div className="animate-typing">
            <span className="font-black uppercase italic tracking-[0.08em] sm:tracking-[0.1em] text-green-500 text-base sm:text-lg md:text-xl">
              FEATURES
            </span>
          </div>
        </div>
      </div>

      {/* Description Paragraph */}
      {/* <div className="absolute top-[7%] sm:top-[10%] left-[50%] -translate-x-1/2 z-200 w-full max-w-2xl px-4">
        <p className="font-body-lg text-center text-white text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Real-time telemetry and status across all critical infrastructure
          layers. High-density signals prioritize active incidents and anomalous
          latency.
        </p>
      </div> */}

      {/* 4. ASYMMETRIC FOLDER - Pinned to right gutter */}
      {/* <div className="absolute top-[35%] md:top-[40%] right-[3%] md:right-[5%] z-10 w-20 h-14 md:w-24 md:h-16 pointer-events-none hidden sm:block">
        <div className="absolute -top-3 left-0 w-8 h-3 md:w-10 md:h-4 bg-black border-[2px] border-black rounded-t-sm"></div>
        <div className="absolute inset-0 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
           <span className="font-black italic text-[7px] md:text-[8px] uppercase tracking-tighter opacity-40">DATA_FS</span>
        </div>
      </div> */}

      {/* 5. CLUSTERED DOTS - Distributed across screen gutters */}
      {[
        { top: "42%", left: "44%" },
        { bottom: "35%", right: "28%" },
        { top: "12%", left: "12%" },
        { bottom: "15%", left: "45%" },
        { top: "65%", right: "10%" },
        { bottom: "10%", left: "10%" },
      ].map((style, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 md:w-3.5 md:h-3.5 bg-black rounded-full z-10"
          style={style}
        />
      ))}

      {/* 6. CREDIT CARD - Left side anchor */}
      {/* <div className="absolute bottom-[18%] left-[5%] md:left-[10%] z-10 w-16 h-10 md:w-20 md:h-12 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 hidden sm:block">
        <div className="w-8 md:w-10 h-1.5 md:h-2 bg-black mb-2"></div>
        <div className="w-4 md:w-6 h-1 bg-black opacity-20"></div>
      </div> */}

      {/* 7. CURSOR ICON - Anchored bottom right */}
      {/* <div className="absolute bottom-[5%] sm:bottom-[8%] right-[4%] md:right-[8%] z-50 rotate-[-15deg] scale-75 md:scale-100">
        <svg
          className="h-10 w-10 sm:h-[45px] sm:w-[45px]"
          viewBox="0 0 24 24"
          fill="black"
        >
          <path
            d="M7 2l12 10.5-5.5.5 3.5 6-3 1.5-3.5-6L7 18z"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div> */}

      {/* Interactive Canvas Area with Bot and Telemetry Clouds */}
      <div 
        ref={playgroundRef}
        id="playground" 
        className="relative w-full bg-amber- max-w-6xl h-[600px] mx-auto mt-24 z-20"
      >
        {/* Shockwave Effect */}
        <div
          ref={shockwaveRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full pointer-events-none z-40"
          style={{
            background: 'radial-gradient(circle, rgba(117, 255, 158, 0.4) 0%, rgba(117, 255, 158, 0.2) 40%, rgba(117, 255, 158, 0) 70%)',
            border: '2px solid rgba(117, 255, 158, 0.6)',
            boxShadow: '0 0 40px rgba(117, 255, 158, 0.4), inset 0 0 20px rgba(117, 255, 158, 0.3)',
            opacity: 0,
            transform: 'scale(0.5)',
          }}
        />

        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" id="connector-svg" style={{ filter: 'drop-shadow(0 0 2px rgba(117,255,158,0.2))' }}>
          {/* Lines will be dynamically updated */}
        </svg>

        {/* Center Character (Agent Bot) */}
        <div 
          ref={botRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] bg-[#0A0E17] rounded-full border-2 border-white/5 shadow-[inset_0_4px_12px_rgba(255,255,255,0.1),_0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center z-30 relative"
          id="monitoring-agent"
          style={{ 
            backdropFilter: 'blur(8px)',
            imageRendering: 'crisp-edges',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            transformStyle: 'preserve-3d',
            zIndex: 30 // Always above cards
          }}
        >
          {/* Pulse Ring Effect */}
          <div 
            className="absolute inset-0 bg-[#75ff9e]/20 rounded-full animate-ping opacity-75"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          ></div>
          
          {/* Face/Eyes */}
          <div 
            className="flex gap-4 items-center relative z-10"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
            <div 
              className="bot-eye w-4 h-2 bg-[#75ff9e] rounded-full shadow-[0_0_8px_#75ff9e]"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            ></div>
            <div 
              className="bot-eye w-4 h-2 bg-[#75ff9e] rounded-full shadow-[0_0_8px_#75ff9e]"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            ></div>
          </div>
          
          {/* Status LED */}
          <div 
            className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#75ff9e] rounded-full shadow-[0_0_6px_#75ff9e] animate-pulse"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          ></div>
        </div>

        {/* Telemetry Clouds */}
        {/* 1. UPTIME - Upper Left */}
        <div 
          ref={(el) => (cardRefs.current[0] = el)}
          className="telemetry-cloud absolute top-[10%] left-[15%] w-64 animate-float opacity-0"
          data-card-index="0"
          style={{ 
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0s',
            background: 'rgba(7, 19, 38, 0.55)',
            border: '1px solid rgba(90, 120, 170, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '40px',
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 20, // Behind bot
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-4 h-4 text-[#75ff9e]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">Uptime Monitoring</span>
          </div>
          <div className="font-[Geist] text-[13px] text-[#75ff9e] flex items-center justify-between">
            <span>99.98% SLA</span>
            <div className="w-2 h-2 bg-[#75ff9e] rounded-full"></div>
          </div>
        </div>

        {/* 2. ALERTS - Upper Right */}
        <div 
          ref={(el) => (cardRefs.current[1] = el)}
          className="telemetry-cloud absolute top-[25%] right-[10%] w-72 animate-float opacity-0"
          data-card-index="1"
          style={{ 
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1s',
            background: 'rgba(7, 19, 38, 0.55)',
            border: '1px solid rgba(90, 120, 170, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '40px',
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-4 h-4 text-[#ffb4ab]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">Real-Time Alerts</span>
          </div>
          <div className="font-[Geist] text-[13px] text-[#ffb4ab] flex items-center justify-between">
            <span>2 Incidents Detected</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* 3. MULTI-REGION - Lower Left */}
        <div 
          ref={(el) => (cardRefs.current[2] = el)}
          className="telemetry-cloud absolute bottom-[15%] left-[10%] w-72 animate-float opacity-0"
          data-card-index="2"
          style={{ 
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2s',
            background: 'rgba(7, 19, 38, 0.55)',
            border: '1px solid rgba(90, 120, 170, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '40px',
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-4 h-4 text-[#bacbb9]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
            </svg>
            <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">Multi-Region Checks</span>
          </div>
          <div className="font-[Geist] text-[13px] text-[#bacbb9]">
            US-EAST · EU-WEST · AP-SOUTH
          </div>
        </div>

        {/* 4. LATENCY - Middle Right */}
        <div 
          ref={(el) => (cardRefs.current[3] = el)}
          className="telemetry-cloud absolute bottom-[25%] right-[15%] w-64 animate-float opacity-0"
          data-card-index="3"
          style={{ 
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '0.5s',
            background: 'rgba(7, 19, 38, 0.55)',
            border: '1px solid rgba(90, 120, 170, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '40px',
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-4 h-4 text-[#d0bcff]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">Latency</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-[Geist] text-[13px] text-[#d0bcff]">142ms Average</div>
            <div className="w-full h-1 bg-[#333538] rounded-full overflow-hidden">
              <div className="h-full bg-[#d0bcff] w-[60%]"></div>
            </div>
          </div>
        </div>

        {/* 5. AI INCIDENT - Middle Left (hidden on mobile) */}
        <div 
          ref={(el) => (cardRefs.current[4] = el)}
          className="telemetry-cloud absolute top-[40%] left-[2%] w-72 animate-float opacity-0 hidden md:block"
          data-card-index="4"
          style={{ 
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '1.5s',
            background: 'rgba(7, 19, 38, 0.55)',
            border: '1px solid rgba(90, 120, 170, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '40px',
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-4 h-4 text-[#c4abff]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">AI Analysis</span>
          </div>
          <div className="font-[Geist] text-[13px] text-[#c4abff]">
            Root cause identified in DB-04
          </div>
        </div>

        {/* 6. LOGS - Lower Right (hidden on mobile) */}
        <div 
          ref={(el) => (cardRefs.current[5] = el)}
          className="telemetry-cloud absolute bottom-[5%] right-[30%] w-64 animate-float opacity-0 hidden md:block"
          data-card-index="5"
          style={{ 
            animation: 'float 6s ease-in-out infinite',
            animationDelay: '2.5s',
            background: 'rgba(7, 19, 38, 0.55)',
            border: '1px solid rgba(90, 120, 170, 0.35)',
            backdropFilter: 'blur(12px)',
            borderRadius: '40px',
            padding: '16px 24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 20,
          }}
        >
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-4 h-4 text-[#bacbb9]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="font-[Geist] text-[11px] text-[#e2e2e6] uppercase tracking-wider font-semibold">Dashboards & Logs</span>
          </div>
          <div className="font-[Geist] text-[13px] text-[#bacbb9]">
            1,284 checks / hour
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonitorGrid;
