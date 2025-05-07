import pandas as pd
import numpy as np
from joblib import load
import joblib

from flexible_scaler import FlexibleScaler

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
        return blend_color((235, 0, 0), strength)
    else:  # more negatives -> blue blend
        strength = (0.5 - ratio) * 2
        return blend_color((0, 0, 255), strength)

def predict_input(data):
  with open(f"./sito/{data['model']}.joblib", 'rb') as f:
    clf = joblib.load(f)
  
  if data['model'] == "LR":
    df = parse_LR_input(data)
  else:
    df = parse_NB_input(data)

  clf_prediction = clf.predict_proba(df)[:, 1][0]
  
  color = get_color(float("{:.2f}".format(clf_prediction)))
  
  print(f"model: {data['model']}")
  print("%.2f" % clf_prediction)
  print("----------")
  
  return "%.2f" % clf_prediction, color

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