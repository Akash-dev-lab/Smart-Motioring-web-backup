import HeroSection from "./sections/HeroSection";
import MonitorGridSection from "./sections/MonitorGrid/MonitorGridSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import IncidentResolutionSection from "./sections/IncidentResolutionSection";
import PricingSection from "./sections/PricingSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import FooterCtaSection from "./sections/FooterCtaSection";

export default function HomePage() {
    return (
        <main className="relative w-screen max-w-full overflow-x-hidden bg-[#0A0C10]">
            <HeroSection />
            <div className="relative z-0 w-screen max-w-full">
                <MonitorGridSection />
            </div>
            <div className="relative z-120 w-screen max-w-full">
                <HowItWorksSection />
            </div>
            <div className="relative z-110 w-screen max-w-full">
                <IncidentResolutionSection />
            </div>
            <PricingSection />
            <TestimonialsSection />
            <FooterCtaSection />
        </main>
    );
}