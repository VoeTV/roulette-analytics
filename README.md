# RouletteScope — Analityka Historyczna Ruletki

> **Tylko dane, zero obietnic.** Aplikacja do analizy historii wyników ruletki.

---

## ⚠️ Ważne zastrzeżenie

Ruletka jest grą losową. Każdy spin jest niezależnym zdarzeniem losowym i nie zależy od poprzednich wyników. Ta aplikacja służy wyłącznie do analizy historycznej i **nie prognozuje przyszłych wyników**, nie gwarantuje zysku i nie powinna być traktowana jako system do zarabiania pieniędzy.

---

## 🚀 Uruchomienie lokalne

### Wymagania
- Node.js 18+
- npm lub yarn

### Instalacja i start

```bash
# Wejdź do katalogu projektu
cd roulette-analytics

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

### Build produkcyjny

```bash
npm run build
npm run preview
```

---

## 📁 Struktura plików

```
roulette-analytics/
├── index.html                        # Punkt wejścia HTML
├── package.json                      # Zależności projektu
├── vite.config.js                    # Konfiguracja Vite
├── README.md                         # Ta dokumentacja
└── src/
    ├── main.jsx                      # Inicjalizacja React
    ├── App.jsx                       # Główny komponent aplikacji
    ├── index.css                     # Style globalne (dark mode, glassmorphism)
    ├── components/
    │   ├── Header.jsx                # Nagłówek + przełącznik trybu
    │   ├── DisclaimerBanner.jsx      # Baner z ostrzeżeniem prawnym
    │   ├── InputPanel.jsx            # Wprowadzanie wyników spinów
    │   ├── StatsGrid.jsx             # Panel głównych statystyk + histogram
    │   ├── HeatmapPanel.jsx          # Heatmapa stołu i koła
    │   ├── TrendsPanel.jsx           # Wykresy trendów krocząco
    │   ├── RationalBetsPanel.jsx     # Analiza zakładów + zarządzanie budżetem
    │   └── EducationPanel.jsx        # Sekcja edukacyjna
    └── utils/
        ├── statistics.js             # Logika obliczania statystyk
        └── mockData.js               # 100 przykładowych spinów testowych
```

---

## 🧪 Przykładowe dane testowe

Plik `src/utils/mockData.js` zawiera 100 spinów testowych:

```js
[32, 15, 0, 26, 8, 19, 31, 22, 18, 29,
 7, 28, 12, 35, 3, 26, 0, 32, 15, 19,
 // ... 80 kolejnych
 17, 17, 17, 5, 5, 0, 36, 1, 2, 3]
```

Dane zawierają:
- Serię powtórzeń liczby 17 (do testowania wykrywania „gorących liczb")
- Dwa zera (do testowania sekcji zero)
- Rozkład przybliżony do prawdziwej ruletki

Aby przetestować ręcznie, wpisz w pole wejściowe np.:
```
0 32 15 7 19 4 21 2 25 17 34 6 27
```

---

## 📊 Jak działa analiza statystyczna

### Algorytm kategoryzacji

Każda liczba jest automatycznie klasyfikowana w 6 wymiarach:

| Wymiar | Wartości |
|--------|---------|
| Kolor | czerwony / czarny / zielony (0, 00) |
| Parzystość | parzyste / nieparzyste |
| Zakres | 1–18 / 19–36 |
| Tuzin | 1. (1–12) / 2. (13–24) / 3. (25–36) |
| Kolumna | 1 / 2 / 3 |
| Typ | zero / nie-zero |

### Wskaźniki statystyczne

- **Częstość bezwzględna**: ile razy dana liczba/kategoria wystąpiła
- **Częstość względna**: % udział w łącznej liczbie spinów
- **Odchylenie od oczekiwanego**: różnica między rzeczywistą a teoretyczną częstością
- **Odchylenie procentowe**: (rzeczywiste - oczekiwane) / oczekiwane × 100%
- **Trend krocząco**: obliczany w oknie N spinów (auto-dobierane do rozmiaru próbki)

### Ruletka europejska vs amerykańska

| Parametr | Europejska | Amerykańska |
|----------|-----------|-------------|
| Liczba pól | 37 (0–36) | 38 (0–36 + 00) |
| Przewaga kasyna | 2,70% | 5,26% |
| Szansa na kolor | 48,65% | 47,37% |
| Szansa na tuzin | 32,43% | 31,58% |
| Zły zakład | brak | 5-liczb (7,89%) |

### Ograniczenia analizy historycznej

1. **Niezależność zdarzeń**: statystyki historyczne NIE zwiększają ani nie zmniejszają prawdopodobieństwa przyszłych wyników
2. **Małe próbki**: przy <200 spinach odchylenia statystyczne są bardzo duże i nie mają wartości predykcyjnej
3. **Zbieżność**: prawo wielkich liczb działa na tysiącach i milionach spinów, nie na sesjach gracza
4. **Błąd potwierdzenia**: łatwo zinterpretować losowe wzorce jako „trendy" — to złudzenie poznawcze

---

## 🎨 Design

- **Styl**: Dark mode premium, glassmorphism, grid tło
- **Kolory**: Deep navy (#050b18), neonowy niebieski (#60a5fa), cyjan (#22d3ee)
- **Typografia**: Space Grotesk (bezszeryfowy), JetBrains Mono (monospace)
- **Animacje**: logo spin, pop-in na chipach wyników, bar transitions
- **Responsywność**: 4→2→1 kolumny kart KPI, stacks mobile

---

## 📦 Zależności

| Paczka | Wersja | Zastosowanie |
|--------|--------|-------------|
| react | 18.3.x | Główny framework UI |
| react-dom | 18.3.x | Renderowanie DOM |
| recharts | 2.12.x | Wykresy liniowe i słupkowe |
| vite | 5.4.x | Bundler i dev server |
| @vitejs/plugin-react | 4.3.x | HMR i JSX transform |

---

*RouletteScope — Edukacja i analiza, nie obietnice.*
