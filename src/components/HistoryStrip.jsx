import { colorOf } from "../utils/roulette";

export default function HistoryStrip({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="history-strip empty">
        <span className="history-label">Historia</span>
        <span className="history-empty">— żadnych spinów —</span>
      </div>
    );
  }
  return (
    <div className="history-strip">
      <span className="history-label">Historia</span>
      <div className="history-numbers">
        {history.slice(0, 24).map((entry, i) => (
          <span
            key={i}
            className={`hnum hnum-${colorOf(entry.number)}`}
            title={`Spin: ${entry.number} · ${entry.net >= 0 ? "+" : ""}${entry.net}$`}
          >
            {entry.number}
          </span>
        ))}
      </div>
    </div>
  );
}
