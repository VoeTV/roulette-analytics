# Royal Roulette

Profesjonalna, w pełni działająca ruletka europejska (single-zero) na **fikcyjnym saldzie** — żadnych prawdziwych pieniędzy. Stylistyka kasyna online: filcowy stół, animowane koło z kulką, żetony różnych nominałów, animacje wygranych. Saldo zapisuje się w `localStorage`.

## Funkcje

- Animowane koło ruletki z kulką (SVG + CSS, ~6 s spin).
- Pełny stół do obstawiania w stylu kasyna:
  - **Inside:** zakłady na pojedyncze numery (płaci 35:1).
  - **Outside:** czerwone/czarne, parzyste/nieparzyste, 1–18/19–36 (1:1), tuziny i kolumny (2:1).
- Żetony 1 / 5 / 25 / 100 / 500 z realnym kasynowym wzornictwem.
- Cofnij / wyczyść / **powtórz ostatnie zakłady** / krępolny przycisk **KRĘĆ**.
- Saldo + historia 50 ostatnich spinów zapisywane w `localStorage`.
- Doładowanie (+$1000) i reset salda do 1000 $.
- RNG oparte o `crypto.getRandomValues` — uczciwe, jak w prawdziwym RNG-kasynie.
- Pełna responsywność (desktop / tablet / mobile).

## Stack

- React 18 + Vite 5 (czysty bundel statyczny — łatwe wdrożenie na CDN).
- Bez backendu — całość działa po stronie klienta.

## Lokalnie

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # bundle do ./dist
npm run preview  # podgląd buildu
```

## Wdrożenie na Cloudflare Pages

### Wariant 1 — automatyczny deploy z GitHuba (zalecane)

1. Wejdź na [Cloudflare Pages](https://dash.cloudflare.com/) → **Create a project** → **Connect to Git** → wybierz to repo.
2. Ustaw:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18 lub nowszy (`NODE_VERSION=20` w zmiennych środowiskowych).
3. **Save and Deploy**. Każdy push na `main` od teraz triggeruje deploy.

Plik `public/_redirects` obsługuje fallback SPA, `public/_headers` ustawia bezpieczne nagłówki i agresywny cache na `/assets/*`.

### Wariant 2 — Wrangler CLI (deploy z terminala)

```bash
npm install -g wrangler
wrangler login
npm run build
npm run deploy   # = wrangler pages deploy dist --project-name royal-roulette
```

Konfiguracja jest w `wrangler.toml` (`pages_build_output_dir = "dist"`).

### Wariant 3 — drag & drop

`npm run build`, a następnie w panelu Cloudflare Pages **Upload assets** → przeciągnij folder `dist/`.

## Disclaimer

Saldo jest **całkowicie wirtualne**. Aplikacja nie obsługuje płatności i nie pozwala wpłacić ani wypłacić prawdziwych pieniędzy. Projekt służy do nauki i zabawy.
