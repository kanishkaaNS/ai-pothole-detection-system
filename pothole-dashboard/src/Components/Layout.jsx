import Header from "./Header.jsx";
import Sidebar from "./SideBar.jsx";
import MapComponent from "./MapComponent.jsx";

export default function Layout({ potholes, filterSeverity, setFilterSeverity, isDarkMode, setIsDarkMode }) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div style={{ display: "flex", flexDirection: "row", height: "calc(100vh - 54px)" }}>
        <Sidebar
          potholes={potholes}
          filterSeverity={filterSeverity}
          setFilterSeverity={setFilterSeverity}
        />

        <div style={{ flex: 1, height: "100%", position: "relative" }}>
          <MapComponent
            potholes={potholes}
            filterSeverity={filterSeverity}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
}