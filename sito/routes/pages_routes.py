from flask import Blueprint, render_template

pages_bp = Blueprint('pages', __name__)


@pages_bp.route("/")
def index():
    return render_template("index.html")

@pages_bp.route("/result")
def result():
    return render_template("results.html")
