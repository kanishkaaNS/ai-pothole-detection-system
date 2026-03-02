// MapComponent.jsx

import { MapContainer, TileLayer, Marker, Circle, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import HeatmapLayer from "./HeatmapLayer";

// Fix for default marker icons in React Leaflet - Changed to RED
const DefaultIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Haversine distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
        map.fitBounds(bounds, {
          padding: [50, 50],
          animate: true,
          duration: 1.2,
          easeLinearity: 0.25
        });
      } else {
        // Fallback default
        map.setView([13.0317, 77.6098], 14, {
          animate: true,
          duration: 1.2
        });
      }
    }, 100);
  }, [potholes, map]);

  return null;
}

export default function MapComponent({ potholes, uniquePotholes, isDarkMode, isDensityView, isHeatmapView }) {
  const [zoomLevel, setZoomLevel] = useState(12);

  // Component to track map zoom level
  function ZoomListener() {
    const map = useMap();
    useEffect(() => {
      // Set initial zoom
      setZoomLevel(map.getZoom());

      const onZoomEnd = () => {
        setZoomLevel(map.getZoom());
      };
      map.on('zoomend', onZoomEnd);
      return () => {
        map.off('zoomend', onZoomEnd);
      };
    }, [map]);
    return null;
  }

  // Calculate clusters when in density view
  const clusters = useMemo(() => {
    if (!isDensityView) return [];

    // Group points that are within ~4.0km of each other
    let unvisited = uniquePotholes ? [...uniquePotholes] : [...potholes];
    const groupedClusters = [];

    while (unvisited.length > 0) {
      const p = unvisited.pop();
      const cluster = [p];

      // Find all neighbors
      for (let i = unvisited.length - 1; i >= 0; i--) {
        const other = unvisited[i];
        if (getDistance(p.latitude, p.longitude, other.latitude, other.longitude) < 4.0) {
          cluster.push(other);
          unvisited.splice(i, 1);
        }
      }

      // Calculate centroid
      const centerLat = cluster.reduce((sum, item) => sum + item.latitude, 0) / cluster.length;
      const centerLon = cluster.reduce((sum, item) => sum + item.longitude, 0) / cluster.length;

      // Determine size and color
      let color = "#eab308"; // Yellow (Low density)
      let radius = 800;
      if (cluster.length >= 20) {
        color = "#ef4444"; // Red (High density)
        radius = 2500;
      } else if (cluster.length >= 10) {
        color = "#f97316"; // Orange (Medium density)
        radius = 1600;
      }

      groupedClusters.push({
        id: `cluster-${p.id}`,
        center: [centerLat, centerLon],
        count: cluster.length,
        color,
        radius
      });
    }

    return groupedClusters;
  }, [potholes, isDensityView]);

  // Group road segments for Polylines
  const roadSegments = useMemo(() => {
    if (!isDensityView) return [];

    const segmentsMap = {};
    const dataset = uniquePotholes || potholes;
    dataset.forEach(p => {
      if (p.road_segment_id) {
        if (!segmentsMap[p.road_segment_id]) {
          segmentsMap[p.road_segment_id] = [];
        }
        segmentsMap[p.road_segment_id].push(p);
      }
    });

    return Object.entries(segmentsMap).map(([id, points]) => {
      // Sort points by longitude or latitude to form a continuous line
      // For simple stretches, sorting by longitude is a fair approximation
      const sortedPoints = [...points].sort((a, b) => a.longitude - b.longitude);
      return {
        id,
        positions: sortedPoints.map(p => [p.latitude, p.longitude])
      };
    });
  }, [potholes, isDensityView]);


  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }} className={isDarkMode ? "dark-map" : ""}>
      <MapContainer
        center={[13.0317, 77.6098]}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        zoomSnap={0.1}
        zoomDelta={0.5}
        wheelDebounceTime={20}
        wheelPxPerZoomLevel={80}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
        zoomAnimationThreshold={10}
      >
        <ZoomListener />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds potholes={uniquePotholes || potholes} />

        {isHeatmapView && <HeatmapLayer data={uniquePotholes || potholes} />}

        {(!isDensityView || zoomLevel >= 14) && (uniquePotholes || potholes).map((p) => {
          // Calculate smaller size if zoomed in during density view
          const isSmall = isDensityView && zoomLevel >= 14;
          const markerIcon = isSmall ? L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [12, 20],      // Roughly half size
            iconAnchor: [6, 20],     // Anchor at bottom center
            popupAnchor: [1, -17],   // Adjust popup relative to smaller icon
            shadowSize: [20, 20]     // Smaller shadow
          }) : DefaultIcon;

          return (
            <Marker
              key={`marker-${p.id}`}
              position={[p.latitude, p.longitude]}
              icon={markerIcon}
            >
              <Popup>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", width: "220px" }}>
                  <strong style={{ fontSize: "15px", color: "#3b82f6" }}>
                    Detections: {p.detection_count || 1}
                  </strong>

                  {/* Image Viewer Placeholder */}
                  <div style={{
                    width: "100%",
                    height: "140px",
                    backgroundColor: "#e2e8f0",
                    border: "2px dashed #94a3b8",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "8px",
                    marginBottom: "8px",
                    color: "#64748b",
                    fontWeight: "bold",
                    letterSpacing: "1px"
                  }}>
                    IMAGE
                  </div>

                  <hr style={{ margin: "5px 0", border: "0", borderTop: "1px solid #ddd" }} />
                  <strong>Latest:</strong> {(() => {
                    const d = new Date(p.latest_timestamp || p.timestamp);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = String(d.getFullYear()).slice(-2);
                    const hours = String(d.getHours()).padStart(2, '0');
                    const minutes = String(d.getMinutes()).padStart(2, '0');
                    return `${day}/${month}/${year} ${hours}:${minutes}`;
                  })()} <br />
                  <strong>Coords:</strong> {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {isDensityView && clusters.map(c => (
          <Circle
            key={c.id}
            center={c.center}
            radius={c.radius}
            pathOptions={{
              color: c.color,
              fillColor: c.color,
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Popup>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px", minWidth: "150px" }}>
                <strong style={{ color: c.color, display: "block", marginBottom: "5px" }}>Cluster Info</strong>
                <strong>Density:</strong> {c.count} potholes detected <br />
                <em>({c.color === "#ef4444" ? "High" : c.color === "#f97316" ? "Medium" : "Low"} severity area)</em>
              </div>
            </Popup>
          </Circle>
        ))}

        {isDensityView && roadSegments.map(rs => (
          <Polyline
            key={`line-${rs.id}`}
            positions={rs.positions}
            pathOptions={{ color: "#ef4444", weight: 5, opacity: 0.8, dashArray: "10, 10" }}
          >
            <Popup>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
                <strong style={{ color: "#ef4444" }}>Repeated Damage Route</strong><br />
                {rs.id.replace(/_/g, " ")}
              </div>
            </Popup>
          </Polyline>
        ))}

      </MapContainer>

      {/* Density View Legend */}
      {isDensityView && (
        <div style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          zIndex: 1000,
          fontFamily: "Arial, sans-serif",
          fontSize: "13px"
        }}>
          <strong style={{ display: "block", marginBottom: "8px", color: "#334155" }}>Density Severity</strong>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ width: "14px", height: "14px", backgroundColor: "#eab308", borderRadius: "50%", marginRight: "8px", border: "1px solid rgba(0,0,0,0.1)" }}></div>
            <span style={{ color: "#475569" }}>Low Density (&lt; 10)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <div style={{ width: "14px", height: "14px", backgroundColor: "#f97316", borderRadius: "50%", marginRight: "8px", border: "1px solid rgba(0,0,0,0.1)" }}></div>
            <span style={{ color: "#475569" }}>Medium Density (10 - 19)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ width: "14px", height: "14px", backgroundColor: "#ef4444", borderRadius: "50%", marginRight: "8px", border: "1px solid rgba(0,0,0,0.1)" }}></div>
            <span style={{ color: "#475569" }}>High Density (20+)</span>
          </div>
        </div>
      )}

    </div>
  );
}