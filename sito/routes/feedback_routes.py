from flask import Blueprint, request, jsonify
from ..services.save_service import save_feedback

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route("/feedback", methods=["POST"])
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