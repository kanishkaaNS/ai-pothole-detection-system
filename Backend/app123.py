from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

DATABASE_PATH = "potholes.db"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# -----------------------------------
# Helper to fetch potholes
# -----------------------------------
def get_all_potholes():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM potholes")
    rows = cursor.fetchall()
    conn.close()

    potholes = []
    for row in rows:
        potholes.append(dict(row))

    return potholes


# -----------------------------------
# API: Get all potholes
# -----------------------------------
@app.route("/api/potholes", methods=["GET"])
def api_get_potholes():
    potholes = get_all_potholes()
    return jsonify(potholes)


# -----------------------------------
# API: Get pothole details + images
# -----------------------------------
@app.route("/api/pothole/<int:pothole_id>", methods=["GET"])
def api_get_pothole(pothole_id):
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM potholes WHERE id=?", (pothole_id,))
    pothole = cursor.fetchone()

    cursor.execute("SELECT image_path FROM pothole_images WHERE pothole_id=?", (pothole_id,))
    images = cursor.fetchall()

    conn.close()

    if pothole is None:
        return jsonify({"error": "Not found"}), 404

    return jsonify({
        "pothole": dict(pothole),
        "images": [img["image_path"].replace("\\", "/") for img in images]
    })


# -----------------------------------
# Serve image files
# -----------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

@app.route("/images/<path:filename>")
def serve_image(filename):
    filename = filename.replace("\\", "/")
    return send_from_directory(BASE_DIR, filename)

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

if __name__ == "__main__":
    app.run(debug=True)
