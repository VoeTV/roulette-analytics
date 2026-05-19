import { useEffect, useRef, useState } from "react";
import { WHEEL_ORDER, POCKET_COUNT, colorOf, pocketIndex } from "../utils/roulette";

const SIZE = 360;
const RADIUS = SIZE / 2;
const POCKET_ANGLE = 360 / POCKET_COUNT;

/**
 * Animated European roulette wheel. Spins by setting a CSS rotation on the
 * inner wheel and counter-rotating the ball so it lands at the pocket of `winningNumber`.
 *
 * Props:
 *  - winningNumber: number | null (when set, animation plays)
 *  - spinning: boolean
 *  - onSpinEnd: () => void
 *  - lastNumber: number | null (number to display while idle)
 */
export default function RouletteWheel({ winningNumber, spinning, onSpinEnd, lastNumber }) {
  const [wheelDeg, setWheelDeg] = useState(0);
  const [ballDeg, setBallDeg] = useState(0);
  const [animating, setAnimating] = useState(false);
  const lastResolvedRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!spinning || winningNumber == null) return;
    if (lastResolvedRef.current === winningNumber + ":" + spinning) return;
    lastResolvedRef.current = winningNumber + ":" + spinning;

    const idx = pocketIndex(winningNumber);
    // Wheel spins clockwise multiple times, then settles so that pocket idx
    // ends up at the top (12 o'clock = 0deg).
    // We choose extra rotations to make it dramatic.
    const wheelExtraTurns = 6;
    const targetWheel = wheelDeg + wheelExtraTurns * 360 + (360 - (idx * POCKET_ANGLE));
    // Ball rotates counter-clockwise relative to viewer (negative direction)
    // and ends at the top so the pocket meets it. Since wheel handles the pocket
    // alignment to the top, ball just goes to 0deg (top) plus a slight offset
    // for visual realism.
    const ballExtraTurns = 8;
    const targetBall = ballDeg - ballExtraTurns * 360; // ends pointing at top (0)

    setAnimating(true);
    // Use rAF to apply transition starting state, then end state, so transition triggers
    requestAnimationFrame(() => {
      setWheelDeg(targetWheel);
      setBallDeg(targetBall);
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAnimating(false);
      // Normalize rotations to keep numbers small over time
      setWheelDeg((d) => ((d % 360) + 360) % 360);
      setBallDeg((d) => ((d % 360) + 360) % 360);
      onSpinEnd?.();
    }, 6200);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning, winningNumber]);

  return (
    <div className="wheel-stage">
      <div className="wheel-outer">
        <div className="wheel-rim" />
        <div
          className={"wheel-disc" + (animating ? " is-spinning" : "")}
          style={{ transform: `rotate(${wheelDeg}deg)` }}
        >
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="wheel-svg">
            {WHEEL_ORDER.map((num, i) => {
              const startAngle = i * POCKET_ANGLE - POCKET_ANGLE / 2 - 90;
              const endAngle = startAngle + POCKET_ANGLE;
              const path = sectorPath(RADIUS, RADIUS, RADIUS - 6, RADIUS - 56, startAngle, endAngle);
              const c = colorOf(num);
              const fill = c === "red" ? "#c4182a" : c === "black" ? "#0c0c0c" : "#0e7c3a";
              const labelAngle = i * POCKET_ANGLE;
              const labelR = RADIUS - 30;
              const lx = RADIUS + labelR * Math.sin((labelAngle * Math.PI) / 180);
              const ly = RADIUS - labelR * Math.cos((labelAngle * Math.PI) / 180);
              return (
                <g key={num}>
                  <path d={path} fill={fill} stroke="rgba(0,0,0,0.5)" strokeWidth="0.5" />
                  <text
                    x={lx}
                    y={ly}
                    fill="#fff"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${labelAngle} ${lx} ${ly})`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {num}
                  </text>
                </g>
              );
            })}
            {/* Inner ring + hub */}
            <circle cx={RADIUS} cy={RADIUS} r={RADIUS - 56} fill="url(#hubGrad)" stroke="#7a5a2a" strokeWidth="2" />
            <circle cx={RADIUS} cy={RADIUS} r={RADIUS - 80} fill="#1c1407" stroke="#c9a35b" strokeWidth="1" />
            <circle cx={RADIUS} cy={RADIUS} r={18} fill="#d4af37" stroke="#7a5a2a" strokeWidth="2" />
            <defs>
              <radialGradient id="hubGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#3a2a14" />
                <stop offset="60%" stopColor="#1f160a" />
                <stop offset="100%" stopColor="#0c0804" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Ball orbit ring */}
        <div
          className={"ball-orbit" + (animating ? " is-spinning" : "")}
          style={{ transform: `rotate(${ballDeg}deg)` }}
        >
          <div className="ball" />
        </div>

        {/* Pointer at top */}
        <div className="wheel-pointer" />
      </div>

      <div className="wheel-readout">
        {lastNumber != null && !animating ? (
          <div className={`readout-num readout-${colorOf(lastNumber)}`}>
            <span className="readout-label">Ostatni numer</span>
            <span className="readout-value">{lastNumber}</span>
          </div>
        ) : animating ? (
          <div className="readout-num readout-spinning">
            <span className="readout-label">Spinning…</span>
            <span className="readout-value">—</span>
          </div>
        ) : (
          <div className="readout-num readout-idle">
            <span className="readout-label">Złóż zakład</span>
            <span className="readout-value">●</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Build an SVG path for an annular sector
function sectorPath(cx, cy, rOuter, rInner, startDeg, endDeg) {
  const sx = cx + rOuter * Math.cos((startDeg * Math.PI) / 180);
  const sy = cy + rOuter * Math.sin((startDeg * Math.PI) / 180);
  const ex = cx + rOuter * Math.cos((endDeg * Math.PI) / 180);
  const ey = cy + rOuter * Math.sin((endDeg * Math.PI) / 180);
  const sxi = cx + rInner * Math.cos((endDeg * Math.PI) / 180);
  const syi = cy + rInner * Math.sin((endDeg * Math.PI) / 180);
  const exi = cx + rInner * Math.cos((startDeg * Math.PI) / 180);
  const eyi = cy + rInner * Math.sin((startDeg * Math.PI) / 180);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${sx} ${sy}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${ex} ${ey}`,
    `L ${sxi} ${syi}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${exi} ${eyi}`,
    "Z",
  ].join(" ");
}
