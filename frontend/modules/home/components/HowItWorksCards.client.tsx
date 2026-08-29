"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HowItWorksStep from "./HowItWorksStep";
import { HowItWorksStepData } from "../data/content";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const SECTION_ACTIVE_Z_INDEX = 120;
const SECTION_RESTING_Z_INDEX = 40;
const STEP_SCROLL_LENGTH = 160;
const CARD_SETTLE_HOLD = 0.8;

interface HowItWorksCardsProps {
    steps: HowItWorksStepData[];
}

export default function HowItWorksCards({ steps }: HowItWorksCardsProps) {
    const cardsLayerRef = useRef<HTMLDivElement | null>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
        if (!cards.length) return;

        const section = cardsLayerRef.current?.closest("section");
        if (!section) return;

        const ctx = gsap.context(() => {
            // 1. Initial State: Cards are positioned below the viewport
            gsap.set(cards, {
                y: () => window.innerHeight,
                yPercent: -50,
                xPercent: 0,
                rotation: 0,
                autoAlpha: 1,
            });

            // 2. Main Timeline: Handles pinning and stacking
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => `+=${steps.length * STEP_SCROLL_LENGTH}%`,
                    pin: true,
                    scrub: 0.35,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onEnter: () => {
                        gsap.set(section, { zIndex: SECTION_ACTIVE_Z_INDEX });
                        gsap.set(cardsLayerRef.current, { autoAlpha: 1 });
                    },
                    onEnterBack: () => {
                        gsap.set(section, { zIndex: SECTION_ACTIVE_Z_INDEX });
                        gsap.set(cardsLayerRef.current, { autoAlpha: 1 });
                    },
                    onLeave: () => {
                        gsap.set(section, { zIndex: SECTION_RESTING_Z_INDEX });
                        gsap.set(cardsLayerRef.current, { autoAlpha: 1 });
                    },
                    onLeaveBack: () => {
                        gsap.set(section, { zIndex: SECTION_RESTING_Z_INDEX });
                        gsap.set(cardsLayerRef.current, { autoAlpha: 1 });
                    },
                },
            });

            cards.forEach((card, i) => {
                // Card slides to center (y: 0) and slightly rotates
                tl.to(card, {
                    y: 0,
                    rotation: i % 2 === 0 ? -1.5 : 1.5,
                    duration: 1,
                    ease: "none",
                    // Stacking logic: each new card gets a higher z-index
                    onStart: () => gsap.set(card, { zIndex: 100 + i }),
                    onReverseComplete: () => gsap.set(card, { zIndex: 100 + i }),
                });

                if (i < cards.length - 1) {
                    tl.to({}, { duration: CARD_SETTLE_HOLD });
                }
            });
        }, section);

        return () => ctx.revert();
    }, [steps]);

    return (
        <div ref={cardsLayerRef} className="absolute inset-0 z-20 pointer-events-none">
            {steps.map((step, index) => (
                <HowItWorksStep
                    key={step.id}
                    ref={(el) => {
                        cardRefs.current[index] = el;
                    }}
                    step={step}
                    className="absolute left-0 right-0 top-1/2 mx-auto w-[92%] max-w-175 will-change-transform pointer-events-auto sm:w-[90%]"
                    style={{ zIndex: index + 10 }}
                />
            ))}
        </div>
    );
}
