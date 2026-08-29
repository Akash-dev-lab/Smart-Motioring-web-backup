"use client";

/**
 * PricingCards
 *
 * Requires "use client" because it drives a GSAP ScrollTrigger scroll-scrub
 * entrance animation on the pricing card elements via useRef + useEffect.
 * Everything else in PricingSection (layout, data, background) is server-rendered.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PricingPlan } from "@/modules/home/data/content";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface PricingCardsProps {
    plans: PricingPlan[];
}

export default function PricingCards({ plans }: PricingCardsProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const cards = cardRefs.current.filter(
            (el): el is HTMLElement => el !== null
        );
        if (!cards.length) return;

        const ctx = gsap.context(() => {
            gsap.set(cards, { autoAlpha: 0, y: 32 });

            gsap.to(cards, {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 74%",
                    end: "center 45%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            ScrollTrigger.refresh();
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative z-10 mx-auto grid max-w-6xl gap-4 md:grid-cols-3"
        >
            {plans.map((plan, index) => (
                <article
                    key={plan.name}
                    ref={(el) => { cardRefs.current[index] = el; }}
                    className={`relative flex min-h-[360px] flex-col overflow-hidden border border-white rounded-lg ${plan.tint} p-4 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1),0_0_28px_rgba(0,230,118,0.08)] sm:p-5`}
                >
                    {/* Yellow accent top bar */}
                    <div className={`absolute inset-x-0 top-0 h-1.5 ${plan.accent}`} />

                    {/* Header — plan name + note */}
                    <div className="border-b-[3px] border-white pb-4 pt-2">
                        <h3 className="font-black uppercase italic leading-none text-2xl sm:text-3xl">
                            {plan.name}
                        </h3>
                        <p className="mt-3 max-w-[24rem] font-bold uppercase leading-snug text-xs text-white/70">
                            {plan.note}
                        </p>
                    </div>

                    {/* Price block */}
                    <div className="py-7">
                        <div className="font-black uppercase italic leading-none tracking-normal text-green-400 text-[clamp(3.9rem,11vw,6.3rem)]">
                            {plan.price}
                        </div>
                        <div className="mt-2 font-black uppercase tracking-[0.12em] text-[10px] text-white/55 sm:text-xs">
                            {plan.cadence}
                        </div>
                    </div>

                    {/* Feature list */}
                    <ul className="mt-auto grid gap-2 border-t-[3px] border-white pt-4">
                        {plan.includes.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-2 font-black uppercase leading-tight text-xs"
                            >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E676]" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button
                        type="button"
                        className="mt-5 border-[3px] border-white bg-white cursor-pointer px-3 py-3 text-left font-black uppercase italic tracking-[0.12em] text-black transition-colors hover:bg-green-400"
                    >
                        Select plan
                    </button>
                </article>
            ))}
        </div>
    );
}
