@echo off
echo Attivazione venv...

REM Crea ambiente se non esiste
IF NOT EXIST ".venv" (
  python -m venv .venv
)

REM Attiva venv
call .venv\Scripts\activate

echo Installazione dipendenze..
pip install -r requirements.txt

echo Avvio app..
flask --app app --debug run

pause