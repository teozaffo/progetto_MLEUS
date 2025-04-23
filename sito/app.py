# app.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Percorso assoluto del file Excel su PythonAnywhere
EXCEL_FILE = "/home/teozaffo/stage/diagnosi.xlsx"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/")
def home():
    return "✅ Server Flask attivo su PythonAnywhere!"

@app.route("/salva", methods=["POST"])
def salva_diagnosi():
    data = request.get_json()
    print("✅ Richiesta ricevuta:", data)

    # Costruisci la nuova riga da salvare
    new_row = {
        "datetime": data.get("datetime", datetime.now().isoformat()),
        "ip": data.get("ip", request.remote_addr),
        "DuctRetrodilatation": data.get("DuctRetrodilatation"),
        "VesselCompression": data.get("VesselCompression"),
        "Lymphadenopathy": data.get("Lymphadenopathy"),
        "Margins": data.get("Margins"),
        "Ecostructure": data.get("Ecostructure"),
        "prediction": data.get("prediction")
    }

    print("📄 Riga da salvare:", new_row)

    try:
        # Leggi o crea il file Excel
        if os.path.exists(EXCEL_FILE):
            df = pd.read_excel(EXCEL_FILE)
            print("📂 File Excel trovato con", len(df), "righe")
        else:
            df = pd.DataFrame()
            print("📁 File non trovato, ne creo uno nuovo")

        # Aggiungi la nuova riga
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)

        # Salva il file
        df.to_excel(EXCEL_FILE, index=False)
        print("💾 Dati scritti correttamente su", EXCEL_FILE)

        return jsonify({"message": "Dati salvati con successo"})
    except Exception as e:
        print("❌ Errore nella scrittura su Excel:", str(e))
        return jsonify({"error": str(e)}), 500