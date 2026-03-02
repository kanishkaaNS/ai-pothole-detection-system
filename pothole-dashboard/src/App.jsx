import { useEffect, useState, useMemo } from "react";
import Layout from "./Components/Layout";
import mockData from './mockData.json';

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

function App() {
  const [potholes, setPotholes] = useState(mockData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDensityView, setIsDensityView] = useState(false);
  const [isHeatmapView, setIsHeatmapView] = useState(false);

  // Use the pre-generated mock data directly. 
  // Each entry is already a unique physical pothole.
  const uniquePotholes = potholes;


  // Temporarily using mockData instead of fetching from the backend
  // useEffect(() => {
  //   fetch("http://127.0.0.1:5000/api/potholes")
  //     .then((res) => res.json())
  //     .then((data) => setPotholes(data))
  //     .catch((err) => console.error("Error fetching data:", err));
  // }, []);

  return (
    <Layout
      potholes={potholes}
      uniquePotholes={uniquePotholes}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isDensityView={isDensityView}
      setIsDensityView={setIsDensityView}
      isHeatmapView={isHeatmapView}
      setIsHeatmapView={setIsHeatmapView}
    />
  );
}

export default App;