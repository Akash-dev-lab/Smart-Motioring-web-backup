import { useEffect, useRef } from 'react';

/**
 * useSmoothScroll - Initialize Locomotive Scroll v5 for smooth scrolling
 * Respects prefers-reduced-motion for accessibility
 * @param {Object} options - Configuration options for Locomotive Scroll
 * @returns {Object} - { scrollRef, locomotiveScroll }
 */
export const useSmoothScroll = (options = {}) => {
  const scrollRef = useRef(null);
  const locomotiveScrollRef = useRef(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      console.log('Smooth scrolling disabled due to prefers-reduced-motion');
      return;
    }

    // Ensure we're on the client and the ref is available
    if (!scrollRef.current) return;

    // Dynamic import for Locomotive Scroll
    const initScroll = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;

        // Destroy existing instance if any
        if (locomotiveScrollRef.current) {
          locomotiveScrollRef.current.destroy();
        }

        // Small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // Create new instance with v5 configuration  
        locomotiveScrollRef.current = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          lerp: 0.08, // Smoothness: 0.08 = balanced, responsive feel
          multiplier: 1.0, // Scroll speed multiplier
          smartphone: {
            smooth: false, // Native scrolling on mobile
          },
          tablet: {
            smooth: true,
            lerp: 0.1, // Slightly faster on tablet
          },
          ...options,
        });

        // Expose globally for other components to access
        window.locomotive = locomotiveScrollRef.current;

        // Handle resize
        const handleResize = () => {
          if (locomotiveScrollRef.current) {
            locomotiveScrollRef.current.update();
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
      }
    };

    initScroll();

    // Cleanup
    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
        locomotiveScrollRef.current = null;
        window.locomotive = null;
      }
    };
  }, []); // Empty dependency array - initialize once

  return {
    scrollRef,
    locomotiveScroll: locomotiveScrollRef.current,
  };
};
