import fs from 'fs';

const POTHOLES_TO_GENERATE = [];
let idCounter = 1;

// Helper to generate unique potholes around a center
function generateCluster(centerLat, centerLon, numPotholes, severityMultiplier = 1) {
    const roadSegmentId = `cluster_zone_${idCounter}`;

    for (let i = 0; i < numPotholes; i++) {
        // Spread the potholes within ~200m - 300m
        const latOffset = (Math.random() - 0.5) * 0.003;
        const lonOffset = (Math.random() - 0.5) * 0.003;

        // Spread out timestamps over the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        POTHOLES_TO_GENERATE.push({
            id: idCounter++,
            latitude: centerLat + latOffset,
            longitude: centerLon + lonOffset,
            timestamp: date.toISOString(),
            // Ensure detection_count is at least 1, and scale it based on the severity
            detection_count: Math.floor(Math.random() * 10 * severityMultiplier) + 1,
            road_segment_id: roadSegmentId
        });
    }
}

// 1. Large Cluster (High Density -> Red)
// Needs > 20 within 4km radius
generateCluster(12.9716, 77.5946, 25, 3); // MG Road Area

// 2. Medium Clusters (Medium Density -> Orange)
// Needs 10 - 19 within 4km radius
generateCluster(12.9352, 77.6245, 15, 2); // Koramangala
generateCluster(13.0298, 77.5897, 12, 2); // Hebbal

// 3. Small Clusters (Low Density -> Yellow)
// Needs < 10 within 4km radius
generateCluster(12.9279, 77.6271, 8, 1);  // BTM Layout
generateCluster(12.9698, 77.7500, 7, 1);  // Whitefield Zone A
generateCluster(12.9750, 77.7550, 6, 1);  // Whitefield Zone B
generateCluster(13.0068, 77.5816, 5, 1);  // Malleshwaram
generateCluster(13.0080, 77.5800, 4, 1);
generateCluster(12.9121, 77.6446, 3, 1);  // HSR Layout
generateCluster(12.9850, 77.5350, 3, 1);  // West Bangalore (Vijayanagar)
generateCluster(12.9050, 77.5850, 2, 1);  // JP Nagar

// Exactly 90 potholes created! Let's double check it.
if (POTHOLES_TO_GENERATE.length !== 90) {
    console.error(`Expected 90 potholes, but got ${POTHOLES_TO_GENERATE.length}!`);
    process.exit(1);
}

// Write to file
fs.writeFileSync('src/mockData.json', JSON.stringify(POTHOLES_TO_GENERATE, null, 2));
console.log(`Generated exactly ${POTHOLES_TO_GENERATE.length} unique potholes across varied clusters!`);
