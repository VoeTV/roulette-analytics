export const NUMBER_COLORS = {
  0: "green",
  32: "red", 19: "red", 21: "red", 25: "red", 34: "red", 27: "red",
  36: "red", 30: "red", 23: "red", 5: "red", 16: "red", 1: "red",
  14: "red", 9: "red", 18: "red", 7: "red", 12: "red", 3: "red",
  2: "black", 15: "black", 4: "black", 19: "black", 17: "black",
  6: "black", 13: "black", 11: "black", 8: "black", 10: "black",
  24: "black", 33: "black", 20: "black", 31: "black", 22: "black",
  29: "black", 28: "black", 35: "black", 26: "black",
};

const RED_NUMBERS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);

export function getColor(n) {
  if (n === 0 || n === 37) return "green";
  return RED_NUMBERS.has(n) ? "red" : "black";
}

export function getDozen(n) {
  if (n === 0 || n === 37) return null;
  if (n >= 1 && n <= 12) return 1;
  if (n >= 13 && n <= 24) return 2;
  return 3;
}

export function getColumn(n) {
  if (n === 0 || n === 37) return null;
  return ((n - 1) % 3) + 1;
}

export function getHalf(n) {
  if (n === 0 || n === 37) return null;
  return n <= 18 ? "low" : "high";
}

export function getParity(n) {
  if (n === 0 || n === 37) return null;
  return n % 2 === 0 ? "even" : "odd";
}

export function analyzeResults(results, rouletteType = "european") {
  if (results.length === 0) return null;

  const total = results.length;
  const numberCounts = {};
  const maxNum = rouletteType === "american" ? 38 : 37;

  for (let i = 0; i < maxNum; i++) numberCounts[i] = 0;
  results.forEach((n) => { if (numberCounts[n] !== undefined) numberCounts[n]++; });

  const colorCounts = { red: 0, black: 0, green: 0 };
  const dozenCounts = { 1: 0, 2: 0, 3: 0 };
  const columnCounts = { 1: 0, 2: 0, 3: 0 };
  const halfCounts = { low: 0, high: 0 };
  const parityCounts = { even: 0, odd: 0 };

  results.forEach((n) => {
    colorCounts[getColor(n)]++;
    const d = getDozen(n); if (d) dozenCounts[d]++;
    const c = getColumn(n); if (c) columnCounts[c]++;
    const h = getHalf(n); if (h) halfCounts[h]++;
    const p = getParity(n); if (p) parityCounts[p]++;
  });

  const nonZeroTotal = total - colorCounts.green;

  // Hot & cold numbers
  const sortedByFreq = Object.entries(numberCounts)
    .sort((a, b) => b[1] - a[1]);
  const hotNumbers = sortedByFreq.slice(0, 5).map(([n, c]) => ({ number: parseInt(n), count: c }));
  const coldNumbers = sortedByFreq.slice(-5).reverse().map(([n, c]) => ({ number: parseInt(n), count: c }));

  // Current streaks
  const streaks = computeStreaks(results);

  // Expected frequency per number
  const expectedPerNumber = total / maxNum;
  const deviations = Object.entries(numberCounts).map(([n, c]) => ({
    number: parseInt(n),
    count: c,
    deviation: c - expectedPerNumber,
    deviationPct: expectedPerNumber > 0 ? ((c - expectedPerNumber) / expectedPerNumber) * 100 : 0,
  }));

  // Last 10 results visualization
  const lastResults = results.slice(-20).map((n) => ({
    number: n,
    color: getColor(n),
    dozen: getDozen(n),
    column: getColumn(n),
    half: getHalf(n),
    parity: getParity(n),
  }));

  // Rolling color trend (last 50)
  const rollingWindow = Math.min(results.length, 50);
  const recentSlice = results.slice(-rollingWindow);
  const recentRed = recentSlice.filter((n) => getColor(n) === "red").length;
  const recentBlack = recentSlice.filter((n) => getColor(n) === "black").length;

  // House edge
  const houseEdge = rouletteType === "european" ? 2.70 : 5.26;

  return {
    total,
    maxNum,
    numberCounts,
    colorCounts,
    dozenCounts,
    columnCounts,
    halfCounts,
    parityCounts,
    nonZeroTotal,
    hotNumbers,
    coldNumbers,
    streaks,
    deviations,
    lastResults,
    recentRed,
    recentBlack,
    rollingWindow,
    houseEdge,
    expectedPerNumber,
    rouletteType,
  };
}

function computeStreaks(results) {
  if (results.length === 0) return {};

  const current = { color: null, length: 0 };
  let last = getColor(results[results.length - 1]);
  current.color = last;
  current.length = 0;

  for (let i = results.length - 1; i >= 0; i--) {
    if (getColor(results[i]) === last) current.length++;
    else break;
  }

  // Longest streak
  let maxStreak = 1, curStreak = 1;
  let maxStreakColor = getColor(results[0]);
  for (let i = 1; i < results.length; i++) {
    if (getColor(results[i]) === getColor(results[i - 1]) && getColor(results[i]) !== "green") {
      curStreak++;
      if (curStreak > maxStreak) {
        maxStreak = curStreak;
        maxStreakColor = getColor(results[i]);
      }
    } else {
      curStreak = 1;
    }
  }

  return { current, maxStreak, maxStreakColor };
}
