from flask import Blueprint, request

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route("/model_prediction", methods=['POST'])
def predict():
  return