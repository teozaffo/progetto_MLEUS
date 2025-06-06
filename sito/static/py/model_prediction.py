import pandas as pd
import numpy as np
import joblib
from flexible_scaler import FlexibleScaler
import json
import js
import pyscript
from pyodide.http import pyfetch

dt_model = joblib.load("./models/DT.joblib")
rf_model = joblib.load("./models/RF.joblib")

print(f"dt model: {dt_model}")
print(f"rf model: {rf_model}")

feature_names = [
  'age',
  'sex',
  'Dim1',
  'Dim2',
  'Lymphadenopathy',
  'DuctRetrodilation',
  'Arteries',
  'Veins',
  'VesselCompression',
  'Ecostructure',
  'Margins',
  'Multiple'
]
  

def blend_color(base_color, ratio):
    # base_color is (R, G, B)
    r = int((1 - ratio) * 255 + ratio * base_color[0])
    g = int((1 - ratio) * 255 + ratio * base_color[1])
    b = int((1 - ratio) * 255 + ratio * base_color[2])
    return f'#{r:02x}{g:02x}{b:02x}'

def get_color(ratio):
    if ratio == 0.5:
        return "#ffffff"
      
    if ratio > 0.90:
      return "#990000"
    
    if ratio > 0.5:  # more positives -> red blend
        strength = (ratio - 0.5) * 2
        return blend_color((255, 0, 0), strength)
    else:  # more negatives -> blue blend
        strength = (0.5 - ratio) * 2
        return blend_color((0, 0, 255), strength)




def predict_input(data):
  if data['model'] == "DT":
    df = parse_input(data=data, model=dt_model)
    clf = dt_model
  elif data['model'] == "RF":
    df = parse_input(data=data, model=rf_model)
    clf = rf_model   
  else:
    raise Exception("Invalid Input Model, must be DT or RF")

  clf_prediction = clf.predict_proba(df)[:, 1][0] * 100
  
  color = get_color(float("{:.2f}".format(clf_prediction /100)))
  
  print(f"model: {data['model']}")
  print("%.2f" % clf_prediction)
  print("----------")
  
  return round(clf_prediction), color, df.to_dict(orient='list')




async def get_frontend_resources_from_prediction(formData):
  data = formData.to_py()
  
  result, color, model_data = predict_input(data)
  
  text_prediction = ""
  
  data['prediction'] = f"{result}% Malignant"
  
  if result < 5:
      text_prediction = "Most Likely Benign"
  elif result < 45:
      text_prediction = "Likely Benign"
  elif result <= 55:
      text_prediction = "Uncertain Case"
  elif result <= 95:
      text_prediction = "Likely Malignant"
  else:
      text_prediction = "Most Likely Malignant"
  
  text_color = "white" if result <= 25 or result >= 75 else "black"
  
  for key, val in model_data.items():
    data[key] = val[0]
  
  try:
    
    response = await pyfetch(
      url="/salva",
      method="POST",
      headers={"Content-Type": "application/json"},
      body=json.dumps(data)
    )
    result = await response.json()
    js.console.log("Risposta del server:", result)
  except Exception as e:
    
    js.console.error("Errore nell'invio al server:", e)
  
  js.sessionStorage.setItem("model", data['model'])
  js.sessionStorage.setItem("prediction", text_prediction)
  js.sessionStorage.setItem("predictionBackgroundColor", color)
  js.sessionStorage.setItem("predictionColor", text_color)
  js.sessionStorage.setItem("predictionPercent", data['prediction'])
  
  
  
  

def parse_input(data, model):
  selected_features = [feature_names[i] for i in range(len(feature_names)) if model.named_steps['sel'].support_[i]]
  
  parsed_data = {
    key: data.get(key) if key in selected_features else np.nan
    for key in feature_names
  }
  
  return pd.DataFrame(parsed_data, index=[0])


js_function = pyscript.ffi.create_proxy(get_frontend_resources_from_prediction)
js.window.predict = js_function