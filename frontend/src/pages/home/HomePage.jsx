import { useSmoothScroll } from '../../hooks';
import {
  HeroSection,
  FooterCtaSection,
  HowItWorksSection,
  IncidentResolutionSection,
  MonitorGrid,
  PricingSection,
  TestimonialsSection,
} from './sections';

const HomePage = () => {
  const { scrollRef } = useSmoothScroll();

  return (
    <div ref={scrollRef} data-scroll-container>
      <main className="relative w-screen max-w-full overflow-x-hidden bg-[#0A0C10]">
        <div data-scroll-section><HeroSection /></div>
        <div className="relative z-0 w-screen max-w-full" data-scroll-section>
          <MonitorGrid />
        </div>
        <div className="relative z-120 w-screen max-w-full" data-scroll-section>
          <HowItWorksSection />
        </div>
        <div data-scroll-section>
          <IncidentResolutionSection className="relative z-70 w-screen max-w-full" />
        </div>
        <div data-scroll-section><TestimonialsSection /></div>
        <div data-scroll-section><PricingSection /></div>
        <div data-scroll-section><FooterCtaSection /></div>
      </main>
    </div>
  );
};

export default HomePage;
