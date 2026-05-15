import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getColor } from "../utils/statistics";

function StatCard({ title, value, sub, accent, icon }) {
  return (
    <div className={`stat-card glass-card accent-${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function ColorBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="color-bar-row">
      <div className={`color-dot dot-${color}`} />
      <span className="color-bar-label">{label}</span>
      <div className="color-bar-track">
        <div
          className={`color-bar-fill fill-${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="color-bar-pct">{count} ({pct.toFixed(1)}%)</span>
    </div>
  );
}

export default function StatsGrid({ stats, results }) {
  if (!stats) return null;

  const { colorCounts, dozenCounts, columnCounts, halfCounts, parityCounts,
    total, hotNumbers, coldNumbers, streaks, nonZeroTotal } = stats;

  const frequencyData = Object.entries(stats.numberCounts)
    .filter(([n]) => parseInt(n) <= 36)
    .map(([n, c]) => ({
      name: parseInt(n) === 37 ? "00" : n,
      count: c,
      color: getColor(parseInt(n)),
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const colorMap = { red: "#ef4444", black: "#94a3b8", green: "#22c55e" };

  return (
    <div className="stats-grid">
      {/* Top KPI cards */}
      <div className="kpi-row">
        <StatCard icon="🎯" title="Łącznie spinów" value={total} accent="blue" />
        <StatCard icon="🔴" title="Czerwone" value={colorCounts.red}
          sub={`${nonZeroTotal > 0 ? ((colorCounts.red / nonZeroTotal) * 100).toFixed(1) : 0}% (oczek. 48.6%)`}
          accent="red" />
        <StatCard icon="⚫" title="Czarne" value={colorCounts.black}
          sub={`${nonZeroTotal > 0 ? ((colorCounts.black / nonZeroTotal) * 100).toFixed(1) : 0}% (oczek. 48.6%)`}
          accent="dark" />
        <StatCard icon="🟢" title="Zero" value={colorCounts.green}
          sub={`${total > 0 ? ((colorCounts.green / total) * 100).toFixed(1) : 0}% (oczek. ${stats.rouletteType === "european" ? "2.7%" : "5.3%"})`}
          accent="green" />
      </div>

      <div className="stats-two-col">
        {/* Color distribution */}
        <div className="glass-card section-card">
          <h3 className="section-title">🎨 Rozkład kolorów</h3>
          <ColorBar label="Czerwone" count={colorCounts.red} total={nonZeroTotal} color="red" />
          <ColorBar label="Czarne" count={colorCounts.black} total={nonZeroTotal} color="black" />
          <div className="divider" />
          <h3 className="section-title mt-sm">📊 Parzystość</h3>
          <ColorBar label="Parzyste" count={parityCounts.even} total={nonZeroTotal} color="blue" />
          <ColorBar label="Nieparzyste" count={parityCounts.odd} total={nonZeroTotal} color="purple" />
          <div className="divider" />
          <h3 className="section-title mt-sm">📍 Zakresy</h3>
          <ColorBar label="1–18 (niskie)" count={halfCounts.low} total={nonZeroTotal} color="cyan" />
          <ColorBar label="19–36 (wysokie)" count={halfCounts.high} total={nonZeroTotal} color="orange" />
        </div>

        {/* Dozens & Columns */}
        <div className="glass-card section-card">
          <h3 className="section-title">🔢 Tuziny</h3>
          <ColorBar label="1. tuzin (1–12)" count={dozenCounts[1]} total={nonZeroTotal} color="blue" />
          <ColorBar label="2. tuzin (13–24)" count={dozenCounts[2]} total={nonZeroTotal} color="purple" />
          <ColorBar label="3. tuzin (25–36)" count={dozenCounts[3]} total={nonZeroTotal} color="cyan" />
          <div className="divider" />
          <h3 className="section-title mt-sm">📐 Kolumny</h3>
          <ColorBar label="Kolumna 1" count={columnCounts[1]} total={nonZeroTotal} color="blue" />
          <ColorBar label="Kolumna 2" count={columnCounts[2]} total={nonZeroTotal} color="purple" />
          <ColorBar label="Kolumna 3" count={columnCounts[3]} total={nonZeroTotal} color="cyan" />
          <div className="divider" />
          <h3 className="section-title mt-sm">🔥 Seria obecna</h3>
          <div className="streak-display">
            <div className={`streak-color dot-${streaks.current?.color}`} />
            <span className="streak-text">
              <strong>{streaks.current?.color === "red" ? "Czerwone" : streaks.current?.color === "black" ? "Czarne" : "Zera"}</strong>
              &nbsp;— seria {streaks.current?.length} z rzędu
            </span>
          </div>
          <p className="streak-max">Najdłuższa seria: <strong>{streaks.maxStreak}</strong> ({streaks.maxStreakColor === "red" ? "czerwone" : "czarne"})</p>
        </div>
      </div>

      {/* Hot & Cold */}
      <div className="stats-two-col">
        <div className="glass-card section-card">
          <h3 className="section-title">🔥 Najczęstsze liczby</h3>
          <div className="hot-cold-list">
            {hotNumbers.map((h, i) => (
              <div key={i} className="hot-cold-item">
                <div className={`hc-chip chip-${getColor(h.number)}`}>{h.number}</div>
                <div className="hc-bar-wrap">
                  <div className="hc-label">Liczba {h.number}</div>
                  <div className="hc-bar-track">
                    <div className="hc-bar-fill hc-hot" style={{ width: `${(h.count / total) * 100 * 5}%` }} />
                  </div>
                </div>
                <span className="hc-count">{h.count}×</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card section-card">
          <h3 className="section-title">❄️ Najrzadsze liczby</h3>
          <div className="hot-cold-list">
            {coldNumbers.map((h, i) => (
              <div key={i} className="hot-cold-item">
                <div className={`hc-chip chip-${getColor(h.number)}`}>{h.number}</div>
                <div className="hc-bar-wrap">
                  <div className="hc-label">Liczba {h.number}</div>
                  <div className="hc-bar-track">
                    <div className="hc-bar-fill hc-cold" style={{ width: `${Math.max((h.count / total) * 100 * 5, 4)}%` }} />
                  </div>
                </div>
                <span className="hc-count">{h.count}×</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequency histogram */}
      <div className="glass-card section-card full-width">
        <h3 className="section-title">📈 Histogram częstości wyników (0–36)</h3>
        <p className="chart-note">Oczekiwana częstość przy równomiernym rozkładzie: {stats.expectedPerNumber.toFixed(1)} na liczbę</p>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={frequencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={1} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#94a3b8" }}
              />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {frequencyData.map((entry, index) => (
                  <Cell key={index} fill={colorMap[entry.color]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
