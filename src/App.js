import { useState, useCallback } from "react";

const AMENITIES = [
  { id: "ensuite", label: "En-suite bathroom", value: 8 },
  { id: "wardrobe", label: "Built-in wardrobe", value: 3 },
  { id: "window", label: "Extra windows / natural light", value: 3 },
  { id: "balcony", label: "Balcony / outdoor access", value: 6 },
  { id: "desk", label: "Dedicated desk space", value: 2 },
  { id: "quiet", label: "Quieter / away from street", value: 3 },
];

const COLORS = ["#E8C547", "#F28B50", "#E05C7A", "#7B6CF6", "#4ECDC4", "#A8E063"];

function RoomCard({ room, index, onUpdate, onRemove, totalRooms }) {
  const color = COLORS[index % COLORS.length];
  const toggleAmenity = (id) => {
    const current = room.amenities || [];
    const updated = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    onUpdate(index, { amenities: updated });
  };

  return (
    <div style={{
      background: "#0f0f0f", border: `1px solid ${color}33`,
      borderTop: `3px solid ${color}`, borderRadius: "12px",
      padding: "24px", position: "relative",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%", background: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: "700", color: "#000"
          }}>{index + 1}</div>
          <input
            value={room.name}
            onChange={(e) => onUpdate(index, { name: e.target.value })}
            placeholder={`Room ${index + 1} name`}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: "16px", fontFamily: "inherit",
              fontWeight: "600", width: "160px"
            }}
          />
        </div>
        {totalRooms > 2 && (
          <button onClick={() => onRemove(index)} style={{
            background: "transparent", border: "none", color: "#555",
            cursor: "pointer", fontSize: "18px", padding: "4px 8px",
            borderRadius: "6px", fontFamily: "inherit"
          }}>×</button>
        )}
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ color: "#888", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
          Room size (m²)
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input type="range" min="5" max="50" step="0.5"
            value={room.size}
            onChange={(e) => onUpdate(index, { size: parseFloat(e.target.value) })}
            style={{ flex: 1, accentColor: color, cursor: "pointer" }}
          />
          <span style={{ color, fontWeight: "700", fontSize: "20px", minWidth: "50px", textAlign: "right" }}>
            {room.size}m²
          </span>
        </div>
      </div>

      <div>
        <label style={{ color: "#888", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
          Amenities
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {AMENITIES.map((a) => {
            const active = (room.amenities || []).includes(a.id);
            return (
              <button key={a.id} onClick={() => toggleAmenity(a.id)} style={{
                padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
                border: `1px solid ${active ? color : "#333"}`,
                background: active ? `${color}22` : "transparent",
                color: active ? color : "#666",
                cursor: "pointer", fontFamily: "inherit"
              }}>{a.label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResultBar({ room, amount, percent, index }) {
  const color = COLORS[index % COLORS.length];
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
          <span style={{ color: "#fff", fontWeight: "600", fontSize: "15px" }}>{room.name || `Room ${index + 1}`}</span>
        </div>
        <div>
          <span style={{ color, fontWeight: "800", fontSize: "24px" }}>£{amount.toFixed(0)}</span>
          <span style={{ color: "#555", fontSize: "13px", marginLeft: "6px" }}>/mo</span>
        </div>
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
        <div style={{ width: `${Math.round(percent)}%`, height: "100%", background: color, borderRadius: "4px" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
        <span style={{ color: "#444", fontSize: "11px" }}>{Math.round(percent)}% of total</span>
        <span style={{ color: "#444", fontSize: "11px" }}>
          {room.size}m²{(room.amenities || []).length > 0 ? ` · ${(room.amenities || []).length} extra${(room.amenities || []).length > 1 ? "s" : ""}` : ""}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const [totalRent, setTotalRent] = useState(1800);
  const [rooms, setRooms] = useState([
    { name: "Your room", size: 14, amenities: ["ensuite"] },
    { name: "Flatmate", size: 11, amenities: [] },
  ]);
  const [copied, setCopied] = useState(false);

  const updateRoom = useCallback((index, updates) => {
    setRooms((prev) => prev.map((r, i) => i === index ? { ...r, ...updates } : r));
  }, []);

  const removeRoom = useCallback((index) => {
    setRooms((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const scores = rooms.map((r) => {
    const amenityScore = (r.amenities || []).reduce((sum, id) => {
      const found = AMENITIES.find((a) => a.id === id);
      return sum + (found ? found.value : 0);
    }, 0);
    return r.size + amenityScore;
  });

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const splits = scores.map((s) => ({
    amount: totalScore > 0 ? (s / totalScore) * totalRent : totalRent / rooms.length,
    percent: totalScore > 0 ? (s / totalScore) * 100 : 100 / rooms.length,
  }));

  const copyResults = () => {
    const lines = rooms.map((r, i) => `${r.name || `Room ${i + 1}`}: £${splits[i].amount.toFixed(0)}/mo`);
    navigator.clipboard.writeText(`Fair Rent Split\nTotal: £${totalRent}/mo\n\n${lines.join("\n")}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#080808", color: "#fff",
      fontFamily: "'DM Mono', 'Courier New', monospace", padding: "40px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 4px; background: #222; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; }
        ::placeholder { color: #444; }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ marginBottom: "48px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#E8C547", textTransform: "uppercase", marginBottom: "12px" }}>
            ◈ Fair Split Calculator
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: "800", lineHeight: 1, margin: "0 0 16px",
            background: "linear-gradient(135deg, #fff 0%, #888 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Who pays<br />what?</h1>
          <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Split rent by room size and amenities — not just headcount.
          </p>
        </div>

        <div style={{ background: "#0f0f0f", border: "1px solid #222", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <label style={{ color: "#888", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "12px" }}>
            Total monthly rent (£)
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#E8C547", fontSize: "28px", fontWeight: "500" }}>£</span>
            <input type="number" value={totalRent}
              onChange={(e) => setTotalRent(parseFloat(e.target.value) || 0)}
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "36px", fontWeight: "500", fontFamily: "inherit", width: "160px" }}
            />
            <span style={{ color: "#444", fontSize: "14px" }}>/month</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "16px" }}>
          {rooms.map((room, i) => (
            <RoomCard key={i} room={room} index={i} onUpdate={updateRoom} onRemove={removeRoom} totalRooms={rooms.length} />
          ))}
        </div>

        <button onClick={() => setRooms(prev => [...prev, { name: `Room ${prev.length + 1}`, size: 10, amenities: [] }])}
          style={{
            width: "100%", padding: "14px", borderRadius: "12px", border: "1px dashed #333",
            background: "transparent", color: "#555", fontSize: "14px", cursor: "pointer",
            fontFamily: "inherit", marginBottom: "40px"
          }}>+ Add another room</button>

        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: "800", margin: 0 }}>Fair split</h2>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total</div>
              <div style={{ color: "#E8C547", fontWeight: "700", fontSize: "22px" }}>£{totalRent}/mo</div>
            </div>
          </div>
          {splits.map((s, i) => (
            <ResultBar key={i} room={rooms[i]} amount={s.amount} percent={s.percent} index={i} />
          ))}
        </div>

        <button onClick={copyResults} style={{
          width: "100%", padding: "16px", borderRadius: "12px",
          background: copied ? "#1a2e1a" : "#E8C547",
          border: "none", color: copied ? "#4ECDC4" : "#000",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
          fontFamily: "inherit", letterSpacing: "0.05em"
        }}>{copied ? "✓ Copied to clipboard" : "Copy results to share"}</button>

        <p style={{ textAlign: "center", color: "#333", fontSize: "11px", marginTop: "32px" }}>
          Fairness score based on floor area + amenity weighting
        </p>
      </div>
    </div>
  );
}
