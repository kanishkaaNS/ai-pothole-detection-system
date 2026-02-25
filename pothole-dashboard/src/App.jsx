import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// Fix default marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function App() {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/potholes")
      .then((res) => res.json())
      .then((data) => {
        setPotholes(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const total = potholes.length;
  const high = potholes.filter((p) => p.severity_score >= 0.7).length;
  const medium = potholes.filter(
    (p) => p.severity_score >= 0.4 && p.severity_score < 0.7
  ).length;
  const low = potholes.filter((p) => p.severity_score < 0.4).length;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          padding: "16px",
          backgroundColor: "#1e3a8a",
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        AI-Based Automated Pothole Detection and Mapping System
      </header>

      <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
        <div
          style={{
            width: "300px",
            background: "#000000",
            padding: "20px",
            borderRight: "1px solid #ddd",
          }}
        >
          <h3>Dashboard Overview</h3>
          <p>Total Potholes: {total}</p>
          <p>High Severity: {high}</p>
          <p>Medium Severity: {medium}</p>
          <p>Low Severity: {low}</p>
        </div>

        <div style={{ flex: 1 }}>
          <MapContainer
            center={[13.0317, 77.6098]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {potholes.map((p) => (
              <Marker key={p.id} position={[p.latitude, p.longitude]}>
                <Popup>
                  <b>Pothole ID:</b> {p.id} <br />
                  <b>Severity:</b> {p.severity_score.toFixed(2)} <br />
                  <b>Frames:</b> {p.frame_count} <br />
                  <b>Date:</b> {p.timestamp}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default App;