export default function EducationPanel({ rouletteType }) {
  return (
    <div className="education-panel">
      <div className="edu-header glass-card">
        <h2>📚 Edukacja: Jak naprawdę działa ruletka</h2>
        <p>Zrozumienie matematyki stojącej za grą to najlepsza ochrona przed nieracjonalnymi decyzjami.</p>
      </div>

      <div className="edu-grid">
        <div className="glass-card edu-card">
          <h3>🎲 Niezależność spinów</h3>
          <p>
            Każdy spin ruletki jest zdarzeniem <strong>matematycznie niezależnym</strong>. Oznacza to, że wynik
            poprzednich spinów nie ma absolutnie żadnego wpływu na kolejny wynik. Koło nie „pamięta"
            historii — jest fizycznie bezstanowe.
          </p>
          <div className="edu-example">
            <strong>Przykład:</strong> Nawet po 20 czerwonych z rzędu, prawdopodobieństwo kolejnego
            czerwonego wynosi nadal ~48,6% (europejska). Nie wzrasta, nie maleje.
          </div>
        </div>

        <div className="glass-card edu-card">
          <h3>🃏 Złudzenie hazardzisty (Gambler's Fallacy)</h3>
          <p>
            To powszechny błąd poznawczy polegający na przekonaniu, że po serii jednego koloru
            „musi nastąpić" wyrównanie. W matematyce ta intuicja jest <strong>fałszywa</strong>.
          </p>
          <div className="edu-example">
            <strong>Dlaczego?</strong> Prawo wielkich liczb działa na milionach spinów, nie na dziesiątkach.
            W krótkim terminie odchylenia od oczekiwań są normalnym zjawiskiem losowym.
          </div>
        </div>

        <div className="glass-card edu-card full-edu">
          <h3>📈 Dlaczego strategia Martingale nie zmienia przewagi kasyna</h3>
          <p>
            Strategia Martingale polega na podwajaniu zakładu po każdej przegranej, aż do wygranej.
            Teoria brzmi przekonująco — w końcu musisz kiedyś wygrać, prawda?
          </p>
          <div className="martingale-table">
            <div className="martingale-header">Symulacja serii przegranych (zakład bazowy: 10 zł)</div>
            <table className="edu-table">
              <thead>
                <tr><th>Spin</th><th>Zakład</th><th>Łączna strata</th><th>Wymagana wygrana</th></tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6,7,8].map((spin) => {
                  const bet = 10 * Math.pow(2, spin - 1);
                  const totalLoss = 10 * (Math.pow(2, spin) - 1);
                  return (
                    <tr key={spin} className={spin >= 6 ? "row-danger" : ""}>
                      <td>{spin}</td>
                      <td>{bet.toLocaleString()} zł</td>
                      <td className="loss-cell">-{totalLoss.toLocaleString()} zł</td>
                      <td>{(10 * Math.pow(2, spin - 1)).toLocaleString()} zł</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="edu-warning">
            ⚠️ <strong>Kluczowe problemy Martingale:</strong>
            <ul>
              <li>Limity stołu kasyna uniemożliwiają nieskończone podwajanie</li>
              <li>Skończony budżet gracza oznacza ryzyko całkowitej utraty kapitału</li>
              <li>Przewaga kasyna ({rouletteType === "european" ? "2.70" : "5.26"}%) pozostaje niezmieniona dla każdego zakładu</li>
              <li>Strategia zmienia rozkład wyników, ale <strong>nie zmienia oczekiwanej wartości</strong></li>
            </ul>
          </div>
        </div>

        <div className="glass-card edu-card">
          <h3>🔢 Prawo wielkich liczb w praktyce</h3>
          <p>
            Prawo wielkich liczb mówi, że przy nieskończonej liczbie prób wyniki zbliżą się do wartości
            oczekiwanej. Ale to właśnie „nieskończoność" jest kluczem — <strong>w praktycznej sesji gry
            odchylenia mogą być ogromne</strong>.
          </p>
          <div className="lln-examples">
            <div className="lln-row">
              <span>10 spinów:</span><span className="lln-dev">Odchylenie ±30%+ normalne</span>
            </div>
            <div className="lln-row">
              <span>100 spinów:</span><span className="lln-dev">Odchylenie ±10% normalne</span>
            </div>
            <div className="lln-row">
              <span>10 000 spinów:</span><span className="lln-dev">Odchylenie ±1% normalne</span>
            </div>
            <div className="lln-row">
              <span>1 000 000 spinów:</span><span className="lln-dev-ok">~48.6% czerwonych</span>
            </div>
          </div>
        </div>

        <div className="glass-card edu-card">
          <h3>🏦 Dlaczego kasyno zawsze wygrywa długookresowo</h3>
          <p>
            Przewaga kasyna to matematyczna gwarancja. Przy ruletce europejskiej, kasyno zatrzymuje
            średnio 2,70 grosza z każdej obstawionej złotówki. Przy setkach tysięcy zakładów dziennie,
            to pewny zysk operacyjny — niezależny od losów poszczególnych graczy.
          </p>
          <div className="edu-example">
            <strong>EV (Expected Value) dla gracza:</strong><br />
            Zakład 100 zł na kolor: EV = 100 × (48.65% × 1 − 51.35% × 1) = <strong className="ev-neg">−2.70 zł</strong>
          </div>
        </div>

        <div className="glass-card edu-card full-edu">
          <h3>🛡 Odpowiedzialna gra — zasoby</h3>
          <div className="resources-grid">
            {[
              { name: "Uzależnienia behawioralne", org: "Krajowe Centrum Przeciwdziałania Uzależnieniom", url: "https://kcpu.gov.pl" },
              { name: "Hazard problemowy — pomoc", org: "Anonimowi Hazardziści Polska", url: "https://hazardzisci.org" },
              { name: "Telefon zaufania", org: "116 123 (całą dobę, bezpłatny)", url: null },
              { name: "Linia pomocy hazardowej", org: "0 801 140 068", url: null },
            ].map((r, i) => (
              <div key={i} className="resource-card">
                <div className="resource-name">{r.name}</div>
                <div className="resource-org">{r.org}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
