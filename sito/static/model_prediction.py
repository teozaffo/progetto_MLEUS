import pandas as pd
import numpy as np
import joblib
from flexible_scaler import FlexibleScaler
import json
import js
import pyscript
from pyodide.http import pyfetch

dt_model = joblib.load("./models/DT.joblib")
nb_model = joblib.load("./models/NB.joblib")
lr_model = joblib.load("./models/LR.joblib")


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
  if data['model'] == "LR":
    df = parse_LR_input(data)
    clf = lr_model
  elif data['model'] == "NB":
    df = parse_NB_input(data)
    clf = nb_model
  elif data['model'] == "DT":
    df = parse_DT_input(data)
    clf = dt_model
  else:
    raise Exception("Invalid Input Model, must be DT, NB or LR")

  clf_prediction = clf.predict_proba(df)[:, 1][0] * 100
  
  color = get_color(float("{:.2f}".format(clf_prediction /100)))
  
  print(f"model: {data['model']}")
  print("%.2f" % clf_prediction)
  print("----------")
  
  return round(clf_prediction), color

async def get_frontend_resources_from_prediction(formData):
  data = formData.to_py()
  
  result, color = predict_input(data)
  
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
  
  js.window.location.href = "/prediction"
  
  
  
  
  
def parse_LR_input(data):
  df = pd.DataFrame({
    'age': data['age'],
    'sex': data['sex'] if data['sex'] is not None else np.nan,
    'Dim1': data['Dim1'],
    'Dim2': data['Dim2'],
    'Lymphadenopathy': data['Lymphadenopathy'],
    'DuctRetrodilation': data['DuctRetrodilatation'],
    'Arteries': data['Arteries'],
    'Veins': data['Veins'] if data['Veins'] is not None else np.nan,
    'VesselCompression': data['VesselCompression'],
    'Ecostructure': data['Ecostructure'],
    'Margins': data['Margins'],
    'Multiple': data['Multiple']
  }, index=[0])

  return df

def parse_NB_input(data):
  df = pd.DataFrame({
    'age': data['age'],
    'sex': data['sex'] if data['sex'] is not None else np.nan,
    'Dim1': data['Dim1'],
    'Dim2': data['Dim2'],
    'Lymphadenopathy': data['Lymphadenopathy'],
    'DuctRetrodilation': data['DuctRetrodilatation'],
    'Arteries': data['Arteries'] if data['Arteries'] is not None else np.nan,
    'Veins': data['Veins'] if data['Veins'] is not None else np.nan,
    'VesselCompression': data['VesselCompression'],
    'Ecostructure': data['Ecostructure'],
    'Margins': data['Margins'],
    'Multiple': data['Multiple'] if data['Multiple'] is not None else np.nan
  }, index=[0])
  
  return df

def parse_DT_input(data):
  df = pd.DataFrame({
    'age': data['age'] if data['age'] is not None else np.nan,
    'sex': data['sex'] if data['sex'] is not None else np.nan,
    'Dim1': data['Dim1'] if data['Dim1'] is not None else np.nan,
    'Dim2': data['Dim2'] if data['Dim2'] is not None else np.nan,
    'Lymphadenopathy': data['Lymphadenopathy'],
    'DuctRetrodilation': data['DuctRetrodilatation'],
    'Arteries': data['Arteries'] if data['Arteries'] is not None else np.nan,
    'Veins': data['Veins'] if data['Veins'] is not None else np.nan,
    'VesselCompression': data['VesselCompression'],
    'Ecostructure': data['Ecostructure'],
    'Margins': data['Margins'],
    'Multiple': data['Multiple'] if data['Multiple'] is not None else np.nan
  }, index=[0])
  
  return df


js_function = pyscript.ffi.create_proxy(get_frontend_resources_from_prediction)
js.window.predict = js_function
