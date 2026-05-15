import { useState } from "react";

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="disclaimer-banner">
      <span className="disclaimer-icon">⚠️</span>
      <p>
        <strong>Ważne:</strong> Ruletka jest grą losową. Każdy spin jest niezależny i nie zależy od wyników poprzednich.
        Ta aplikacja dostarcza wyłącznie analizę historyczną — <strong>nie prognozuje przyszłych wyników</strong> i nie
        gwarantuje zysku. Graj odpowiedzialnie i tylko dla rozrywki.
      </p>
      <button className="dismiss-btn" onClick={() => setDismissed(true)}>✕</button>
    </div>
  );
}
