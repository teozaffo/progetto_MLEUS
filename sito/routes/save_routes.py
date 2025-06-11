from flask import Blueprint, request, jsonify
from ..services.save_service import save_diagnosis, save_feedback

save_bp = Blueprint('save', __name__)

@save_bp.route("/salva", methods=["POST"])
def save_diagnosis_controller():
  try:
    response = save_diagnosis(request=request)
    return jsonify(response)
  except Exception as e:
    print("❌ Errore nella scrittura su Excel:", str(e))
    return jsonify({"error": str(e)}), 500

@save_bp.route("/questionario", methods=["POST"])
def save_feedback_controller():
  try:
    response = save_feedback(request=request)
    return jsonify(response)
  except Exception as e:
    status = 500
    if "non trovata" in str(e):
      status = 400
    
    print("❌ Errore nella scrittura su Excel:", str(e))
    return jsonify({"error": str(e)}), status