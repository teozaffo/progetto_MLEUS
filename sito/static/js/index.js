let currModel = "";

const allFeatures = [
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
  'Multiple',
];

let allMandatoryFeatures = {}


document.addEventListener('DOMContentLoaded', async () => {
  resetAllFields();

  document.getElementById("reset").addEventListener("click", () => resetAllFields());

  allMandatoryFeatures = await fetchMandatoryFeatures();

  document
    .getElementById("predictButton")
    .addEventListener("click", async () => await predictClass());

  document.getElementById("inputForm").hidden = true;

  addEventListenersForModelButtons();

  document.getElementById("inputForm").reset();
});



/* 
* Resets all fields' appearance and values
* (all Features + Hospital Code and Protocol Code)
*/
const resetAllFields = () => {
  // Pulisce tutti i campi di input e select
  const fieldsToReset = allFeatures.concat(['HospitalCenter', 'ProtocolCode']);
  
  fieldsToReset.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "INPUT") el.value = "";
    if (el.tagName === "SELECT") el.selectedIndex = 0;
  });

  resetFieldAppearance();

  document.getElementById("validationError").innerText = "";
}




/* 
* Resets the appearance of All Fields
* backgroundColor = white and grey border
*/
const resetFieldAppearance = () => {
  allFeatures.concat(['HospitalCenter', 'ProtocolCode']).forEach(id => {
    document.getElementById(id).style.backgroundColor = "white";
    document.getElementById(id).style.border = "2px solid #ccc";
    document.getElementById(id).classList.remove("error");
  });
}



/* 
* fetches the mandatory features of all Models from backend 
* (so that it doesn't have to be hard coded)
* mandatory features for DT = allMandatoryFeatures.DT_features
* mandatory feature for NB = allMandatoryFeatures.NB_features
*
* in case the model changes, we just have to change the key of the
* dict in the backend function to an appropriate key
* and make mandatory features for {model} = allMandatoryFeatures.{model}_features
*/
const fetchMandatoryFeatures = async () => {
  try {
    const response = await fetch(`/mandatory_features`, {
      method: "GET"
    });

    return response.json();
  } catch (error) {
    console.error("Errore nell'invio al server:", error);
    return;
  }
}




const addEventListenersForModelButtons = () => {
  let btns = document.querySelectorAll(".model-btn");
  btns.forEach(btn => {
    const btn_id = btn.id;
    document.getElementById(btn_id).addEventListener("click", () => {
      document.getElementById("inputForm").hidden = false;

      document.getElementById(btn_id).style.backgroundColor = "#007bff";
      document.getElementById(btn_id).style.color = "white";
    
      currModel = btn_id
      console.log(btn_id)

      setMandatoryFeatures(btn_id.slice(btn_id.length - 2));
    
      resetFieldAppearance();

      let inner_btns = document.querySelectorAll(".model-btn")
      inner_btns.forEach(inner_btn => {
        if (inner_btn.id !== btn_id) {
          document.getElementById(inner_btn.id).style.color = "black";
          document.getElementById(inner_btn.id).style.backgroundColor = "white";
          document.getElementById(inner_btn.id).style.borderColor = "#007bff";
        }
      })
    
      //Reset risultati e messaggi
      document.getElementById("validationError").innerText = "";

      document.querySelectorAll('.info-toggle').forEach(cb => cb.checked = false);
    })
  });
}




/* 
* Sets correct Mandatory Features based on the model selected
*/
const setMandatoryFeatures = (model) => {
  let mandatoryFeatures = {}

  if (model === "DT") {
    // in case we change models, just chande this to:
    // mandatoryFeatures = allMandatoryFeatures.{new_model}_features
    mandatoryFeatures = allMandatoryFeatures.DT_features;
  } else if (model === "NB") {
    mandatoryFeatures = allMandatoryFeatures.NB_features;
  } else {
    console.error("Invalid Model!!!")
  }


  allFeatures.map(feature => {
    if (mandatoryFeatures.includes(feature)) {
      document.getElementById(`${feature}-feature`).style.display = "";
      document.getElementById(feature).classList.add("mandatory");
    } else {
      document.getElementById(`${feature}-feature`).style.display = "none";
      document.getElementById(feature).classList.remove("mandatory");
    }
  });
}



/* 
* If the input in the fields for the mandatory features are valid
* then it sends the input to the server and saves the response to sessionStorage
* or else it updates frontend to show correct error message and highlights invalid fields
*/
const predictClass = async () => {
  if (checkIfFieldsAreInvalidAndShowCorrectErrorMessage()) {
    return;
  }

  const formData = parseFormData();
  sessionStorage.setItem("datetime", formData.datetime);

  const result = await sendInputToServer(formData);
  
  if (!result || !result.prediction) {
    console.error("Errore: nessuna previsione ricevuta dal server.");
    return;
  }

  putResponseToSessionStorage(result);

  window.location.href = "/result";
};



/* 
* Parses the input data to be sent to backend
*/
const parseFormData = (result) => {
  return {
    model: currModel,
    datetime: new Date().toISOString(),
    age: parseInt(document.getElementById('age').value),
    sex: parseInt(document.getElementById('sex').value),
    Dim1: parseInt(document.getElementById('Dim1').value),
    Dim2: parseInt(document.getElementById('Dim2').value),
    Veins: parseInt(document.getElementById('Veins').value),
    Arteries: parseInt(document.getElementById('Arteries').value),   
    DuctRetrodilation: parseInt(document.getElementById('DuctRetrodilation').value),
    VesselCompression: parseInt(document.getElementById('VesselCompression').value),
    Lymphadenopathy: parseInt(document.getElementById('Lymphadenopathy').value),
    Margins: parseInt(document.getElementById('Margins').value),
    Ecostructure: parseInt(document.getElementById('Ecostructure').value),
    Multiple: parseInt(document.getElementById('Multiple').value),
    HospitalCenter: document.getElementById("HospitalCenter").value.trim(),
    ProtocolCode: document.getElementById("ProtocolCode").value.trim(),
    prediction: result,
  };
}




const sendInputToServer = async (data) => {
  try {
    const response = await fetch(`/model_prediction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error("Errore nell'invio al server:", error);
  }
}



const putResponseToSessionStorage = (response) => {
  console.log(response)

  console.log(currModel)

  sessionStorage.setItem("model", currModel);
  sessionStorage.setItem("prediction", response.prediction);
  sessionStorage.setItem("predictionBackgroundColor", response.backgroundcolor);
  sessionStorage.setItem("predictionColor", response.textColor);
  sessionStorage.setItem("predictionText", response.predictionText)

  console.log(response.prediction);
}


function checkForMissingMandatoryFields() {
  const mandatoryElements = document.querySelectorAll('.mandatory');
  let missingFields = [];

  mandatoryElements.forEach(elem => {
    const id = elem.id;
    const value = document.getElementById(id).value;

    // Considera vuoto anche "NaN" o stringa vuota per i numerici
    if (value === "" || isNaN(value) && elem.tagName === "INPUT") {
      missingFields.push(id);
    }
  });

  return missingFields;
}



const checkIfFieldsAreInvalidAndShowCorrectErrorMessage = () => {
  resetFieldAppearance();

  // Messaggio di errore per i campi obbligatori
  const validationError = document.getElementById("validationError");
  validationError.innerText = "";

  const missing = checkForMissingMandatoryFields();

  let valueErrors = [];

  if (missing.length > 0) {
    setCorrectErrorMessageAndFieldAppearanceWhenMissingFields(missing, valueErrors);
  }

  const mandatoryFeatures = []

  // get mandatory features from html
  document.querySelectorAll('.mandatory').forEach(e => mandatoryFeatures.push(e.id));

  if (mandatoryFeatures.includes("age") || mandatoryFeatures.includes("Dim1") || mandatoryFeatures.includes("Dim2")) {
    validateNumericalFields(valueErrors);
  }

  if (valueErrors.length > 0) {
    validationError.innerHTML = `⚠️ Please correct the following fields:<br>${valueErrors.join("<br>")}`;

    document.querySelectorAll(".error").forEach( i => {
      i.style.backgroundColor = "rgba(236, 102, 102, 0.4)";
      i.style.border = "2px solid rgb(255, 0, 0)";
    });

    return true;
  }

  return false
}


const setCorrectErrorMessageAndFieldAppearanceWhenMissingFields = 
(missing, valueErrors) => {
  const labels = missing.map(id => document.querySelector(`label[for="${id}"]`).innerText);
  valueErrors.push(`${labels.join(', ')} must not be empty`);

  // Evidenzia i campi mancanti
  missing.forEach(id => {
    document.getElementById(id).style.backgroundColor = "rgba(236, 102, 102, 0.4)";
    document.getElementById(id).style.border = "2px solid rgb(255, 0, 0)";
  });
}


const validateNumericalFields = (valueErrors) => {
  // Controlli sui valori numerici
  const age = parseInt(document.getElementById("age").value);
  const dim1 = parseInt(document.getElementById("Dim1").value);
  const dim2 = parseInt(document.getElementById("Dim2").value);

  if (fieldNotInRange(age, 1, 120)) { 
    valueErrors.push("Age must be between 1 and 120");
    document.getElementById("age").classList.add("error");
  }
  if (fieldNotInRange(dim1, 1, 120)) { 
    valueErrors.push("Max Dimension (Dim1) must be between 1 and 120"); 
    document.getElementById("Dim1").classList.add("error");
  }
  if (fieldNotInRange(dim2, 1, 120)) { 
    valueErrors.push("Min Dimension (Dim2) must be between 1 and 120");
    document.getElementById("Dim2").classList.add("error");
  }
  if (dim2 > dim1) { 
    valueErrors.push("Min Dimension must be less than or equal to Max Dimension");
    document.getElementById("Dim1").classList.add("error");
    document.getElementById("Dim2").classList.add("error");
  }
}

const fieldNotInRange = (field, low, up) => {
  return field < low || field > up
}




/* 
* gets user IP from external api (for testing purposes)
*/
const getUserIP = async (formData) => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
    console.log(formData.ip)
  } catch (e) {
    formData.ip = "IP non disponibile";
  }
}
