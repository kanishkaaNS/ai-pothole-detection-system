import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ data }) {
    const map = useMap();

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Data format for leaflet.heat is [lat, lng, intensity]
        const points = data.map(p => [
            p.latitude,
            p.longitude,
            Math.min(p.detection_count * 0.08, 0.64) // Reduced by 20% to soften heatmap intensity
        ]);

        const heatLayer = L.heatLayer(points, {
            radius: 70, // Increase radius significantly to widen coverage area
            blur: 40,   // Increase blur to make it smoother
            maxZoom: 15,
            gradient: {
                0.3: "#eab308", // Lighter Yellow (like Tailwind yellow-500)
                0.6: "#f97316", // Lighter Orange (like Tailwind orange-500)
                0.8: "#ef4444", // Bright Red (like Tailwind red-500)
                1.0: "#c82727"  // Custom bright/dark Red requested by user
            }
        });

        heatLayer.addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, data]);

    return null;
}
