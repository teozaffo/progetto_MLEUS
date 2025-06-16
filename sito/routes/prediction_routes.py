from flask import Blueprint, request,jsonify
from ..services.model_prediction import predict_input

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route("/model_prediction", methods=['POST'])
def model_predict():
  try:
    return jsonify(predict_input())
  except Exception as e:
    print(f"Encountered Error: {str(e)}")
    return jsonify({"error": str(e)}), 500