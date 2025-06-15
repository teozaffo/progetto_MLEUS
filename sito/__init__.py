from flask import Flask
from .routes.pages_routes import pages_bp
from .routes.prediction_routes import prediction_bp
from.routes.feedback_routes import feedback_bp

def create_app():
  app = Flask(__name__)
  app.register_blueprint(pages_bp)
  app.register_blueprint(prediction_bp)
  app.register_blueprint(feedback_bp)
  return app