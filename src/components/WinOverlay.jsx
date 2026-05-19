import { useEffect, useState } from "react";

/**
 * Brief overlay that pops up after a spin to show win/loss.
 * Auto-dismisses after a short delay.
 */
export default function WinOverlay({ result, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!result) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 250);
    }, 2400);
    return () => clearTimeout(t);
  }, [result, onClose]);

  if (!result) return null;

  const isWin = result.net > 0;
  const isPush = result.net === 0 && result.totalStake === 0;

  return (
    <div className={`win-overlay${visible ? " is-visible" : ""}`}>
      <div className={`win-card ${isWin ? "win" : isPush ? "push" : "lose"}`}>
        <div className="win-num">
          <span className={`hnum hnum-lg hnum-${result.color}`}>{result.number}</span>
        </div>
        <div className="win-text">
          {isPush ? (
            <>
              <span className="win-label">Wynik</span>
              <span className="win-amount">{result.number}</span>
            </>
          ) : isWin ? (
            <>
              <span className="win-label">WYGRYWASZ</span>
              <span className="win-amount">+ $ {result.net.toLocaleString("pl-PL")}</span>
            </>
          ) : (
            <>
              <span className="win-label">Niestety…</span>
              <span className="win-amount">- $ {Math.abs(result.net).toLocaleString("pl-PL")}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
