import pandas as pd
import numpy as np
import os
import sys

sys.path.insert(0, './sito/services')
import joblib
from utils.get_background_color_from_prediction import get_color
from flask import request
from save_service import save_diagnosis
from flexible_scaler import FlexibleScaler

prefix = "./sito/services/ml_models"

# on load operations
dt_model = joblib.load(f"{prefix}/DT.joblib")
nb_model = joblib.load(f"{prefix}/NB.joblib")

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


      
def parse_input(data, model):
  selected_features = [feature_names[i] for i in range(len(feature_names)) if model.named_steps['sel'].support_[i]]
  
  parsed_data = {
    key: data.get(key) if key in selected_features else np.nan
    for key in feature_names
  }
  
  return pd.DataFrame(parsed_data, index=[0]), parsed_data
  

      

def predict_input():
  data = request.get_json()
  
  # check which model the user has chosen, schema is: [type-of-model]-[model]
  # where type-of-model can be "Sensitive", "Specific", etc..
  # and model can be "NB" or "DT"
  print(data['model'])
  if data['model'][-2:] == "NB":
    clf = nb_model
  elif data['model'][-2:] == "DT":
    clf = dt_model
    print("dt_model")
  else:
    raise Exception("Invalid Input Model, must be DT, NB or LR")
  
  df, parsed_data = parse_input(data=data, model=clf)

  # predict using the parsed input
  clf_prediction = clf.predict_proba(df)[:, 1][0] * 100
  
  print(clf.predict_proba(df))
  
  # get text, backgroundColor and textColor from prediction
  response = get_frontend_resources_from_prediction(
    clf_prediction=clf_prediction,
    data=data
  )
  
  print(f"model: {data['model']}")
  print("%.2f" % clf_prediction)
  print("----------")
  
  # save user input, prediction and chosen model to excel file
  save_response = save_diagnosis(data=data, parsed_data=parsed_data)
  
  response["datetime"] = save_response["datetime"]
  response ["message"] = "case predicted and saved successfully!"
  
  return response





def get_frontend_resources_from_prediction(clf_prediction, data):
  percent = round(clf_prediction)
  
  print(clf_prediction)
  
  background_color = get_color(float("{:.2f}".format(clf_prediction /100)))
  
  text_color = "white" if percent <= 25 or percent >= 75 else "black"
  
  data['prediction'] = prediction = f"{percent}% Malignant"
  
  prediction_text = get_text_from_prediction_percent(percent=percent)
  
  return {
    "prediction": prediction,
    "predictionText": prediction_text,
    "textColor": text_color,
    "backgroundcolor": background_color
  }





def get_text_from_prediction_percent(percent):
  if percent < 5:
    return "Most Likely Benign"
  elif percent < 45:
    return "Likely Benign"
  elif percent<= 55:
    return "Uncertain Case"
  elif percent <= 95:
    return "Likely Malignant"
  else:
    return "Most Likely Malignant"
  
  


def get_mandatory_features():
  return {
    "DT_features": [feature_names[i] for i in range(len(feature_names)) if dt_model.named_steps['sel'].support_[i]],
    "NB_features": [feature_names[i] for i in range(len(feature_names)) if nb_model.named_steps['sel'].support_[i]]
  }
