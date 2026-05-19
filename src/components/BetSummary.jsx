import { labelFor } from "../utils/roulette";

export default function BetSummary({ bets, totalStake, onUndo, onClearAll, onSpin, onRebet, canSpin, canRebet }) {
  return (
    <div className="bet-summary">
      <div className="bet-summary-header">
        <span className="bet-summary-title">Aktywne zakłady</span>
        <span className="bet-summary-count">
          {bets.length} {bets.length === 1 ? "pozycja" : bets.length < 5 ? "pozycje" : "pozycji"}
        </span>
      </div>

      <div className="bet-list">
        {bets.length === 0 ? (
          <div className="bet-list-empty">Brak zakładów. Kliknij pole na stole, aby postawić.</div>
        ) : (
          bets.slice().reverse().map((b, i) => (
            <div className="bet-row" key={`${b.kind}:${b.number ?? "x"}:${i}`}>
              <span className="bet-row-label">{labelFor(b)}</span>
              <span className="bet-row-amount">$ {b.amount}</span>
            </div>
          ))
        )}
      </div>

      <div className="bet-summary-total">
        <span>Suma</span>
        <span className="bet-summary-total-value">$ {totalStake}</span>
      </div>

      <div className="bet-actions">
        <button type="button" className="btn-ghost" onClick={onUndo} disabled={bets.length === 0}>
          Cofnij
        </button>
        <button type="button" className="btn-ghost btn-ghost-danger" onClick={onClearAll} disabled={bets.length === 0}>
          Wyczyść
        </button>
        <button type="button" className="btn-ghost" onClick={onRebet} disabled={!canRebet}>
          Powtórz
        </button>
        <button type="button" className="btn-spin" onClick={onSpin} disabled={!canSpin}>
          KRĘĆ
        </button>
      </div>
    </div>
  );
}
