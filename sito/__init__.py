from flask import Flask

def create_app():
  app = Flask(__name__)
  app.register_blueprint(pages_bp)
  app.register_blueprint(pyscript_bp)
  return app