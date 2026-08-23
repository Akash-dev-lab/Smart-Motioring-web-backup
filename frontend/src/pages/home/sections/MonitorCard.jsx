import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

let highZIndex = 100;

// Card data with better spacing and positioning
const cardsData = [
  {
    id: 1,
    title: "UPTIME MONITORING",
    description: "Track website availability 24/7 with zero blind spots.",
    badge: "INTERNET",
    status: "99.99%",
    progress: 95,
    color: "#FFD600",
    borderColor: "border-[#FFD600]/30 hover:border-[#FFD600]/60",
    x: "2%",
    y: "2%",
    size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  },
  // {
  //   id: 2,
  //   title: "LATENCY TRACKING",
  //   description: "Measure response times and detect slowdowns instantly across global edges.",
  //   badge: "MS_TRACK",
  //   status: null,
  //   progress: 65,
  //   color: "#00E676",
  //   borderColor: "border-[#00E676]/30 hover:border-[#00E676]/60",
  //   x: "35%",
  //   y: "2%",
  //   size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  // },
  // {
  //   id: 3,
  //   title: "API MONITORING",
  //   description: "Continuously test and validate your API endpoints.",
  //   badge: "SYNC_V4",
  //   status: "200 OK",
  //   progress: 80,
  //   color: "#F5F7FA",
  //   borderColor: "border-[#F5F7FA]/30 hover:border-[#F5F7FA]/60",
  //   isSegmented: true,
  //   x: "68%",
  //   y: "2%",
  //   size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  // },
  {
    id: 4,
    title: "REAL-TIME ALERTS",
    description: "Get notified the moment something breaks.",
    badge: "PREDICTIVE",
    status: "ACTIVE",
    progress: 85,
    color: "#FF5252",
    borderColor: "border-[#FF5252]/30 hover:border-[#FF5252]/60",
    x: "2%",
    y: "38%",
    size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  },
  {
    id: 5,
    title: "AI INCIDENT SUMMARIES",
    description: "Turn errors into clear, actionable insights automatically.",
    badge: "OF THINGS",
    status: null,
    progress: 60,
    color: "#FFD600",
    borderColor: "border-[#FFD600]/30 hover:border-[#FFD600]/60",
    isGradient: true,
    x: "51%",
    y: "65%",
    size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  },
  {
    id: 6,
    title: "DASHBOARDS & LOGS",
    description: "Visualize performance and debug issues faster.",
    badge: "NET_LOGS",
    status: null,
    progress: 45,
    color: "#FF5252",
    borderColor: "border-[#FF5252]/30 hover:border-[#FF5252]/60",
    hasBars: true,
    x: "18%",
    y: "65%",
    size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  },
  // {
  //   id: 7,
  //   title: "SECURE MONITORING",
  //   description: "Keep your data safe with reliable infrastructure.",
  //   badge: "ENCRYPTED",
  //   status: null,
  //   progress: 100,
  //   color: "#F5F7FA",
  //   borderColor: "border-[#F5F7FA]/30 hover:border-[#F5F7FA]/60",
  //   hasLock: true,
  //   x: "68%",
  //   y: "38%",
  //   size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  // },
  {
    id: 8,
    title: "MULTI-LOCATION CHECKS",
    description: "Monitor from different regions for accurate status.",
    badge: "GLOBAL_NET",
    status: null,
    progress: 75,
    color: "#00E676",
    borderColor: "border-[#00E676]/30 hover:border-[#00E676]/60",
    hasDots: true,
    x: "35%",
    y: "38%",
    size: { w: "min(280px, 85vw)", h: "clamp(180px, 20vw, 220px)" }
  }
];

const MonitorCard = ({ card }) => {
  const cardRef = useRef(null);

  const cardStyle = {
    '--monitor-w': card.size?.w || 'min(280px, 85vw)',
    '--monitor-h': card.size?.h || 'clamp(180px, 20vw, 220px)',
    '--monitor-x': card.x,
    '--monitor-y': card.y,
    zIndex: 20,
  };

  useLayoutEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) return undefined;

    const ctx = gsap.context(() => {
      Draggable.create(cardRef.current, {
        bounds: "#playground",
        onPress: function() {
          highZIndex++;
          gsap.set(this.target, { zIndex: highZIndex });
        },
        onDragStart: function() { 
          gsap.to(this.target, { scale: 1.02, opacity: 0.9, cursor: 'grabbing' }); 
        },
        onDragEnd: function() { 
          gsap.to(this.target, { scale: 1, opacity: 1, cursor: 'grab' });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col rounded-lg overflow-hidden group border ${card.borderColor} bg-[#0C0E12] transition-all duration-300 sm:absolute sm:left-[var(--monitor-x)] sm:top-[var(--monitor-y)] sm:h-[var(--monitor-h)] sm:w-[var(--monitor-w)] sm:max-w-[92vw] sm:touch-none`}
      style={cardStyle}
    >
      {/* Window Bar */}
      <div className="px-3 py-2 flex items-center gap-2 bg-[#14171C] border-b border-white/[0.08] cursor-grab active:cursor-grabbing shrink-0">
        <div className="w-2 h-2 rounded-full bg-[#FF5252]/50"></div>
        <div className={`w-2 h-2 rounded-full ${card.id === 1 || card.id === 2 || card.id === 5 ? 'bg-[#FFD600]' : card.id === 3 ? 'bg-[#00E676]' : 'bg-[#FFD600]/50'}`}></div>
        <div className={`w-2 h-2 rounded-full ${card.id === 2 || card.id === 3 || card.id === 8 ? 'bg-[#00E676]' : 'bg-[#00E676]/50'}`}></div>
        <span className="ml-auto font-['JetBrains_Mono'] text-[10px] text-[#bacbb9] tracking-widest">
          {card.id === 1 ? 'SYS.UPTIME' : card.id === 2 ? 'NET.LATENCY' : card.id === 3 ? 'API.SYNC' : card.id === 4 ? 'CRIT.ALERT' : card.id === 5 ? 'AI.LOGIC' : card.id === 6 ? 'SYS.VIEWS' : card.id === 7 ? 'SEC.AUDIT' : 'GEO.PING'}
        </span>
      </div>

      {/* Card Content */}
      <div className={`p-4 flex-grow flex flex-col relative overflow-hidden ${card.id === 4 ? 'bg-[#FF5252]/5' : ''}`}>
        {/* Glow Effect */}
        <div 
          className={`absolute rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            card.id === 1 ? '-top-10 -right-10 w-32 h-32 bg-[#FFD600]/10' :
            card.id === 2 ? '-bottom-10 -right-10 w-40 h-40 bg-[#00E676]/10' :
            card.id === 3 ? '-top-10 -left-10 w-32 h-32 bg-[#F5F7FA]/5' :
            card.id === 4 ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF5252]/10 opacity-50' : ''
          }`}
        ></div>

        <h3 className={`font-['Geist'] font-semibold mb-1 uppercase tracking-wide ${card.id === 3 || card.id === 5 || card.id === 6 || card.id === 8 ? 'text-[18px] leading-tight' : 'text-[20px]'}`} style={{ color: card.color }}>
          {card.title}
        </h3>
        <p className="text-xs text-[#bacbb9] mb-4">{card.description}</p>

        {/* Bottom Section */}
        <div className="mt-auto relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span 
              className={`font-['JetBrains_Mono'] text-[10px] px-1 py-0.5 rounded border ${
                card.id === 4 ? 'bg-[#FF5252]/20 text-[#FF5252] border-[#FF5252]/40 font-bold' :
                card.id === 3 || card.id === 7 ? 'bg-white/5 text-[#F5F7FA] border-white/10' :
                `bg-[${card.color}]/10 text-[${card.color}] border-[${card.color}]/20`
              }`}
              style={card.id !== 4 && card.id !== 3 && card.id !== 7 ? { backgroundColor: `${card.color}1A`, color: card.color, borderColor: `${card.color}33` } : {}}
            >
              {card.badge}
            </span>
            
            {/* Status/Icons */}
            {card.status && <span className={`font-['JetBrains_Mono'] text-[10px] ${card.id === 4 ? 'text-[#FF5252] animate-pulse' : 'text-[#bacbb9]'}`}>{card.status}</span>}
            {card.id === 2 && <div className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></div>}
            {card.id === 5 && (
              <svg className="w-3.5 h-3.5 text-[#FFD600]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {card.hasBars && (
              <div className="flex gap-[2px]">
                <div className="w-1 h-3 bg-[#FF5252]/40"></div>
                <div className="w-1 h-3 bg-[#FF5252]/60"></div>
                <div className="w-1 h-3 bg-[#FF5252]"></div>
              </div>
            )}
            {card.hasLock && (
              <svg className="w-3.5 h-3.5 text-[#F5F7FA]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
            {card.hasDots && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] opacity-50"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] opacity-25"></span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="bg-[#1a1c1f] border border-white/10 h-2 w-full rounded-full overflow-hidden relative">
            {card.isSegmented ? (
              <>
                <div className="flex gap-[1px] h-full">
                  <div className="h-full bg-[#F5F7FA] w-[20%]"></div>
                  <div className="h-full bg-[#F5F7FA] w-[20%]"></div>
                  <div className="h-full bg-[#F5F7FA] w-[20%]"></div>
                  <div className="h-full bg-[#F5F7FA] w-[20%]"></div>
                  <div className="h-full bg-[#333538] w-[20%]"></div>
                </div>
                <div className="absolute h-full w-[30%] bg-gradient-to-r from-transparent via-gray-400/40 to-transparent animate-[scan_2s_linear_infinite]"></div>
              </>
            ) : card.id === 2 ? (
              <>
                <div className="flex h-full">
                  <div className="h-full bg-[#00E676] w-[30%] border-r border-[#111317]"></div>
                  <div className="h-full bg-[#00E676] w-[20%] border-r border-[#111317] opacity-80"></div>
                  <div className="h-full bg-[#00E676] w-[15%] border-r border-[#111317] opacity-60"></div>
                </div>
                <div className="absolute h-full w-[30%] bg-gradient-to-r from-transparent via-gray-400/50 to-transparent animate-[scan_2s_linear_infinite]"></div>
              </>
            ) : card.isGradient ? (
              <>
                <div className={`h-full bg-gradient-to-r from-[#FFD600]/50 to-[#FFD600] relative`} style={{ width: `${card.progress}%` }}>
                  <div className="absolute h-full w-[30%] bg-gradient-to-r from-transparent via-gray-400/50 to-transparent animate-[scan_2s_linear_infinite]"></div>
                </div>
              </>
            ) : (
              <>
                <div className={`h-full relative ${card.id === 7 ? 'opacity-20' : ''}`} style={{ backgroundColor: card.color, width: `${card.progress}%` }}>
                  {card.id === 1 && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                  {card.id === 4 && <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50 animate-[pulse_1s_infinite]"></div>}
                  {card.id === 8 && <div className="absolute right-0 top-0 h-full w-2 bg-white/50"></div>}
                  <div className={`absolute h-full w-[30%] bg-gradient-to-r from-transparent ${card.id === 7 ? 'via-gray-400/40' : 'via-gray-400/50'} to-transparent animate-[scan_2s_linear_infinite]`}></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MonitorCards = () => {
  return (
    <>
      {cardsData.map((card) => (
        <MonitorCard key={card.id} card={card} />
      ))}
    </>
  );
};

export default MonitorCards;
