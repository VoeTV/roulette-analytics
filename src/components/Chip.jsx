import { colorOf } from "../utils/roulette";

// Chip color tiers by denomination — like real casino chips
export function chipStyle(value) {
  if (value >= 500) return { bg: "#4b0e8b", stripe: "#d4af37", text: "#fff" };  // purple/gold
  if (value >= 100) return { bg: "#0d0d0d", stripe: "#d4af37", text: "#fff" };  // black/gold
  if (value >= 25)  return { bg: "#1a6e2c", stripe: "#fff",    text: "#fff" };  // green
  if (value >= 10)  return { bg: "#1f50a8", stripe: "#fff",    text: "#fff" };  // blue
  if (value >= 5)   return { bg: "#b51a1a", stripe: "#fff",    text: "#fff" };  // red
  return { bg: "#e8e8e8", stripe: "#1a1a1a", text: "#1a1a1a" };                 // white
}

export function formatChip(value) {
  if (value >= 1000) return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "K";
  return String(value);
}

export default function Chip({ value, size = 36, selected = false, onClick, title }) {
  const s = chipStyle(value);
  return (
    <button
      className={"chip" + (selected ? " chip-selected" : "")}
      style={{
        width: size,
        height: size,
        background: s.bg,
        color: s.text,
        boxShadow: `inset 0 0 0 3px ${s.stripe}, inset 0 0 0 4px ${s.bg}, 0 4px 8px rgba(0,0,0,0.5)`,
      }}
      onClick={onClick}
      title={title || `Żeton ${value} $`}
      type="button"
    >
      <span className="chip-inner" style={{ borderColor: s.stripe }}>
        {formatChip(value)}
      </span>
    </button>
  );
}
