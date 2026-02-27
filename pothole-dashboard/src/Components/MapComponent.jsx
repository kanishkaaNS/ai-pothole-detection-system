// MapComponent.jsx

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Function to auto-fit map bounds
function FitBounds({ potholes }) {
  const map = useMap();

  useEffect(() => {
    // Added a small timeout so that the DOM can render the layout correctly
    // before we calculate the bounds. This helps fix grey tile issues initially.
    setTimeout(() => {
      map.invalidateSize();

      if (potholes && potholes.length > 0) {
        const bounds = L.latLngBounds(
          potholes.map(p => [p.latitude, p.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        // Fallback default
        map.setView([13.0317, 77.6098], 14);
      }
    }, 100);
  }, [potholes, map]);

  return null;
}

// Severity-based marker color for CircleMarker
function getMarkerOptions(severity) {
  if (severity >= 0.7) return { color: "#ef4444", fillColor: "#ef4444" }; // Red
  if (severity >= 0.4) return { color: "#f59e0b", fillColor: "#f59e0b" }; // Yellow
  return { color: "#10b981", fillColor: "#10b981" }; // Green
}

export default function MapComponent({ potholes, filterSeverity, isDarkMode }) {
  // Filter logic
  const filteredPotholes = potholes.filter((p) => {
    if (filterSeverity === "High") return p.severity_score >= 0.7;
    if (filterSeverity === "Medium") return p.severity_score >= 0.4 && p.severity_score < 0.7;
    if (filterSeverity === "Low") return p.severity_score < 0.4;
    return true; // "All"
  });

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }} className={isDarkMode ? "dark-map" : ""}>
      <MapContainer
        center={[13.0317, 77.6098]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds potholes={filteredPotholes} />

        {filteredPotholes.map((p) => {
          const style = getMarkerOptions(p.severity_score);
          return (
            <CircleMarker
              key={p.id}
              center={[p.latitude, p.longitude]}
              radius={8}
              color={style.color}
              fillColor={style.fillColor}
              fillOpacity={0.8}
              weight={2}
              className="pulsing-marker"
              eventHandlers={{
                mouseover: (e) => {
                  e.target.setRadius(12);
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  e.target.setRadius(8);
                },
              }}
            >
              <Popup closeButton={false}>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px" }}>
                  <strong style={{ fontSize: "15px", color: style.color }}>
                    {p.severity_score >= 0.7 ? "High" : p.severity_score >= 0.4 ? "Medium" : "Low"} Severity
                  </strong>
                  <br />
                  <span style={{ color: "#555" }}>Score: {p.severity_score.toFixed(2)}</span>
                  <hr style={{ margin: "5px 0", border: "0", borderTop: "1px solid #ddd" }} />
                  <strong>Time:</strong> {p.timestamp} <br />
                  <strong>Coords:</strong> {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
        background: isDarkMode ? "#0f172a" : "white",
        padding: "15px 20px",
        borderRadius: "12px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        zIndex: 1000,
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: isDarkMode ? "white" : "#333",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <h4 style={{ margin: "0 0 5px 0", fontSize: "15px", fontWeight: "bold", borderBottom: isDarkMode ? "1px solid #1e293b" : "1px solid #eee", paddingBottom: "5px" }}>Severity Legend</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }}></span> High Severity (&ge; 0.7)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }}></span> Medium Severity (0.4 - 0.7)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "12px", height: "12px", borderRadius: "50%", background: "#10b981" }}></span> Low Severity (&lt; 0.4)
        </div>
      </div>
    </div>
  );
}