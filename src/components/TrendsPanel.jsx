import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, ReferenceLine,
} from "recharts";
import { getColor, getDozen, getHalf } from "../utils/statistics";

export default function TrendsPanel({ results, stats }) {
  if (!results || results.length < 2) return null;

  // Rolling averages every 10 spins
  const windowSize = Math.max(5, Math.floor(results.length / 20));
  const rollingData = [];

  for (let i = windowSize; i <= results.length; i += Math.max(1, Math.floor(windowSize / 2))) {
    const slice = results.slice(i - windowSize, i);
    const redCount = slice.filter(n => getColor(n) === "red").length;
    const lowCount = slice.filter(n => getHalf(n) === "low").length;
    const d1Count = slice.filter(n => getDozen(n) === 1).length;
    const d2Count = slice.filter(n => getDozen(n) === 2).length;
    const d3Count = slice.filter(n => getDozen(n) === 3).length;
    const nonZero = slice.filter(n => getColor(n) !== "green").length;
    rollingData.push({
      spin: i,
      redPct: nonZero > 0 ? Math.round((redCount / nonZero) * 100) : 0,
      lowPct: nonZero > 0 ? Math.round((lowCount / nonZero) * 100) : 0,
      d1Pct: nonZero > 0 ? Math.round((d1Count / nonZero) * 100) : 0,
      d2Pct: nonZero > 0 ? Math.round((d2Count / nonZero) * 100) : 0,
      d3Pct: nonZero > 0 ? Math.round((d3Count / nonZero) * 100) : 0,
    });
  }

  // Cumulative zero appearances
  let cumulZero = 0;
  const zeroData = results.map((n, i) => {
    if (getColor(n) === "green") cumulZero++;
    return { spin: i + 1, zeros: cumulZero, expected: ((i + 1) / (stats.rouletteType === "european" ? 37 : 38)) };
  }).filter((_, i) => i % Math.max(1, Math.floor(results.length / 50)) === 0);

  const tooltipStyle = {
    contentStyle: { background: "#0f172a", border: "1px solid #334155", borderRadius: 8 },
    labelStyle: { color: "#e2e8f0" },
    itemStyle: { color: "#94a3b8" },
  };

  return (
    <div className="trends-panel">
      <div className="glass-card section-card full-width">
        <h3 className="section-title">📊 Trend kolor czerwony vs oczekiwanie (krocząco, okno={windowSize})</h3>
        <p className="chart-note">Linia referencyjna 48,6% = oczekiwana częstość czerwonych. Odchylenia są normalnym zjawiskiem losowym.</p>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={rollingData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="spin" tick={{ fill: "#64748b", fontSize: 11 }} label={{ value: "Spin #", position: "insideBottomRight", fill: "#64748b", fontSize: 11 }} />
              <YAxis domain={[20, 80]} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={v => `${v}%`} />
              <ReferenceLine y={48.6} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "48.6% oczek.", fill: "#22c55e", fontSize: 10 }} />
              <Line type="monotone" dataKey="redPct" stroke="#ef4444" strokeWidth={2} dot={false} name="Czerwone %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card section-card full-width">
        <h3 className="section-title">📐 Trend tuzinów (krocząco)</h3>
        <p className="chart-note">Oczekiwana proporcja każdego tuzina: 33,3%. Duże odchylenia w krótkich sesjach to norma.</p>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={rollingData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="spin" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis domain={[0, 80]} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={v => `${v}%`} />
              <ReferenceLine y={33.3} stroke="#64748b" strokeDasharray="5 5" />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
              <Line type="monotone" dataKey="d1Pct" stroke="#3b82f6" strokeWidth={2} dot={false} name="Tuzin 1" />
              <Line type="monotone" dataKey="d2Pct" stroke="#a855f7" strokeWidth={2} dot={false} name="Tuzin 2" />
              <Line type="monotone" dataKey="d3Pct" stroke="#06b6d4" strokeWidth={2} dot={false} name="Tuzin 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card section-card full-width">
        <h3 className="section-title">🟢 Kumulatywne wystąpienia zera vs oczekiwanie</h3>
        <p className="chart-note">Porównanie rzeczywistej liczby zer z oczekiwaną teoretycznie.</p>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={zeroData}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="spin" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
              <Line type="monotone" dataKey="zeros" stroke="#22c55e" strokeWidth={2} dot={false} name="Rzeczywiste zera" />
              <Line type="monotone" dataKey="expected" stroke="#64748b" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Oczekiwane" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
