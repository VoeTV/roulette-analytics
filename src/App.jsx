import { useState, useCallback } from "react";
import Header from "./components/Header";
import InputPanel from "./components/InputPanel";
import StatsGrid from "./components/StatsGrid";
import HeatmapPanel from "./components/HeatmapPanel";
import TrendsPanel from "./components/TrendsPanel";
import RationalBetsPanel from "./components/RationalBetsPanel";
import EducationPanel from "./components/EducationPanel";
import DisclaimerBanner from "./components/DisclaimerBanner";
import { analyzeResults } from "./utils/statistics";
import { MOCK_DATA } from "./utils/mockData";

export default function App() {
  const [rouletteType, setRouletteType] = useState("european");
  const [results, setResults] = useState(MOCK_DATA);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("stats");

  const stats = analyzeResults(results, rouletteType);

  const handleAddNumber = useCallback(() => {
    const nums = inputValue
      .split(/[\s,;]+/)
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => {
        const max = rouletteType === "american" ? 38 : 37;
        return !isNaN(n) && n >= 0 && n < max;
      });
    if (nums.length > 0) {
      setResults((prev) => [...prev, ...nums]);
      setInputValue("");
    }
  }, [inputValue, rouletteType]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddNumber();
  };

  const handleClear = () => setResults([]);
  const handleLoadMock = () => setResults(MOCK_DATA);

  const tabs = [
    { id: "stats", label: "Statystyki" },
    { id: "heatmap", label: "Heatmapa" },
    { id: "trends", label: "Trendy" },
    { id: "bets", label: "Analiza Zakładów" },
    { id: "education", label: "Edukacja" },
  ];

  return (
    <div className="app-root">
      <div className="bg-grid" />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <div className="app-container">
        <Header
          rouletteType={rouletteType}
          setRouletteType={setRouletteType}
          spinCount={results.length}
        />

        <DisclaimerBanner />

        <InputPanel
          inputValue={inputValue}
          setInputValue={setInputValue}
          onAdd={handleAddNumber}
          onKeyDown={handleKeyDown}
          onClear={handleClear}
          onLoadMock={handleLoadMock}
          results={results}
          rouletteType={rouletteType}
        />

        {results.length > 0 && (
          <>
            <div className="tabs-bar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === "stats" && <StatsGrid stats={stats} results={results} />}
              {activeTab === "heatmap" && <HeatmapPanel stats={stats} rouletteType={rouletteType} />}
              {activeTab === "trends" && <TrendsPanel results={results} stats={stats} />}
              {activeTab === "bets" && <RationalBetsPanel stats={stats} rouletteType={rouletteType} />}
              {activeTab === "education" && <EducationPanel rouletteType={rouletteType} />}
            </div>
          </>
        )}

        {results.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>Brak danych do analizy</h3>
            <p>Wprowadź wyniki spinów lub załaduj przykładowe dane, aby zobaczyć statystyki.</p>
            <button className="btn-primary" onClick={handleLoadMock}>
              Załaduj przykładowe dane
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
