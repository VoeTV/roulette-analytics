// European single-zero roulette engine

// Wheel pocket order (clockwise starting at 0)
export const WHEEL_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23,
  10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

export const POCKET_COUNT = WHEEL_ORDER.length; // 37

export const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export function colorOf(n) {
  if (n === 0) return "green";
  return RED_NUMBERS.has(n) ? "red" : "black";
}

export function pocketIndex(n) {
  return WHEEL_ORDER.indexOf(n);
}

export function pocketAngle(n) {
  // Angle (deg) of pocket center, with 0 at 12 o'clock, growing clockwise
  return (pocketIndex(n) * 360) / POCKET_COUNT;
}

// Table layout (3 rows x 12 columns, top row = 3,6,9...)
export const TABLE_ROWS = [
  [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], // top   -> column "3" (top 2:1)
  [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], // mid   -> column "2"
  [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], // bot   -> column "1"
];

// All bet kinds
export const BET_KINDS = {
  STRAIGHT: "straight",   // single number, 35:1
  RED: "red",             // 1:1
  BLACK: "black",         // 1:1
  EVEN: "even",           // 1:1
  ODD: "odd",             // 1:1
  LOW: "low",             // 1-18, 1:1
  HIGH: "high",           // 19-36, 1:1
  DOZEN1: "dozen1",       // 1-12, 2:1
  DOZEN2: "dozen2",       // 13-24, 2:1
  DOZEN3: "dozen3",       // 25-36, 2:1
  COL1: "col1",           // bottom row column, 2:1
  COL2: "col2",           // mid row column, 2:1
  COL3: "col3",           // top row column, 2:1
};

// Payout multiplier (winnings = stake * payout, plus stake returned)
export function payoutFor(kind) {
  if (kind === BET_KINDS.STRAIGHT) return 35;
  if (
    kind === BET_KINDS.DOZEN1 ||
    kind === BET_KINDS.DOZEN2 ||
    kind === BET_KINDS.DOZEN3 ||
    kind === BET_KINDS.COL1 ||
    kind === BET_KINDS.COL2 ||
    kind === BET_KINDS.COL3
  ) return 2;
  return 1; // even-money bets
}

// Determine whether a bet wins for the given winning number n
export function betWins(bet, n) {
  if (n === 0) {
    // 0 only wins on a straight bet on 0
    return bet.kind === BET_KINDS.STRAIGHT && bet.number === 0;
  }
  switch (bet.kind) {
    case BET_KINDS.STRAIGHT: return bet.number === n;
    case BET_KINDS.RED:      return colorOf(n) === "red";
    case BET_KINDS.BLACK:    return colorOf(n) === "black";
    case BET_KINDS.EVEN:     return n % 2 === 0;
    case BET_KINDS.ODD:      return n % 2 === 1;
    case BET_KINDS.LOW:      return n >= 1 && n <= 18;
    case BET_KINDS.HIGH:     return n >= 19 && n <= 36;
    case BET_KINDS.DOZEN1:   return n >= 1 && n <= 12;
    case BET_KINDS.DOZEN2:   return n >= 13 && n <= 24;
    case BET_KINDS.DOZEN3:   return n >= 25 && n <= 36;
    case BET_KINDS.COL1:     return n % 3 === 1; // 1,4,7,...,34
    case BET_KINDS.COL2:     return n % 3 === 2; // 2,5,...,35
    case BET_KINDS.COL3:     return n % 3 === 0; // 3,6,...,36
    default: return false;
  }
}

// Resolve all bets against a winning number. Returns { totalStake, totalReturn, results }
// totalReturn = sum over winning bets of (stake + stake*payout). Loss = totalStake - totalReturn
export function resolveBets(bets, n) {
  let totalStake = 0;
  let totalReturn = 0;
  const results = [];
  for (const bet of bets) {
    totalStake += bet.amount;
    const won = betWins(bet, n);
    if (won) {
      const win = bet.amount * payoutFor(bet.kind);
      totalReturn += bet.amount + win;
      results.push({ ...bet, won: true, payout: win });
    } else {
      results.push({ ...bet, won: false, payout: 0 });
    }
  }
  return { totalStake, totalReturn, net: totalReturn - totalStake, results };
}

// Cryptographically-strong fair RNG for spin result
export function spinRandom() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % POCKET_COUNT; // 0..36
  }
  return Math.floor(Math.random() * POCKET_COUNT);
}

// Friendly bet labels
export function labelFor(bet) {
  switch (bet.kind) {
    case BET_KINDS.STRAIGHT: return `Numer ${bet.number}`;
    case BET_KINDS.RED:      return "Czerwone";
    case BET_KINDS.BLACK:    return "Czarne";
    case BET_KINDS.EVEN:     return "Parzyste";
    case BET_KINDS.ODD:      return "Nieparzyste";
    case BET_KINDS.LOW:      return "1–18";
    case BET_KINDS.HIGH:     return "19–36";
    case BET_KINDS.DOZEN1:   return "1. tuzin (1–12)";
    case BET_KINDS.DOZEN2:   return "2. tuzin (13–24)";
    case BET_KINDS.DOZEN3:   return "3. tuzin (25–36)";
    case BET_KINDS.COL1:     return "1. kolumna";
    case BET_KINDS.COL2:     return "2. kolumna";
    case BET_KINDS.COL3:     return "3. kolumna";
    default: return bet.kind;
  }
}

// Stable key for a bet location (used to merge stacked chips)
export function betKey(kind, number) {
  return kind === BET_KINDS.STRAIGHT ? `straight:${number}` : `kind:${kind}`;
}
