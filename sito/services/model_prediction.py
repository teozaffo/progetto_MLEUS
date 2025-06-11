import pandas as pd
import numpy as np
from dotenv import load_dotenv
import os
import joblib
from sito.services.flexible_scaler import FlexibleScaler

load_dotenv()

dt_model = joblib.load("./ml_models/DT.joblib")
nb_model = joblib.load("./ml_models/NB.joblib")

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
  if data['model'] == "NB":
    clf = nb_model
  elif data['model'] == "DT":
    clf = dt_model
  else:
    raise Exception("Invalid Input Model, must be DT, NB or LR")
  
  df = parse_input(data=data, model=clf)

  clf_prediction = clf.predict_proba(df)[:, 1][0] * 100
  
  color = get_color(float("{:.2f}".format(clf_prediction /100)))
  
  print(f"model: {data['model']}")
  print("%.2f" % clf_prediction)
  print("----------")
  
  return "%.2f" % clf_prediction, color




def parse_input(data, model):
  selected_features = [feature_names[i] for i in range(len(feature_names)) if model.named_steps['sel'].support_[i]]
  
  parsed_data = {
    key: data.get(key) if key in selected_features else np.nan
    for key in feature_names
  }
  
  return pd.DataFrame(parsed_data, index=[0])
