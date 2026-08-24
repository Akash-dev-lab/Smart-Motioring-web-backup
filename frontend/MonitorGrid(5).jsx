import { useEffect, useRef } from "react";
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

    if (!section || !bot) return;

    const handleMouseMove = (e) => {
      const sectionRect = section.getBoundingClientRect();

      // Calculate mouse position relative to section center
      const mouseX = e.clientX - sectionRect.left;
      const mouseY = e.clientY - sectionRect.top;
      const centerX = sectionRect.width / 2;
      const centerY = sectionRect.height / 2;

      // Calculate offset (magnetic effect with dampening)
      const xOffset = (mouseX - centerX) / 50;
      const yOffset = (mouseY - centerY) / 50;

      // Apply smooth transform without changing the bot's size/position
      bot.style.transition = 'transform 0.1s ease-out';
      bot.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
    };

    const handleMouseLeave = () => {
      bot.style.transition = 'transform 0.3s ease-out';
      bot.style.transform = 'translate(-50%, -50%)';
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
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
      <div className="absolute left-[50%] -translate-x-1/2 z-[200] w-max max-w-[92vw]">
        <div className="bg-none border border-green-400 px-4 sm:px-6 md:px-10 py-1.5 sm:py-2 md:py-2.5 rounded-xl flex items-center gap-3 sm:gap-4 md:gap-6">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="green"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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
      <div className="absolute top-[35%] md:top-[40%] right-[3%] md:right-[5%] z-10 w-20 h-14 md:w-24 md:h-16 pointer-events-none hidden sm:block">
        <div className="absolute -top-3 left-0 w-8 h-3 md:w-10 md:h-4 bg-black border-[2px] border-black rounded-t-sm"></div>
        <div className="absolute inset-0 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
           <span className="font-black italic text-[7px] md:text-[8px] uppercase tracking-tighter opacity-40">DATA_FS</span>
        </div>
      </div>

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
      <div className="absolute bottom-[18%] left-[5%] md:left-[10%] z-10 w-16 h-10 md:w-20 md:h-12 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 hidden sm:block">
        <div className="w-8 md:w-10 h-1.5 md:h-2 bg-black mb-2"></div>
        <div className="w-4 md:w-6 h-1 bg-black opacity-20"></div>
      </div>

      {/* 7. CURSOR ICON - Anchored bottom right */}
      <div className="absolute bottom-[5%] sm:bottom-[8%] right-[4%] md:right-[8%] z-50 rotate-[-15deg] scale-75 md:scale-100">
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
      </div>

      {/* Interactive Canvas Area with Bot and Telemetry Clouds */}
      <div 
        ref={playgroundRef}
        id="playground" 
        className="relative w-full max-w-6xl h-[600px] mx-auto mt-24 z-20"
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
          className="telemetry-cloud absolute top-[10%] left-[15%] w-64 animate-float"
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
          className="telemetry-cloud absolute top-[25%] right-[10%] w-72 animate-float"
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
          className="telemetry-cloud absolute bottom-[15%] left-[10%] w-72 animate-float"
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
          className="telemetry-cloud absolute bottom-[25%] right-[15%] w-64 animate-float"
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
          className="telemetry-cloud absolute top-[40%] left-[2%] w-72 animate-float hidden md:block"
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
          className="telemetry-cloud absolute bottom-[5%] right-[30%] w-64 animate-float hidden md:block"
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
