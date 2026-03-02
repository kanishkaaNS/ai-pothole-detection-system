import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export default function Sidebar({
  potholes,
  uniquePotholes,
  isDarkMode,
  setIsDarkMode,
  isDensityView,
  setIsDensityView,
  isHeatmapView,
  setIsHeatmapView
}) {
  const total = potholes.length;

  const totalDetections = potholes.reduce((acc, p) => acc + (p.detection_count || 1), 0);

  let lastUpdated = "N/A";
  if (potholes.length > 0) {
    const sortedPotholes = [...potholes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const d = new Date(sortedPotholes[0].timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    lastUpdated = `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Get Top 5 potholes by detection count for the PREVIEW chart
  const topPotholesPreview = uniquePotholes ? [...uniquePotholes]
    .sort((a, b) => b.detection_count - a.detection_count)
    .slice(0, 5)
    .map((p, index) => ({
      name: `P${index + 1}`, // Clean short name for x-axis
      fullName: `Pothole ${p.id}`, // Context for tooltip
      detections: p.detection_count
    })) : [];

  // Get Top 15 potholes by detection count for the FULL chart
  const topPotholesFull = uniquePotholes ? [...uniquePotholes]
    .sort((a, b) => b.detection_count - a.detection_count)
    .slice(0, 15)
    .map((p, index) => ({
      name: `P${index + 1}`,
      fullName: `Pothole ${p.id}`, // Context for tooltip
      detections: p.detection_count
    })) : [];

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div style={cardStyle("#3b82f6", "white")}>
        <div style={labelStyle}>Total Detections</div>
        <div style={valueStyle}>{totalDetections}</div>
      </div>
      <div style={cardStyle("#8b5cf6", "white")}>
        <div style={labelStyle}>Last Updated</div>
        <div style={{ ...valueStyle, fontSize: "16px" }}>{lastUpdated}</div>
      </div>

      <div
        style={{ ...cardStyle(isDensityView ? "#10b981" : "#475569", "white"), cursor: "pointer", marginTop: "12px" }}
        className="ui-interactive-card"
        onClick={() => setIsDensityView(!isDensityView)}
      >
        <div style={labelStyle}>Density View</div>
        <div style={valueStyle}>
          <div style={{
            width: "40px",
            height: "24px",
            backgroundColor: isDensityView ? "#059669" : "#cbd5e1",
            borderRadius: "12px",
            position: "relative",
            transition: "background-color 0.3s"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              backgroundColor: "white",
              borderRadius: "50%",
              position: "absolute",
              top: "2px",
              left: isDensityView ? "18px" : "2px",
              transition: "left 0.3s"
            }} />
          </div>
        </div>
      </div>

      <div
        style={{ ...cardStyle(isHeatmapView ? "#f59e0b" : "#475569", "white"), cursor: "pointer" }}
        className="ui-interactive-card"
        onClick={() => setIsHeatmapView(!isHeatmapView)}
      >
        <div style={labelStyle}>Heatmap View</div>
        <div style={valueStyle}>
          <div style={{
            width: "40px",
            height: "24px",
            backgroundColor: isHeatmapView ? "#d97706" : "#cbd5e1",
            borderRadius: "12px",
            position: "relative",
            transition: "background-color 0.3s"
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              backgroundColor: "white",
              borderRadius: "50%",
              position: "absolute",
              top: "2px",
              left: isHeatmapView ? "18px" : "2px",
              transition: "left 0.3s"
            }} />
          </div>
        </div>
      </div>

      {topPotholesPreview.length > 0 && (
        <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
          <div style={{ ...labelStyle, color: "#94a3b8", marginBottom: "4px" }}>Most Detected Potholes</div>
          <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "12px" }}>Top 5 Preview</div>
          <div style={{ width: "100%", height: "180px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPotholesPreview} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', fontSize: '12px' }}
                  labelFormatter={(label) => {
                    const pothole = topPotholesPreview.find(p => p.name === label);
                    return pothole ? pothole.fullName : label;
                  }}
                />
                <Bar dataKey="detections" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button
            className="ui-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "12px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px"
            }}
          >
            View Full Analytics
          </button>
        </div>
      )}

      {/* Full Analytics Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            width: "80%",
            maxWidth: "900px",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
            border: "1px solid #334155"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "#e2e8f0" }}>Full Detection Analytics (Top 15 Potholes)</h2>
              <button
                className="ui-btn"
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: "#334155",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>

            <div style={{ width: "100%", height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPotholesFull} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#cbd5e1" fontSize={14} tickLine={false} axisLine={false} />
                  <YAxis stroke="#cbd5e1" fontSize={14} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', fontSize: '14px', padding: "12px" }}
                    itemStyle={{ color: '#ef4444', fontWeight: "bold" }}
                    labelFormatter={(label) => {
                      const pothole = topPotholesFull.find(p => p.name === label);
                      return pothole ? pothole.fullName : label;
                    }}
                  />
                  <Bar dataKey="detections" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

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