'use client';

// ══════════════════════════════════════════════════════════════
// LOGOS SECTION — V13.0 Raycast Standard
// Marquee strip dengan border top/bottom, CSS vars only
// ══════════════════════════════════════════════════════════════

export function LogosSection() {
  const text = 'Jualan Apapun';
  const separator = '·';

  return (
    <section className="py-0 border-y border-border/60 bg-muted/20 overflow-hidden">
      <style>{`
        @keyframes marquee-slow {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-slow {
          animation: marquee-slow 200s linear infinite;
          will-change: transform;
        }
        .marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex whitespace-nowrap py-5">
        <div className="marquee-slow flex shrink-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`a-${i}`}
              className="text-2xl md:text-3xl font-black tracking-tight text-foreground/50 mx-8 select-none uppercase"
            >
              {text}
              <span className="text-primary/80 ml-8">{separator}</span>
            </span>
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={`b-${i}`}
              className="text-2xl md:text-3xl font-black tracking-tight text-foreground/50 mx-8 select-none uppercase"
            >
              {text}
              <span className="text-primary/80 ml-8">{separator}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}