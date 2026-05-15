import { getColor } from "../utils/statistics";

export default function InputPanel({
  inputValue, setInputValue, onAdd, onKeyDown, onClear, onLoadMock, results, rouletteType,
}) {
  const last10 = results.slice(-12).reverse();
  const maxNum = rouletteType === "american" ? 38 : 37;

  return (
    <div className="input-panel glass-card">
      <div className="input-panel-top">
        <div className="input-group">
          <label className="input-label">Dodaj wyniki spinów</label>
          <p className="input-hint">
            Wpisz liczby od 0 do {maxNum === 38 ? "36 lub 00 (wpisz 37)" : "36"}, oddzielone spacją lub przecinkiem
          </p>
          <div className="input-row">
            <input
              className="number-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`np. 7 15 0 32 ${rouletteType === "american" ? "37" : "23"} 4`}
            />
            <button className="btn-primary" onClick={onAdd}>
              + Dodaj
            </button>
          </div>
        </div>
        <div className="input-actions">
          <button className="btn-ghost" onClick={onLoadMock}>
            📊 Przykładowe dane
          </button>
          <button className="btn-danger" onClick={onClear}>
            🗑 Wyczyść
          </button>
        </div>
      </div>

      {last10.length > 0 && (
        <div className="last-results">
          <span className="last-results-label">Ostatnie spiny:</span>
          <div className="results-chips">
            {last10.map((n, i) => (
              <div
                key={i}
                className={`result-chip chip-${getColor(n)}`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {n === 37 ? "00" : n}
              </div>
            ))}
            {results.length > 12 && (
              <span className="more-indicator">+{results.length - 12} więcej</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
