const BET_DATA = {
  european: [
    { name: "Czerwone / Czarne", type: "zewnętrzny", odds: "1:1", winProb: 48.65, houseEdge: 2.70, riskLevel: "niskie", note: "Najbliższe 50/50 – najniższa przewaga kasyna w klasach 1:1" },
    { name: "Parzyste / Nieparzyste", type: "zewnętrzny", odds: "1:1", winProb: 48.65, houseEdge: 2.70, riskLevel: "niskie", note: "Identyczna struktura jak kolor – to samo ryzyko" },
    { name: "1–18 / 19–36", type: "zewnętrzny", odds: "1:1", winProb: 48.65, houseEdge: 2.70, riskLevel: "niskie", note: "Zakłady na połowę stołu" },
    { name: "Tuzin (1–12, 13–24, 25–36)", type: "zewnętrzny", odds: "2:1", winProb: 32.43, houseEdge: 2.70, riskLevel: "średnie", note: "Wyższy zwrot, ale mniejsza szansa" },
    { name: "Kolumna (12 liczb)", type: "zewnętrzny", odds: "2:1", winProb: 32.43, houseEdge: 2.70, riskLevel: "średnie", note: "Analogicznie do tuzinów" },
    { name: "Sześć liczb (sixline)", type: "wewnętrzny", odds: "5:1", winProb: 16.22, houseEdge: 2.70, riskLevel: "wysokie", note: "Coraz mniejsza szansa, ta sama przewaga kasyna" },
    { name: "Zakład na pojedynczą liczbę", type: "wewnętrzny", odds: "35:1", winProb: 2.70, houseEdge: 2.70, riskLevel: "bardzo wysokie", note: "Najwyższy zwrot, najniższe prawdopodobieństwo" },
  ],
  american: [
    { name: "Czerwone / Czarne", type: "zewnętrzny", odds: "1:1", winProb: 47.37, houseEdge: 5.26, riskLevel: "niskie", note: "UWAGA: przewaga kasyna prawie 2× wyższa niż w europejskiej" },
    { name: "Parzyste / Nieparzyste", type: "zewnętrzny", odds: "1:1", winProb: 47.37, houseEdge: 5.26, riskLevel: "niskie", note: "Podwójne zero podwaja stratę długookresową" },
    { name: "1–18 / 19–36", type: "zewnętrzny", odds: "1:1", winProb: 47.37, houseEdge: 5.26, riskLevel: "niskie", note: "" },
    { name: "Tuzin", type: "zewnętrzny", odds: "2:1", winProb: 31.58, houseEdge: 5.26, riskLevel: "średnie", note: "" },
    { name: "Kolumna", type: "zewnętrzny", odds: "2:1", winProb: 31.58, houseEdge: 5.26, riskLevel: "średnie", note: "" },
    { name: "Zakład na 5 liczb (0,00,1,2,3)", type: "wewnętrzny", odds: "6:1", winProb: 13.16, houseEdge: 7.89, riskLevel: "bardzo wysokie", note: "⚠️ Najgorszy zakład – przewaga kasyna 7.89%!" },
    { name: "Zakład na pojedynczą liczbę", type: "wewnętrzny", odds: "35:1", winProb: 2.63, houseEdge: 5.26, riskLevel: "bardzo wysokie", note: "" },
  ],
};

function RiskBadge({ level }) {
  const cls = {
    "niskie": "badge-low",
    "średnie": "badge-mid",
    "wysokie": "badge-high",
    "bardzo wysokie": "badge-very-high",
  }[level] || "badge-mid";
  return <span className={`risk-badge ${cls}`}>{level}</span>;
}

function EdgeBar({ value }) {
  const max = 10;
  const pct = (value / max) * 100;
  const color = value <= 2.75 ? "#22c55e" : value <= 4 ? "#f59e0b" : "#ef4444";
  return (
    <div className="edge-bar-wrap">
      <div className="edge-bar-track">
        <div className="edge-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="edge-value" style={{ color }}>{value.toFixed(2)}%</span>
    </div>
  );
}

export default function RationalBetsPanel({ stats, rouletteType }) {
  const bets = BET_DATA[rouletteType];
  const houseEdge = rouletteType === "european" ? 2.70 : 5.26;

  return (
    <div className="bets-panel">
      <div className="disclaimer-box">
        <p>
          ⚠️ <strong>Ważne zastrzeżenie:</strong> Poniższe dane to czysto matematyczna analiza prawdopodobieństwa
          i przewagi kasyna. <strong>Żaden zakład nie jest „pewny" ani nie gwarantuje zysku.</strong>
          Kasyno zawsze ma przewagę statystyczną w długim terminie. Celem tej sekcji jest edukacja na temat
          struktury zakładów, a nie zachęta do gry.
        </p>
      </div>

      <div className="glass-card section-card full-width">
        <h3 className="section-title">🏦 Przewaga kasyna dla {rouletteType === "european" ? "ruletki europejskiej" : "ruletki amerykańskiej"}</h3>
        <div className="house-edge-display">
          <div className={`house-edge-badge ${rouletteType === "european" ? "hedge-eu" : "hedge-us"}`}>
            {houseEdge.toFixed(2)}%
          </div>
          <p className="house-edge-desc">
            {rouletteType === "european"
              ? "Ruletka europejska z jednym zerem — najniższa przewaga kasyna spośród popularnych ruletkek. Na każde 100 zł obstawionych kasyno zarabia średnio 2,70 zł."
              : "Ruletka amerykańska z podwójnym zerem (0 i 00) — przewaga kasyna prawie dwukrotnie wyższa. Zdecydowanie mniej korzystna dla gracza."}
          </p>
        </div>
      </div>

      <div className="glass-card section-card full-width">
        <h3 className="section-title">📊 Analiza struktury zakładów</h3>
        <p className="chart-note">Posortowane od najmniej do najbardziej niekorzystnych dla gracza. Przewaga kasyna jest identyczna dla większości zakładów — różni się tylko stosunek ryzyko/zwrot.</p>

        <div className="bets-table-wrap">
          <table className="bets-table">
            <thead>
              <tr>
                <th>Zakład</th>
                <th>Typ</th>
                <th>Wypłata</th>
                <th>Szansa wygranej</th>
                <th>Przew. kasyna</th>
                <th>Ryzyko</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet, i) => (
                <tr key={i}>
                  <td>
                    <div className="bet-name">{bet.name}</div>
                    {bet.note && <div className="bet-note">{bet.note}</div>}
                  </td>
                  <td><span className="bet-type-badge">{bet.type}</span></td>
                  <td className="bet-odds">{bet.odds}</td>
                  <td className="bet-prob">{bet.winProb.toFixed(2)}%</td>
                  <td><EdgeBar value={bet.houseEdge} /></td>
                  <td><RiskBadge level={bet.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-card section-card full-width">
        <h3 className="section-title">💡 Zarządzanie budżetem i kontrola ryzyka</h3>
        <div className="tips-grid">
          {[
            { icon: "💰", title: "Ustal limit sesji", desc: "Zdecyduj z góry, ile maksymalnie możesz stracić w jednej sesji. Po osiągnięciu limitu — kończ grę." },
            { icon: "🎯", title: "Cel zysku", desc: "Jeśli osiągasz z góry ustalony zysk (np. +20%), rozważ zakończenie sesji. Zabezpieczasz wtedy wygraną." },
            { icon: "📉", title: "Unikaj zakładów o wysokiej przewadze", desc: `Zakład na 5 liczb w ruletce amerykańskiej (7,89%) jest prawie 3× gorszy niż zakłady zewnętrzne.` },
            { icon: "⏱", title: "Tempo gry", desc: "Więcej spinów = więcej czasu na działanie przewagi kasyna. Wolniejsza gra = mniejsze straty w jednostce czasu." },
            { icon: "🧮", title: "Oczekiwana wartość", desc: `Przy zakładzie 100 zł na kolor: EV = -${houseEdge.toFixed(2)} zł. To matematyczna strata długookresowa, niezależnie od krótkoterminowych serii.` },
            { icon: "🚫", title: "Nie graj pod wpływem emocji", desc: "Próba odgrywania strat (tilt) to najszybsza droga do przekroczenia budżetu. Emocje są wrogiem racjonalnych decyzji." },
          ].map((tip, i) => (
            <div key={i} className="tip-card">
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-title">{tip.title}</div>
              <div className="tip-desc">{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
