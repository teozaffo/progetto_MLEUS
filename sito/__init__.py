from flask import Flask
from .routes.pages_routes import pages_bp
from .routes.pyscript_routes import pyscript_bp
from .routes.save_routes import save_bp

def create_app():
  app = Flask(__name__)
  app.register_blueprint(pages_bp)
  app.register_blueprint(pyscript_bp)
  app.register_blueprint(save_bp)
  return app