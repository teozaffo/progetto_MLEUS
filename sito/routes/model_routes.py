from flask import Blueprint, jsonify, request
from ..services.model_prediction_service import predict_input, get_mandatory_features

model_bp = Blueprint('model', __name__)

@model_bp.route("/model_prediction", methods=['POST'])
def model_predict():
  try:
    data = request.get_json()
    
    if request.headers.getlist("X-Forwarded-For"):
      client_ip = request.headers.getlist("X-Forwarded-For")[0].split(',')[0].strip()
    else:
      client_ip = request.remote_addr
      
    data["Ip"] = client_ip
    return jsonify(predict_input(data))
  except Exception as e:
    print(f"Encountered Error: {str(e)}")
    return jsonify({"error": str(e)}), 500

  
@model_bp.route("/mandatory_features", methods=['GET'])
def fetch_mandatory_features():
  try:
    return jsonify(get_mandatory_features())
  except Exception as e:
    print(f"Encountered Error: {str(e)}")
    return jsonify({"error": str(e)}), 500
