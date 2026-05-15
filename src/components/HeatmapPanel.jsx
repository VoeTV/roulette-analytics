import { getColor } from "../utils/statistics";

const WHEEL_ORDER_EU = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
  8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
  28, 12, 35, 3, 26,
];

const GRID_NUMBERS = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
];

export default function HeatmapPanel({ stats, rouletteType }) {
  if (!stats) return null;
  const { numberCounts, total } = stats;

  const maxCount = Math.max(...Object.values(numberCounts));

  function getIntensity(n) {
    const count = numberCounts[n] || 0;
    return maxCount > 0 ? count / maxCount : 0;
  }

  function getHeatColor(n) {
    const intensity = getIntensity(n);
    const base = getColor(n);
    if (base === "green") return `rgba(34,197,94,${0.3 + intensity * 0.7})`;
    if (base === "red") return `rgba(239,68,68,${0.2 + intensity * 0.8})`;
    return `rgba(148,163,184,${0.15 + intensity * 0.85})`;
  }

  return (
    <div className="heatmap-panel">
      {/* Table heatmap */}
      <div className="glass-card section-card full-width">
        <h3 className="section-title">🗓 Heatmapa stołu ruletki</h3>
        <p className="chart-note">Intensywność koloru odpowiada częstości wystąpienia liczby. Czerwona otoczka = najgorętsze.</p>

        <div className="table-heatmap">
          {/* Zero */}
          <div className="heatmap-zero-row">
            <div
              className="heatmap-cell cell-zero"
              style={{ background: getHeatColor(0) }}
            >
              <span className="hm-num">0</span>
              <span className="hm-count">{numberCounts[0]}×</span>
            </div>
            {rouletteType === "american" && (
              <div
                className="heatmap-cell cell-zero"
                style={{ background: getHeatColor(37) }}
              >
                <span className="hm-num">00</span>
                <span className="hm-count">{numberCounts[37] || 0}×</span>
              </div>
            )}
          </div>

          {/* Main grid */}
          <div className="heatmap-grid">
            {GRID_NUMBERS.map((row, ri) => (
              <div key={ri} className="heatmap-row">
                {row.map((n) => (
                  <div
                    key={n}
                    className={`heatmap-cell ${getIntensity(n) > 0.7 ? "cell-hot" : ""}`}
                    style={{ background: getHeatColor(n) }}
                  >
                    <span className="hm-num">{n}</span>
                    <span className="hm-count">{numberCounts[n]}×</span>
                  </div>
                ))}
                <div className={`col-label col-label-${ri + 1}`}>2:1</div>
              </div>
            ))}
          </div>

          {/* Dozen labels */}
          <div className="dozen-labels">
            <div className="dozen-label">1. tuzin<br />(1–12)</div>
            <div className="dozen-label">2. tuzin<br />(13–24)</div>
            <div className="dozen-label">3. tuzin<br />(25–36)</div>
          </div>
        </div>
      </div>

      {/* Wheel visualization */}
      <div className="glass-card section-card full-width">
        <h3 className="section-title">🎡 Heatmapa koła ruletki (kolejność jak na kole)</h3>
        <p className="chart-note">Liczby ułożone zgodnie z kolejnością na kole ruletki europejskiej.</p>
        <div className="wheel-strip">
          {WHEEL_ORDER_EU.map((n, i) => (
            <div
              key={i}
              className={`wheel-cell ${getIntensity(n) > 0.65 ? "wheel-hot" : ""}`}
              style={{ background: getHeatColor(n) }}
              title={`Liczba ${n}: ${numberCounts[n]} razy`}
            >
              <span className="wheel-num">{n}</span>
              <div
                className="wheel-bar"
                style={{ height: `${Math.max(2, getIntensity(n) * 32)}px` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Deviation table */}
      <div className="glass-card section-card full-width">
        <h3 className="section-title">📉 Odchylenie od oczekiwanej częstości</h3>
        <p className="chart-note">Oczekiwana częstość per liczba: {stats.expectedPerNumber.toFixed(2)} przy {total} spinach.</p>
        <div className="deviation-table-wrap">
          <table className="deviation-table">
            <thead>
              <tr>
                <th>Liczba</th><th>Kolor</th><th>Wyniki</th><th>Oczekiwane</th><th>Odchylenie</th><th>%</th>
              </tr>
            </thead>
            <tbody>
              {stats.deviations
                .filter(d => d.number <= 36)
                .sort((a, b) => Math.abs(b.deviationPct) - Math.abs(a.deviationPct))
                .slice(0, 15)
                .map((d) => (
                  <tr key={d.number}>
                    <td><span className={`chip-sm chip-${getColor(d.number)}`}>{d.number}</span></td>
                    <td><span className={`color-badge badge-${getColor(d.number)}`}>{getColor(d.number) === "red" ? "Czerwony" : getColor(d.number) === "black" ? "Czarny" : "Zielony"}</span></td>
                    <td>{d.count}</td>
                    <td>{stats.expectedPerNumber.toFixed(1)}</td>
                    <td className={d.deviation > 0 ? "dev-pos" : "dev-neg"}>
                      {d.deviation > 0 ? "+" : ""}{d.deviation.toFixed(1)}
                    </td>
                    <td className={d.deviationPct > 0 ? "dev-pos" : "dev-neg"}>
                      {d.deviationPct > 0 ? "+" : ""}{d.deviationPct.toFixed(0)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
