from flask import Flask, jsonify, request
import json
import re
from flask_cors import CORS  # Import the CORS module
from model import generate_charts_data, generate_summary, generate_full_report

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

def parse_agent_response(response):
    """Extract and parse JSON from agent string response, if wrapped in triple backticks."""
    if isinstance(response, str):
        match = re.search(r'```json\s*(.*?)\s*```', response, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError as e:
                return {"error": "Invalid JSON from agent", "details": str(e)}
        else:
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {"error": "Could not extract JSON from response"}
    return response  # already a dict

@app.route('/get-report', methods=['GET'])
def get_report():
    with open('user1.json', 'r') as file:
        json_data = json.load(file)
    report = generate_full_report(json_data)
    print(type(report))
    return jsonify({"data": report}) 

@app.route('/get-charts', methods=['GET'])
def get_charts():
    with open('user1.json', 'r') as file:
        json_data = json.load(file)
    chart_data = generate_charts_data(json_data)
    return jsonify(parse_agent_response(chart_data))

@app.route('/get-summary', methods=['GET'])
def get_summary_insight():
    with open('user1.json', 'r') as file:
        json_data = json.load(file)
    summary = generate_summary(json_data)
    return jsonify({"data": summary}) 

if __name__ == '__main__':
    app.run(debug=True)
