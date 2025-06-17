# MLEUS project website:

An extensive documentation for the MLEUS project website

## Dependencies
the project has the following dependencies:

```
Flask
pandas
openpyxl
flask-cors
python-dotenv
pyjwt
scikit-learn==1.6.1
```
which can be seen in the `requirements.txt` file
## Dependencies installation

First of all you have to first install the libraries in the  `requirements.txt` file by running this command on your console:

for **pip**:
``` bash
pip install -r requirements.txt
```

for **conda**:

since conda does not use `requirements.txt` files and instead uses `enivronment.yaml` files, you have to convert `requirements.txt` to it's conda equivalent by:

1. creating an `enivronment.yaml` file with the following text inside:
```
# environment.yaml
name: test-env
channels:
  - conda-forge
dependencies:
  - python>=3.5
  - anaconda
  - pip
  - pip:
    - -r file:requirements.txt
```

2. then use conda to create the environment:
```
conda env create -f environment.yaml
```
## Starting the flask server

To start the local server to run the website locally, you have to run the following command inside the root directory:
```
#console
flask --app app --debug run
``` 
## Poject Structure Overview

the project has the following file-structure:
```
.
├── .gitignore
├── requirements.txt
├── app.py
└── sito/
    ├── routes/
    ├── services/
    │   ├── ml_models/
    │   └── utils/
    ├── static/
    │   └── js/
    ├── templates
    └── __init__.py
```
### app.py

contains the code to start the flask server

### init.py

contains the code to register the api endpoints, we used this to seperate the code for the endpoints into multiple files (inside the routes subfolder), where each file has a specific scope.

### Routes subfolder
The routes subfolder has the following structure:
```
routes/
├── feedback_routes.py
├── model_routes.py
└── pages_routes.py
```
where each file exposes api endpoints, the files have a naming convention of `{scope}_routes.py` 

#### feedback_routes.py
Exposes the api endpoint for saving the user's answer to the feedback form and calls the appropriate service

#### model_routes.py
Exposes the api endpoints for informations (features selected by the model) or actions (predicting a case given by the User) related to the Machine Learning models

#### pages_routes.py
Exposes the api endpoints for rendering the Views (html pages)


### Services subfolder
the services subfolder has the following structure:
```
services/
├── ml_models/
├── utils/
├── flexible_scaler.py
├── model_prediction_service.py
└── save_service.py
```
the files have a naming convention of `{scope}_routes.py`.

#### ml_models
A subfolder containing the Machine Learning models used for predicting the cases.

#### utils
the utils subfolder has the following structure:
```
utils/
├── get_backgroud_color_from_prediction.py
└── save_utils.py
```
- `get_backgroud_color_from_prediction.py` contains the functions to calculate the background color, given the prediction percentage of the model, of the result card in which helps the user visualize the percentage of Malignity the model has given to the case (goes from dark blue to dark red, where dark blue means 0-5% Malignant and dark red means 95-100% Malignant).

- `save_utils.py` contains the functions and the helper functions needed to save the case (by case we mean the input to be predicted by the model given by a User), logging and feedback information to the excel spreadsheet, it's functions are:
    * `parse_new_row(data)` which parses the request payload to a python dict, calls `get_client_ip()`, requires the request's payload `data` and returns the parsed dict.

    * `get_client_ip()` method which extracts the User's ip from the request headers, return the user's ip.

    * `add_new_row_to_excel(new_row)` adds new row to excel with the case's information, requires the parsed User input (`new_row`) and returns nothing, is called by `predict_input()` method in `model_prediction_service.py`.

    * `add_feedback_to_existing_row(data)` adds the feedback form's answers sent by the User, we compare each row to the Datetime given by the user, and where the Datetime matches we add the feedback to that row (Datetime could be changed to a UUID generated randomly), requires the request's payload (`data`) and  returns nothing, is called by the exposed feedback endpoint.

    * `generate_user_token_from_datetime(date_time)`, uses pyjwt library to crypt date_time before passing it to frontend, requires the Datetime field computed by `parse_new_row(data)`.

    * `get_datetime_from_user_token(user_token)`, uses pyjwt library to decrypt `user_token` to get the primary key of the row, requires the request header: `'User-Token'` passed by frontend, returns the decrypted `user_token`, is called by `add_feedback_to_existing_row(data)`.

#### flexible_scaler.py
Scaler Class used in the serialized models, we extracted this to make `model_prediction_service.py` cleaner.

#### model_prediction_service.py
Used to interact with the models in `ml_models/` subfolder and contains the following functions:

- `parse_input(data, model)`, method to parse the User input so that every Features not selected by the selected Model is `np.nan`, requires the requests payload (`data`) and the model selected (`model`), returns the parsed input.

- `get_frontend_resources_from_prediction(clf_prediction, data)`, method which given the prediction of the selected model (`clf_prediction`), returns the frontend resources needed (`prediction_text`, `text_color`, `background_color`, `prediction`).

- `get_text_from_prediction_percent(percent)`, returns the appropriate `predictionText` based on the prediction given by the model in percentage `percent`, called by `get_frontend_resources_from_prediction(clf_prediction, data)`.

- `predict_input()`, utilizes the Machine Learning models to predict the case given by User, calls `get_frontend_resources_from_prediction(clf_prediction, data)` to get the frontend resources to be updated and calls `save_diagnosis(data, parsed_data)` to save the case with the prediction to database, returns the frontend resources to be updated with encrypted Datetime. 

- `get_mandatory_features()`, returns a dict with `{model}_features` as key and the model's selected features as value, it's called in it's own endpoint and used when initially loading the primary page to get each model's selected Features.


#### save_service.py
Used to save all User generated information to the excel file, contains the following functions:

- `save_diagnosis(data, parsed_data)`, modifies the input data, so that the features not selected by the user are `np.nan` and tries to save the data to excel by calling `add_new_row_to_excel(data=data)`, requires the request's payload and the `parsed_data` computed by `parse_input(data, model)`, returns an appropriate message and the `user_token` if the operation is successful otherwise returns an error message with an appropriate status, is called in `predict_input()`.

- `save_feedback()`, called by it's own api endpoint and tries to save the feedback information given by the User by calling `add_feedback_to_existing_row(data, user_token)`, returns an appropriate message depending on whether the operation was successful or not.




### Static subfolder
The static subfolder has the following structure:
```
static/
├── js/
├── DT_tree.png
└── style.css
```
and contains all the resources and logic needed to populate the frontend
### Template subfolder
The template subfolder contains all the html pages of the website and has the following structure:
```
templates/
├── index.html
└── result.html
```
