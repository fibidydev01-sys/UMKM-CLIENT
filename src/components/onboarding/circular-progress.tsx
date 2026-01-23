"use client";

// ============================================
// CIRCULAR PROGRESS INDICATOR
// ============================================

interface CircularProgressProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  completed,
  total,
  size = 14,
  strokeWidth = 2,
}: CircularProgressProps) {
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const strokeDashoffset = 100 - progress;
  const radius = (size - strokeWidth) / 2;

  return (
    <svg
      className="-rotate-90 scale-y-[-1]"
      height={size}
      width={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        className="stroke-muted"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
        pathLength="100"
      />
      <circle
        className="stroke-primary transition-all duration-300"
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        strokeWidth={strokeWidth}
        pathLength="100"
        strokeDasharray="100"
        strokeLinecap="round"
        style={{ strokeDashoffset }}
      />
    </svg>
  );
}
