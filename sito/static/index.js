let currModel = "";

const allFeatures = [
  'Age',
  'Sex', 
  'Dim1', 
  'Dim2', 
  'Lymphadenopathy', 
  'DuctRetrodilatation', 
  'Arteries', 
  'Veins', 
  'VesselCompression', 
  'Ecostructure', 
  'Margins', 
  'Multiple',
];

let formData = {};

document.addEventListener('DOMContentLoaded', function () {

  document
    .getElementById("predictButton")
    .addEventListener("click", () => predictClass());

  document.getElementById("inputForm").hidden = true;

  const models = ["DT", "NB", "LR"];

  models.forEach(model => {
    addEventListenersForModelButtons(model, models);
	
  });
  document.getElementById("inputForm").reset();
});

const addEventListenersForModelButtons = (model, models) => {
  document.getElementById(model).addEventListener("click", () => {
    document.getElementById("inputForm").hidden = false;

    document.getElementById(model).style.backgroundColor = "#007bff";
    document.getElementById(model).style.color = "white";
	
	  currModel = model;

    setMandatoryFeatures(model);
	
    //Ripristina il colore di sfondo di tutti i campi
    allFeatures.concat(["HospitalCenter", "ProtocolCode"]).forEach(id => {
      const el = document.getElementById(id);
      el.style.backgroundColor = "white";
    });

    models.map(innerModel => {
      if (innerModel !== model) {
        document.getElementById(innerModel).style.color = "black";
        document.getElementById(innerModel).style.backgroundColor = "white";
        document.getElementById(innerModel).style.borderColor = "#007bff";
      }
    });
	
    //Reset risultati e messaggi
    document.getElementById("error").innerText = "";
    document.getElementById("validationError").innerText = "";

    document.querySelectorAll('.info-toggle').forEach(cb => cb.checked = false);
  });
}

const setMandatoryFeatures = (model) => {

  if (model === "DT") {
    setMandatoryFeaturesDT();
  } else if (model === "NB") {
    setMandatoryFeaturesNB();
  } else {
    setMandatoryFeaturesLR();
  }
}

const setMandatoryFeaturesDT = () => {
  const mandatoryFeaturesDT = [
    'Lymphadenopathy',
    'DuctRetrodilatation', 
    'VesselCompression', 
    'Ecostructure', 
    'Margins',
  ];

  allFeatures.map(feature => {
    if (mandatoryFeaturesDT.includes(feature)) {
      document.getElementById(`${feature}-feature`).style.display = "";
      document.getElementById(feature).classList.add("mandatory");
    } else {
      document.getElementById(`${feature}-feature`).style.display = "none";
      document.getElementById(feature).classList.remove("mandatory");
    }
  });
  
}

const setMandatoryFeaturesNB = () => {
  const mandatoryFeaturesNB = [
    'Age', 
    'Dim1', 
    'Dim2', 
    'Lymphadenopathy', 
    'DuctRetrodilatation', 
    'VesselCompression', 
    'Ecostructure', 
    'Margins', 
  ];

  allFeatures.map(feature => {
    if (mandatoryFeaturesNB.includes(feature)) {
      document.getElementById(`${feature}-feature`).style.display = "";
      document.getElementById(feature).classList.add("mandatory");
    } else {
      document.getElementById(`${feature}-feature`).style.display = "none";
      document.getElementById(feature).classList.remove("mandatory");
    }
  });
}

const setMandatoryFeaturesLR = () => {
  const mandatoryFeaturesLR = [
    'Age',
    'Dim1', 
    'Dim2', 
    'Lymphadenopathy', 
    'DuctRetrodilatation', 
    'Arteries', 
    'VesselCompression', 
    'Ecostructure', 
    'Margins', 
    'Multiple',  
  ];

  allFeatures.map(feature => {
    if (mandatoryFeaturesLR.includes(feature)) {
      document.getElementById(`${feature}-feature`).style.display = "";
      document.getElementById(feature).classList.add("mandatory");
    } else {
      document.getElementById(`${feature}-feature`).style.display = "none";
      document.getElementById(feature).classList.remove("mandatory");
    }
  });
}

function validateMandatoryFields() {
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

const predictClass = () => {
  // 🔄 Ripristina colore bianco a tutti i campi
  allFeatures.forEach(id => {
	document.getElementById(id).style.backgroundColor = "white";
  });

  // ❗ Messaggio di errore per i campi obbligatori
  const validationError = document.getElementById("validationError");
  validationError.innerText = "";

  const missing = validateMandatoryFields();

  if (missing.length > 0) {
	const labels = missing.map(id => document.querySelector(`label[for="${id}"]`).innerText);
	validationError.innerText = `⚠️ Please fill in the following mandatory fields: ${labels.join(', ')}`;

	// Evidenzia i campi mancanti
	missing.forEach(id => {
	  document.getElementById(id).style.backgroundColor = "#fff3cd";
	});

	return;
  }
  
  setPredictionLogicBE();
}

const parseFormData = (result) => {
  return {
    model: currModel,
    datetime: new Date().toISOString(),
    age: parseInt(document.getElementById('Age').value),
    sex: parseInt(document.getElementById('Sex').value),
    Dim1: parseInt(document.getElementById('Dim1').value),
    Dim2: parseInt(document.getElementById('Dim2').value),
    Veins: parseInt(document.getElementById('Veins').value),
    Arteries: parseInt(document.getElementById('Arteries').value),   
    DuctRetrodilatation: parseInt(document.getElementById('DuctRetrodilatation').value),
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

const predictFromServer = async (data) => {
  try {
    const response = await fetch(`/model_predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error("Errore nell'invio al server:", error);
  }
}

const sendToServer = async (data) => {
  try {
    const response = await fetch(`/salva`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error("Errore nell'invio al server:", error);
  }
}


const setPredictionLogicBE = async () => {
  formData = JSON.stringify(parseFormData());
  sessionStorage.setItem("datetime", formData.datetime);

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }

  await window.predict(formData);

  /*
  const predict = await pyscript.interpreter.globals.get("predict")

  const result = predict(formData)

  console.log(result)
  
  if (!result || !result.prediction) {
    console.error("Errore: nessuna previsione ricevuta dal server.");
    return;
  }

  sessionStorage.setItem("model", currModel);
  sessionStorage.setItem("prediction", result.prediction);
  sessionStorage.setItem("predictionBackgroundColor", result.backgroundColor);
  sessionStorage.setItem("predictionColor", result.textColor);

  window.location.href = "/prediction";

  */

  //const errorDiv = document.getElementById('error');

  //errorDiv.innerText = '';
};

window.onload = () => {
  // Pulisce tutti i campi di input e select
  const fieldsToReset = [
    'Age', 'Sex', 'Dim1', 'Dim2', 'Veins', 'Arteries', 'DuctRetrodilatation',
    'VesselCompression', 'Lymphadenopathy', 'Margins', 'Ecostructure',
    'Multiple', 'HospitalCenter', 'ProtocolCode'
  ];
  
  fieldsToReset.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "INPUT") el.value = "";
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    el.style.backgroundColor = "white";
  });

  document.getElementById("error").innerText = "";
  document.getElementById("validationError").innerText = "";


}