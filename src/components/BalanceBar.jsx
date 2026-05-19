function fmt(v) {
  return v.toLocaleString("pl-PL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function BalanceBar({ balance, totalStake, lastNet, onTopUp, onReset }) {
  const isWin = lastNet > 0;
  const isLoss = lastNet < 0;
  return (
    <header className="balance-bar">
      <div className="brand">
        <div className="brand-mark">◉</div>
        <div className="brand-text">
          <span className="brand-title">ROYAL ROULETTE</span>
          <span className="brand-sub">European • Single Zero</span>
        </div>
      </div>

      <div className="bb-stats">
        <div className="bb-stat">
          <span className="bb-stat-label">Saldo</span>
          <span className="bb-stat-value bb-balance">$ {fmt(balance)}</span>
        </div>
        <div className="bb-stat">
          <span className="bb-stat-label">Zakład</span>
          <span className="bb-stat-value">$ {fmt(totalStake)}</span>
        </div>
        <div className="bb-stat">
          <span className="bb-stat-label">Ostatni wynik</span>
          <span
            className={
              "bb-stat-value " +
              (isWin ? "bb-positive" : isLoss ? "bb-negative" : "bb-neutral")
            }
          >
            {lastNet === null || lastNet === undefined ? "—" : (lastNet > 0 ? "+" : "") + "$ " + fmt(lastNet)}
          </span>
        </div>
      </div>

      <div className="bb-actions">
        <button className="btn-ghost" onClick={onTopUp} type="button">+ $1000</button>
        <button className="btn-ghost btn-ghost-danger" onClick={onReset} type="button">Reset</button>
      </div>
    </header>
  );
}
