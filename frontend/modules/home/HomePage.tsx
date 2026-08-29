import HeroSection from "./sections/HeroSection";
import MonitorGridSection from "./sections/MonitorGrid/MonitorGridSection";
// import HowItWorksSection from "./sections/HowItWorksSection";
// import IncidentResolutionSection from "./sections/IncidentResolutionSection";
// import PricingSection from "./sections/PricingSection";
// import TestimonialsSection from "./sections/TestimonialsSection";
// import FooterCtaSection from "./sections/FooterCtaSection";

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <MonitorGridSection />
            {/* <HowItWorksSection />
            <IncidentResolutionSection />
            <PricingSection />
            <TestimonialsSection />
            <FooterCtaSection />  */}
        </main>
    );
}