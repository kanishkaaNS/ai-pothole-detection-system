export default function Sidebar({ potholes, filterSeverity, setFilterSeverity, isDarkMode, setIsDarkMode }) {
  const total = potholes.length;
  const high = potholes.filter((p) => p.severity_score >= 0.7).length;
  const medium = potholes.filter(
    (p) => p.severity_score >= 0.4 && p.severity_score < 0.7
  ).length;
  const low = potholes.filter((p) => p.severity_score < 0.4).length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "280px",
        gap: "12px",
        background: "#0f172a",
        padding: "20px 16px",
        color: "white",
        borderRight: "1px solid #1e293b",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "18px", color: "#e2e8f0" }}>Dashboard Summary</h3>

      <div style={cardStyle("#334155", "white")}>
        <div style={labelStyle}>Total Potholes</div>
        <div style={valueStyle}>{total}</div>
      </div>
      <div style={cardStyle("#ef4444", "white")}>
        <div style={labelStyle}>High Severity</div>
        <div style={valueStyle}>{high}</div>
      </div>
      <div style={cardStyle("#f59e0b", "black")}>
        <div style={labelStyle}>Medium Severity</div>
        <div style={valueStyle}>{medium}</div>
      </div>
      <div style={cardStyle("#10b981", "white")}>
        <div style={labelStyle}>Low Severity</div>
        <div style={valueStyle}>{low}</div>
      </div>

      <hr style={{ borderColor: "#334155", margin: "10px 0", width: "100%" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label style={{ fontSize: "14px", fontWeight: "bold" }}>Severity Filter</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "#1e293b", padding: "12px", borderRadius: "8px", border: "1px solid rgba(51, 65, 85, 0.4)" }}>
          {["All", "High", "Medium", "Low"].map((level) => (
            <label key={level} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
              <input
                type="radio"
                name="severityFilter"
                value={level}
                checked={filterSeverity === level}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{ accentColor: "#3b82f6", cursor: "pointer" }}
              />
              {level === "All" ? "All Severities" : `${level} Only`}
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}

const cardStyle = (bg, color) => ({
  backgroundColor: bg,
  color: color,
  padding: "12px 16px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const labelStyle = {
  fontSize: "12px",
  textTransform: "uppercase",
  fontWeight: "600",
  opacity: 0.9,
  marginBottom: "2px",
};

const valueStyle = {
  fontSize: "20px",
  fontWeight: "bold",
};