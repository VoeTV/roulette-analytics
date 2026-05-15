export default function Header({ rouletteType, setRouletteType, spinCount }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-icon">◉</span>
          <div>
            <h1 className="logo-title">RouletteScope</h1>
            <p className="logo-sub">Analityka historyczna · Tylko dane, zero obietnic</p>
          </div>
        </div>
      </div>
      <div className="header-right">
        <div className="spin-counter">
          <span className="spin-count-value">{spinCount}</span>
          <span className="spin-count-label">spinów</span>
        </div>
        <div className="type-switcher">
          <button
            className={`type-btn ${rouletteType === "european" ? "active" : ""}`}
            onClick={() => setRouletteType("european")}
          >
            🇪🇺 Europejska
          </button>
          <button
            className={`type-btn ${rouletteType === "american" ? "active" : ""}`}
            onClick={() => setRouletteType("american")}
          >
            🇺🇸 Amerykańska
          </button>
        </div>
      </div>
    </header>
  );
}
