import Link from "next/link"

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-gradient-to-b from-[#a4b8d7] via-[#f3c6d6] to-[#d8a8b8] font-mono text-[#1a1a1a] selection:bg-black selection:text-[#ffb2b2]">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
          display: flex;
          white-space: nowrap;
          width: 200%;
        }

        .glitch-wrapper {
          position: relative;
          z-index: 0;
        }

        .glitch {
          position: relative;
          color: #ffffff;
          mix-blend-mode: overlay;
          font-weight: 900;
          font-size: 16rem;
          letter-spacing: -0.05em;
          line-height: 0.8;
          text-shadow: 0px 10px 30px rgba(0,0,0,0.1);
        }

        @media (max-width: 640px) {
          .glitch {
            font-size: 8rem;
          }
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }

        .glitch::before {
          left: 4px;
          text-shadow: -2px 0 rgba(255, 0, 0, 0.7);
          animation: glitch-anim 3s infinite linear alternate-reverse;
        }

        .glitch::after {
          left: -4px;
          text-shadow: -2px 0 rgba(0, 0, 255, 0.7);
          animation: glitch-anim2 2.5s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(40% 0 50% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, -2px); }
          80% { clip-path: inset(10% 0 70% 0); transform: translate(2px, -2px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 2px); }
        }

        @keyframes glitch-anim2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -2px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
          40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, -2px); }
          60% { clip-path: inset(70% 0 10% 0); transform: translate(-2px, 2px); }
          80% { clip-path: inset(20% 0 50% 0); transform: translate(2px, -2px); }
          100% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, 2px); }
        }
      `}</style>

      {/* Glitch 404 Background Component */}
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center opacity-80">
        <div className="glitch-wrapper">
          <h1 className="glitch font-heading" data-text="404">
            404
          </h1>
        </div>
        <p className="mt-2 font-mono text-xs font-bold tracking-[0.3em] text-[#1a1a1a]/50 sm:text-sm">
          SYSTEM_FAULT_DETECTED
        </p>
      </div>

      {/* Grid Dots Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* The Peach Colored Frame/Border overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between border-[12px] border-[#1a1a1a] p-2 sm:border-[20px] sm:p-3">
        {/* Top Peach Border */}
        <div className="flex h-6 w-full items-center justify-between rounded-b-lg border-r-[3px] border-b-[3px] border-l-[3px] border-[#1a1a1a] bg-[#ffaeb1] px-4 sm:h-8">
          <div className="h-1 w-6 rounded-full bg-[#1a1a1a] opacity-30 sm:w-8" />
          <div className="h-1 w-6 rounded-full bg-[#1a1a1a] opacity-30 sm:w-8" />
        </div>

        {/* Bottom Peach Border */}
        <div className="flex h-8 w-full items-end justify-center rounded-t-lg border-t-[3px] border-r-[3px] border-l-[3px] border-[#1a1a1a] bg-[#ffaeb1] pb-1.5 sm:h-10 sm:pb-2">
          <span className="text-[10px] font-bold tracking-widest">
            X.1397 // Y.0155
          </span>
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-30 flex h-full flex-col justify-between p-8 pt-14 sm:p-12">
        {/* Top Header */}
        <header className="flex justify-center">
          <p className="font-mono text-[10px] font-bold tracking-widest text-[#1a1a1a] sm:text-xs">
            ERROR // 404 // PAGE
          </p>
        </header>

        {/* Center Content */}
        <div className="pointer-events-none flex h-full flex-col justify-end pb-20 sm:pb-32">
          <div className="flex flex-col justify-between gap-8 font-mono text-[10px] font-bold tracking-widest text-[#1a1a1a] uppercase sm:flex-row sm:text-xs">
            <div className="max-w-[200px] space-y-1">
              <p>+++</p>
              <p>IT SEEMS YOU&apos;VE WANDERED OFF</p>
              <p>THE BEATEN PATH</p>
              <p className="mt-6 text-right">BUT FEAR NOT!</p>
            </div>

            <div className="flex max-w-[200px] flex-col items-end space-y-1 text-right sm:items-start sm:text-left">
              <p className="sm:text-right">+++</p>
              <p>YOU CAN STAY HERE AND ENJOY</p>
              <p>THE VIEW WHILE FIGHTING WITH BORROW CHECKER</p>
            </div>
          </div>

          <div className="pointer-events-auto mt-8 flex justify-center">
            <Link
              href="/"
              className="group flex overflow-hidden rounded-full border-2 border-[#1a1a1a] bg-[#1a1a1a] font-mono shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center px-6 py-3 text-xs font-bold tracking-widest text-white uppercase sm:px-8 sm:py-3.5 sm:text-sm">
                GO TO HOME
              </span>
              <span className="flex items-center bg-[#fbff00] px-4 py-3 text-xs font-bold text-[#1a1a1a] transition-colors group-hover:bg-white sm:px-5 sm:py-3.5 sm:text-sm">
                &gt;&gt;&gt;
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Scrolling Marquee */}
      <div className="pointer-events-none absolute right-0 -bottom-6 left-0 z-20 h-[120px] overflow-hidden sm:-bottom-12 sm:h-[200px]">
        <div className="animate-marquee flex h-full items-end">
          <h1 className="font-heading text-[7rem] leading-none font-black tracking-tighter text-[#1a1a1a] sm:text-[14rem]">
            NOT FOUND_PAGE NOT FOUND_PAGE&nbsp;
          </h1>
          <h1 className="font-heading text-[7rem] leading-none font-black tracking-tighter text-[#1a1a1a] sm:text-[14rem]">
            NOT FOUND_PAGE NOT FOUND_PAGE&nbsp;
          </h1>
        </div>
      </div>
    </div>
  )
}
