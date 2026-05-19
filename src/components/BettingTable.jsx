import { TABLE_ROWS, BET_KINDS, colorOf, betKey } from "../utils/roulette";
import { chipStyle, formatChip } from "./Chip";

/**
 * Casino-style betting felt. Click any cell to place the currently selected chip.
 * Right-click on a cell removes the last chip from that spot.
 *
 * Props:
 *  - bets: array of placed bets [{ kind, number, amount }]
 *  - onPlace: (kind, number?) => void
 *  - onClear: (kind, number?) => void
 *  - winningNumber: number | null  (highlights winning cells after spin)
 *  - locked: boolean (disable clicks while spinning)
 */
export default function BettingTable({ bets, onPlace, onClear, winningNumber, locked }) {
  const totalsByKey = computeTotals(bets);

  const numberCell = (n) => {
    const c = colorOf(n);
    const key = betKey(BET_KINDS.STRAIGHT, n);
    const total = totalsByKey[key] || 0;
    const isWin = winningNumber === n;
    return (
      <Cell
        key={n}
        className={`tcell num-${c}${isWin ? " cell-win" : ""}`}
        onClick={() => onPlace(BET_KINDS.STRAIGHT, n)}
        onContextMenu={(e) => { e.preventDefault(); onClear(BET_KINDS.STRAIGHT, n); }}
        locked={locked}
      >
        <span className="tcell-text">{n}</span>
        {total > 0 && <BetChip amount={total} />}
      </Cell>
    );
  };

  const outsideCell = (kind, label, isWin = false) => {
    const key = betKey(kind);
    const total = totalsByKey[key] || 0;
    return (
      <Cell
        className={`tcell tcell-outside${isWin ? " cell-win" : ""}`}
        onClick={() => onPlace(kind)}
        onContextMenu={(e) => { e.preventDefault(); onClear(kind); }}
        locked={locked}
      >
        <span className="tcell-text">{label}</span>
        {total > 0 && <BetChip amount={total} />}
      </Cell>
    );
  };

  // Determine which outside cells should glow as winners
  const wn = winningNumber;
  const winRedBlack   = wn != null && wn !== 0 ? colorOf(wn) : null;
  const winEvenOdd    = wn != null && wn !== 0 ? (wn % 2 === 0 ? "even" : "odd") : null;
  const winLowHigh    = wn != null && wn !== 0 ? (wn <= 18 ? "low" : "high") : null;
  const winDozen      = wn != null && wn !== 0 ? (wn <= 12 ? 1 : wn <= 24 ? 2 : 3) : null;
  const winColumn     = wn != null && wn !== 0 ? (wn % 3 === 0 ? 3 : (wn % 3)) : null; // 1,2,3

  return (
    <div className="betting-table-wrap">
      <div className="betting-table">
        {/* Zero column */}
        <div className="zero-cell-wrap">
          <Cell
            className={`tcell tcell-zero num-green${wn === 0 ? " cell-win" : ""}`}
            onClick={() => onPlace(BET_KINDS.STRAIGHT, 0)}
            onContextMenu={(e) => { e.preventDefault(); onClear(BET_KINDS.STRAIGHT, 0); }}
            locked={locked}
          >
            <span className="tcell-text">0</span>
            {(totalsByKey[betKey(BET_KINDS.STRAIGHT, 0)] || 0) > 0 && (
              <BetChip amount={totalsByKey[betKey(BET_KINDS.STRAIGHT, 0)]} />
            )}
          </Cell>
        </div>

        {/* Main number grid */}
        <div className="number-grid">
          {TABLE_ROWS.map((row, ri) => (
            <div key={ri} className="number-row">
              {row.map((n) => numberCell(n))}
              {/* Column 2:1 button at end of each row */}
              {ri === 0 && outsideCell(BET_KINDS.COL3, "2:1", winColumn === 3)}
              {ri === 1 && outsideCell(BET_KINDS.COL2, "2:1", winColumn === 2)}
              {ri === 2 && outsideCell(BET_KINDS.COL1, "2:1", winColumn === 1)}
            </div>
          ))}

          {/* Dozens row */}
          <div className="number-row dozens-row">
            {outsideCell(BET_KINDS.DOZEN1, "1. tuzin (1–12)", winDozen === 1)}
            {outsideCell(BET_KINDS.DOZEN2, "2. tuzin (13–24)", winDozen === 2)}
            {outsideCell(BET_KINDS.DOZEN3, "3. tuzin (25–36)", winDozen === 3)}
          </div>

          {/* Outside row */}
          <div className="number-row outside-row">
            {outsideCell(BET_KINDS.LOW, "1–18", winLowHigh === "low")}
            {outsideCell(BET_KINDS.EVEN, "PAR", winEvenOdd === "even")}
            <Cell
              className={`tcell tcell-color tcell-red${winRedBlack === "red" ? " cell-win" : ""}`}
              onClick={() => onPlace(BET_KINDS.RED)}
              onContextMenu={(e) => { e.preventDefault(); onClear(BET_KINDS.RED); }}
              locked={locked}
            >
              <span className="rhombus rhombus-red" />
              {(totalsByKey[betKey(BET_KINDS.RED)] || 0) > 0 && (
                <BetChip amount={totalsByKey[betKey(BET_KINDS.RED)]} />
              )}
            </Cell>
            <Cell
              className={`tcell tcell-color tcell-black${winRedBlack === "black" ? " cell-win" : ""}`}
              onClick={() => onPlace(BET_KINDS.BLACK)}
              onContextMenu={(e) => { e.preventDefault(); onClear(BET_KINDS.BLACK); }}
              locked={locked}
            >
              <span className="rhombus rhombus-black" />
              {(totalsByKey[betKey(BET_KINDS.BLACK)] || 0) > 0 && (
                <BetChip amount={totalsByKey[betKey(BET_KINDS.BLACK)]} />
              )}
            </Cell>
            {outsideCell(BET_KINDS.ODD, "NIEPAR", winEvenOdd === "odd")}
            {outsideCell(BET_KINDS.HIGH, "19–36", winLowHigh === "high")}
          </div>
        </div>
      </div>

      <p className="table-hint">
        Klik = postaw żeton. Prawy klik = usuń żeton z pola.
      </p>
    </div>
  );
}

function Cell({ className, onClick, onContextMenu, children, locked }) {
  return (
    <button
      type="button"
      className={className}
      onClick={locked ? undefined : onClick}
      onContextMenu={onContextMenu}
      disabled={locked}
    >
      {children}
    </button>
  );
}

function BetChip({ amount }) {
  const s = chipStyle(amount);
  return (
    <span
      className="bet-chip"
      style={{ background: s.bg, color: s.text, boxShadow: `inset 0 0 0 2px ${s.stripe}` }}
    >
      {formatChip(amount)}
    </span>
  );
}

function computeTotals(bets) {
  const totals = {};
  for (const b of bets) {
    const k = betKey(b.kind, b.number);
    totals[k] = (totals[k] || 0) + b.amount;
  }
  return totals;
}
