import Chip from "./Chip";

const DENOMINATIONS = [1, 5, 25, 100, 500];

export default function ChipRack({ selected, onSelect }) {
  return (
    <div className="chip-rack">
      <div className="chip-rack-label">Nominał żetonu</div>
      <div className="chip-rack-row">
        {DENOMINATIONS.map((v) => (
          <Chip
            key={v}
            value={v}
            size={48}
            selected={selected === v}
            onClick={() => onSelect(v)}
          />
        ))}
      </div>
    </div>
  );
}
