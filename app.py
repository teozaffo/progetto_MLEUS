# app.py
from openpyxl import load_workbook
import pytz
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
import pytz
from openpyxl import load_workbook, Workbook
from dateutil import parser
from sito import create_app


app = create_app()
CORS(app)

excel_file_path = "./diagnosi.xlsx"

@app.route("/status")
def status():
    return "✅ Server Flask attivo e funzionante!"    
    
# Avvia il server
if __name__ == "__main__":
    print("🚀 Server Flask in esecuzione...")
    app.run(debug=True)
