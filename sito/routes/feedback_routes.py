from flask import Blueprint, jsonify, request
from ..services.save_service import save_feedback

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route("/feedback", methods=["POST"])
def save_feedback_controller():
  try:
    data = request.get_json()
    user_token = request.headers.get('User-Token')
    response = save_feedback(data, user_token)
    return jsonify(response)
  except Exception as e:
    status = 500
    if "non trovata" in str(e):
      status = 400
    
    print("❌ Errore nella scrittura su Excel:", str(e))
    return jsonify({"error": str(e)}), status
