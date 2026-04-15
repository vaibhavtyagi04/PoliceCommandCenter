from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random

app = Flask(__name__)
CORS(app)

# Enhanced crime classification logic
def classify_text(text):
    text = text.lower()
    categories = {
        "Theft": ["stolen", "robbery", "thief", "picked", "snatched", "burglary"],
        "Cyber Crime": ["online", "scam", "fraud", "hacked", "phishing", "transaction"],
        "Violence": ["assault", "beat", "hit", "attacked", "weapon", "blood", "threat"],
        "Harassment": ["teasing", "stalking", "abuse", "harassed", "following"],
        "Missing Person": ["disappeared", "missing", "not seen", "lost child"],
        "Fraud": ["cheated", "fake", "duplicate", "money lost", "investment"]
    }
    
    found_categories = []
    for cat, keywords in categories.items():
        if any(kw in text for kw in keywords):
            found_categories.append(cat)
            
    if not found_categories:
        return "Generic/Other", "Medium", 0.6
    
    # Priority logic
    primary = found_categories[0]
    priority = "High" if primary in ["Violence", "Missing Person"] else "Medium"
    confidence = 0.85 if len(found_categories) == 1 else 0.7
    
    return primary, priority, confidence

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    description = data.get('description', '')
    if not description:
        return jsonify({"error": "No description provided"}), 400
        
    category, priority, confidence = classify_text(description)
    return jsonify({
        "category": category,
        "priority": priority,
        "confidence": confidence
    })

@app.route('/hotspots', methods=['GET'])
def get_hotspots():
    # Simulate high-risk areas in a region (e.g., Delhi area)
    base_lat, base_lng = 28.6139, 77.2090
    hotspots = []
    for _ in range(15):
        hotspots.append({
            "lat": base_lat + (random.random() - 0.5) * 0.1,
            "lng": base_lng + (random.random() - 0.5) * 0.1,
            "intensity": random.random()
        })
    return jsonify(hotspots)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "AI Classification Engine"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
