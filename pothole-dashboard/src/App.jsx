import { useEffect, useState } from "react";
import Layout from "./Components/Layout";

function App() {
  const [potholes, setPotholes] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/potholes")
      .then((res) => res.json())
      .then((data) => setPotholes(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <Layout
      potholes={potholes}
      filterSeverity={filterSeverity}
      setFilterSeverity={setFilterSeverity}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
    />
  );
}

export default App;