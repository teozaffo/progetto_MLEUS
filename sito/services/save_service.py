from utils.save_utils import parse_new_row, add_new_row_to_excel, add_feddback_to_existing_row, generate_user_token_from_datetime


def save_diagnosis(data, parsed_data):
  for key in parsed_data.keys():
    data[key] = parsed_data[key]
  
  new_row = parse_new_row(data=data)
  
  print("📄 Riga da salvare:", new_row)
  
  try:
    add_new_row_to_excel(new_row=new_row)
    
    return {
      "message": "Dati salvati con successo",
      "user_token": generate_user_token_from_datetime(date_time=new_row["Datetime"])
    }
  except Exception as e:
    raise Exception(str(e))
    

def save_feedback(data, user_token):
  print("📩 Ricevuto questionario:", data)
  
  try:
    add_feddback_to_existing_row(data=data, user_token=user_token)
    
    return {"message": "Salvato con successo"}
  except Exception as e:
    raise Exception(str(e))
  try:
    add_feddback_to_existing_row(data=data, user_token=user_token)
    
    return {"message": "Salvato con successo"}
  except Exception as e:
    raise Exception(str(e))
