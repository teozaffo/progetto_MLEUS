from flask import Blueprint, send_from_directory

pyscript_bp = Blueprint('pyscript', __name__)

@pyscript_bp.route("/pyscript.toml", methods=['GET'])
def send_and_cache_pyscript():
    response = send_from_directory('static', './pyscript.toml')
    response.headers['Cache-Control'] = 'public, max-age=86400'  
    return response

@pyscript_bp.route("/flexible_scaler.py", methods=['GET'])
def send_and_cache_flexible_scaler():
    response = send_from_directory('static/py', './flexible_scaler.py')
    response.headers['Cache-Control'] = 'public, max-age=86400' 
    return response

@pyscript_bp.route("/model_prediction.py", methods=['GET'])
def send_and_cache_model_prediction():
    response = send_from_directory('static/py', './model_prediction.py')
    response.headers['Cache-Control'] = 'public, max-age=86400'
    return response

@pyscript_bp.route("/models/DT.joblib", methods=['GET'])
def send_and_cache_DT_model():
    response = send_from_directory('static/ml_models', './DT.joblib')
    response.headers['Cache-Control'] = 'public, max-age=86400'
    return response

@pyscript_bp.route("/models/RF.joblib", methods=['GET'])
def send_and_cache_RF_model():
    response = send_from_directory('static/ml_models', './RF.joblib')
    response.headers['Cache-Control'] = 'public, max-age=86400'
    return response