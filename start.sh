#!/bin/bash

echo "Attivazione venv.."

if [ ! -d ".venv" ]; then 
  python3 -m venv .venv
fi

source .venv/bin/activate

echo "Installazione dipendenze.."

pip install -r requirements.txt

echo "Avvio server Flask"
flask --app app --debug run 