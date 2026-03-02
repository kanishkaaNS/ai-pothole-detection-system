import json
import random
from datetime import datetime, timedelta

def generate_potholes():
    potholes = []
    pid = 1
    
    # 1. Small cluster (Indiranagar) - 5 potholes
    center1 = (12.9783, 77.6408)
    for i in range(5):
        lat = center1[0] + random.uniform(-0.005, 0.005)
        lon = center1[1] + random.uniform(-0.005, 0.005)
        potholes.append({
            "id": pid, "latitude": lat, "longitude": lon, 
            "frame_count": random.randint(1, 5),
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 48))).strftime("%Y-%m-%d %H:%M:%S")
        })
        pid += 1

    # 2. Medium cluster (Koramangala) - 13 potholes
    center2 = (12.9279, 77.6271)
    for i in range(13):
        lat = center2[0] + random.uniform(-0.008, 0.008)
        lon = center2[1] + random.uniform(-0.008, 0.008)
        potholes.append({
            "id": pid, "latitude": lat, "longitude": lon, 
            "frame_count": random.randint(2, 7),
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 48))).strftime("%Y-%m-%d %H:%M:%S")
        })
        pid += 1

    # 3. Large cluster (Whitefield) - 25 potholes
    center3 = (12.9698, 77.7499)
    for i in range(25):
        lat = center3[0] + random.uniform(-0.015, 0.015)
        lon = center3[1] + random.uniform(-0.015, 0.015)
        potholes.append({
            "id": pid, "latitude": lat, "longitude": lon, 
            "frame_count": random.randint(3, 10),
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 48))).strftime("%Y-%m-%d %H:%M:%S")
        })
        pid += 1

    # 4. Road segment (Outer Ring Road) - 8 potholes along a line
    start = (12.9250, 77.6400)
    end = (12.9400, 77.6800)
    for i in range(8):
        fraction = i / 7.0
        lat = start[0] + fraction * (end[0] - start[0]) + random.uniform(-0.0005, 0.0005)
        lon = start[1] + fraction * (end[1] - start[1]) + random.uniform(-0.0005, 0.0005)
        potholes.append({
            "id": pid, "latitude": lat, "longitude": lon, 
            "frame_count": random.randint(2, 8),
            "timestamp": (datetime.now() - timedelta(hours=random.randint(1, 48))).strftime("%Y-%m-%d %H:%M:%S"),
            "road_segment_id": "ORR_Stretch_1"
        })
        pid += 1

    with open("c:/Users/kanishkaa/OneDrive/Documents/WD/research paper/pothole-dashboard/src/mockData.json", "w") as f:
        json.dump(potholes, f, indent=2)

if __name__ == "__main__":
    generate_potholes()
