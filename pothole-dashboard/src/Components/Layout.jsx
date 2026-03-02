import Header from "./Header.jsx";
import Sidebar from "./SideBar.jsx";
import MapComponent from "./MapComponent.jsx";

export default function Layout({
  potholes,
  uniquePotholes,
  isDarkMode,
  setIsDarkMode,
  isDensityView,
  setIsDensityView,
  isHeatmapView,
  setIsHeatmapView
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div style={{ display: "flex", flexDirection: "row", height: "calc(100vh - 54px)" }}>
        <Sidebar
          potholes={potholes}
          uniquePotholes={uniquePotholes}
          isDensityView={isDensityView}
          setIsDensityView={setIsDensityView}
          isHeatmapView={isHeatmapView}
          setIsHeatmapView={setIsHeatmapView}
        />

        <div style={{ flex: 1, height: "100%", position: "relative" }}>
          <MapComponent
            potholes={potholes}
            uniquePotholes={uniquePotholes}
            isDarkMode={isDarkMode}
            isDensityView={isDensityView}
            isHeatmapView={isHeatmapView}
          />
        </div>
      </div>
    </div>
  );
}