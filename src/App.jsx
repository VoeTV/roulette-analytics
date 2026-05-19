import { useCallback, useMemo, useState } from "react";
import BalanceBar from "./components/BalanceBar";
import RouletteWheel from "./components/RouletteWheel";
import BettingTable from "./components/BettingTable";
import ChipRack from "./components/ChipRack";
import BetSummary from "./components/BetSummary";
import HistoryStrip from "./components/HistoryStrip";
import WinOverlay from "./components/WinOverlay";
import { useWallet } from "./hooks/useWallet";
import { resolveBets, spinRandom, colorOf } from "./utils/roulette";

export default function App() {
  const { balance, debit, credit, addTopUp, reset, history, pushHistory } = useWallet();

  const [chip, setChip] = useState(5);
  const [bets, setBets] = useState([]);              // active bets, not yet committed
  const [lastBets, setLastBets] = useState([]);      // last committed bets, for "Powtórz"
  const [spinning, setSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [lastNet, setLastNet] = useState(null);

  const totalStake = useMemo(
    () => bets.reduce((s, b) => s + b.amount, 0),
    [bets]
  );

  const placeBet = useCallback((kind, number) => {
    if (spinning) return;
    if (chip > balance - totalStake) {
      // Not enough free balance for this chip
      return;
    }
    setBets((prev) => [...prev, { kind, number, amount: chip }]);
  }, [chip, balance, totalStake, spinning]);

  const clearBetAt = useCallback((kind, number) => {
    if (spinning) return;
    setBets((prev) => {
      // Remove the LAST bet matching this location
      for (let i = prev.length - 1; i >= 0; i--) {
        const b = prev[i];
        const matches = b.kind === kind && (number === undefined || b.number === number);
        if (matches) {
          return [...prev.slice(0, i), ...prev.slice(i + 1)];
        }
      }
      return prev;
    });
  }, [spinning]);

  const undo = useCallback(() => {
    if (spinning) return;
    setBets((prev) => prev.slice(0, -1));
  }, [spinning]);

  const clearAll = useCallback(() => {
    if (spinning) return;
    setBets([]);
  }, [spinning]);

  const rebet = useCallback(() => {
    if (spinning) return;
    if (lastBets.length === 0) return;
    const total = lastBets.reduce((s, b) => s + b.amount, 0);
    if (total > balance) return;
    setBets(lastBets.map((b) => ({ ...b })));
  }, [spinning, lastBets, balance]);

  const spin = useCallback(() => {
    if (spinning || bets.length === 0) return;

    // Debit total stake immediately
    debit(totalStake);
    setLastBets(bets.map((b) => ({ ...b })));

    const result = spinRandom(); // 0..36
    setWinningNumber(result);
    setSpinning(true);
  }, [spinning, bets, totalStake, debit]);

  const handleSpinEnd = useCallback(() => {
    if (winningNumber == null) return;

    const { totalReturn, net } = resolveBets(bets, winningNumber);
    if (totalReturn > 0) credit(totalReturn);

    setLastNet(net);
    setOverlay({
      number: winningNumber,
      color: colorOf(winningNumber),
      net,
      totalStake,
    });

    pushHistory({
      number: winningNumber,
      color: colorOf(winningNumber),
      net,
      stake: totalStake,
      ts: Date.now(),
    });

    setSpinning(false);
    setBets([]); // clear active bets after the spin resolves
  }, [bets, winningNumber, totalStake, credit, pushHistory]);

  const lastNumber = history[0]?.number ?? null;
  const canSpin = !spinning && bets.length > 0;
  const canRebet = !spinning && lastBets.length > 0 && lastBets.reduce((s, b) => s + b.amount, 0) <= balance;

  return (
    <div className="app-root">
      <div className="bg-felt" />
      <div className="bg-vignette" />

      <div className="app-shell">
        <BalanceBar
          balance={balance}
          totalStake={totalStake}
          lastNet={lastNet}
          onTopUp={() => addTopUp(1000)}
          onReset={() => {
            if (window.confirm("Zresetować saldo do 1000 $ i wyczyścić historię?")) {
              reset();
              setLastBets([]);
              setLastNet(null);
            }
          }}
        />

        <main className="game-grid">
          <section className="game-left glass-panel">
            <RouletteWheel
              winningNumber={winningNumber}
              spinning={spinning}
              onSpinEnd={handleSpinEnd}
              lastNumber={lastNumber}
            />
            <HistoryStrip history={history} />
          </section>

          <section className="game-center">
            <BettingTable
              bets={bets}
              onPlace={placeBet}
              onClear={clearBetAt}
              winningNumber={!spinning && winningNumber != null ? winningNumber : null}
              locked={spinning}
            />
            <ChipRack selected={chip} onSelect={setChip} />
          </section>

          <aside className="game-right glass-panel">
            <BetSummary
              bets={bets}
              totalStake={totalStake}
              onUndo={undo}
              onClearAll={clearAll}
              onSpin={spin}
              onRebet={rebet}
              canSpin={canSpin}
              canRebet={canRebet}
            />
          </aside>
        </main>

        <footer className="app-foot">
          <span>
            Royal Roulette · gra na fikcyjne saldo (fake balance), brak prawdziwych pieniędzy.
          </span>
          <span>RTP 97,3% · House edge 2,7%</span>
        </footer>
      </div>

      <WinOverlay result={overlay} onClose={() => setOverlay(null)} />
    </div>
  );
}
