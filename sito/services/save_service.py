from utils.save_utils import parse_new_row, add_new_row_to_excel, add_feddback_to_existing_row

def save_diagnosis(data):
  new_row = parse_new_row(data=data)
  
  print("📄 Riga da salvare:", new_row)
  
  try:
    add_new_row_to_excel(new_row=new_row)
    
    return {
      "message": "Dati salvati con successo",
      "datetime": new_row["Datetime"]
    }
  except Exception as e:
    raise Exception(str(e))
    

def save_feedback(request):
  data = request.get_json()
  print("📩 Ricevuto questionario:", data)
  
  try:
    add_feddback_to_existing_row(data=data)
    
    return {"message": "Salvato con successo"}
  except Exception as e:
    raise Exception(str(e))