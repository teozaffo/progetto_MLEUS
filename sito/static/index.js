let currModel = "DT"

document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById("predictButton")
    .addEventListener("click", () => predictClass());

  const models = ["DT", "NB", "LR"];

  document.getElementById("DT").style.backgroundColor = "#007bff";
  document.getElementById("DT").style.color = "white";

  setMandatoryFeaturesDT();

  models.forEach(model => {
    addEventListenersForModelButtons(model, models);
	
  });
  document.getElementById("inputForm DT").reset();
});

const addEventListenersForModelButtons = (model, models) => {
  document.getElementById(model).addEventListener("click", () => {
    document.getElementById(model).style.backgroundColor = "#007bff"
    document.getElementById(model).style.color = "white"
	
	currModel = model

    setMandatoryFeatures(model)
	
	//Ripristina il colore di sfondo di tutti i campi
	allFeatures.concat(["HospitalCenter", "ProtocolCode"]).forEach(id => {
	  const el = document.getElementById(id);
	  el.style.backgroundColor = "white";
	});

    models.map(innerModel => {
      if (innerModel !== model) {
        document.getElementById(innerModel).style.color = "black"
        document.getElementById(innerModel).style.backgroundColor = "white"
        document.getElementById(innerModel).style.borderColor = "#007bff"
      }
    });
	
	  //Reset risultati e messaggi
  document.getElementById("result").innerText = "";
  document.getElementById("result").style.backgroundColor = "white";
  document.getElementById("result").style.color = "black";
  document.getElementById("error").innerText = "";
  document.getElementById("validationError").innerText = "";
	});
}

const setMandatoryFeatures = (model) => {
  if (model === "DT") {
    setMandatoryFeaturesDT()
  } else if (model === "NB") {
    setMandatoryFeaturesNB()
  } else {
    setMandatoryFeaturesLR()
  }
}

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
  'Multiple'
]

const setMandatoryFeaturesDT = () => {
  const mandatoryFeaturesDT = [
    'Lymphadenopathy',
    'DuctRetrodilatation', 
    'VesselCompression', 
    'Ecostructure', 
    'Margins'
  ]

  allFeatures.map(feature => {
    if (mandatoryFeaturesDT.includes(feature)) {
      document.getElementById(feature).classList.remove('optional')
      document.getElementById(feature).classList.add('mandatory')
    } else {
      document.getElementById(feature).classList.remove('mandatory')
      document.getElementById(feature).classList.add('optional')
    }
  })
  
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
    'Margins'
  ]

  allFeatures.map(feature => {
    if (mandatoryFeaturesNB.includes(feature)) {
      document.getElementById(feature).classList.remove('optional')
      document.getElementById(feature).classList.add('mandatory')
    } else {
      document.getElementById(feature).classList.remove('mandatory')
      document.getElementById(feature).classList.add('optional')
    }
  })
}

const setMandatoryFeaturesLR = () => {
  const mandatoryFeaturesNB = [
    'Age',
    'Dim1', 
    'Dim2', 
    'Lymphadenopathy', 
    'DuctRetrodilatation', 
    'Arteries', 
    'VesselCompression', 
    'Ecostructure', 
    'Margins', 
    'Multiple'
  ]

  allFeatures.map(feature => {
    if (mandatoryFeaturesNB.includes(feature)) {
      document.getElementById(feature).classList.remove('optional')
      document.getElementById(feature).classList.add('mandatory')
    } else {
      document.getElementById(feature).classList.remove('mandatory')
      document.getElementById(feature).classList.add('optional')
    }
  })
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

  if (currModel === "DT") {
    setPredictionLogicFE()
  } else {
    setPredictionLogicBE()
  }
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

const setPredictionLogicFE = async () => {
  const D = parseInt(document.getElementById('DuctRetrodilatation').value);

  const V = parseInt(document.getElementById('VesselCompression').value);

  const L = parseInt(document.getElementById('Lymphadenopathy').value);

  const M = parseInt(document.getElementById('Margins').value);

  const E = parseInt(document.getElementById('Ecostructure').value);



  const errorDiv = document.getElementById('error');

  const resultDiv = document.getElementById('result');

  errorDiv.innerText = '';

  resultDiv.innerText = '';

  resultDiv.style.backgroundColor = '';

  resultDiv.style.color = '';



  if ([D, V, L, M, E].some(v => isNaN(v))) {

    errorDiv.innerText = 'Please enter valid numeric values for all fields using dot (.) as decimal separator.';

    return;

  }



  let result = 'uncertain case';

  let color = 'black';

  let boxColor = 'white';



  // Define all conditions as rule blocks

  const rules = [

    { c: () => D === 0 && V === 0 && L === 0 && M === 0 && E === 0, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#8282FF' },

    { c: () => D === 0 && V === 0 && L === 0 && M === 0 && E === 1, r: 'Likely NOT Malignant', textColor: 'white', boxColor: '#000096' },

    { c: () => D === 0 && V === 0 && L === 0 && M === 1 && E === 0, r: 'Likely NOT Malignant', textColor: 'white', boxColor: '#000096' },

    { c: () => D === 0 && V === 0 && L === 0 && M === 1 && E === 1, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#8282FF' },



    { c: () => D === 0 && V === 0 && L === 1 && M === 0 && E === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FFE6E6' },

    { c: () => D === 0 && V === 0 && L === 1 && M === 0 && E === 1, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },

    { c: () => D === 0 && V === 0 && L === 1 && M === 1 && E === 0, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#8282FF' },

    { c: () => D === 0 && V === 0 && L === 1 && M === 1 && E === 1, r: 'Likely NOT Malignant', textColor: 'white', boxColor: '#000096' },



    { c: () => D === 0 && V === 1 && M === 0 && L === 0 && E === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FFE6E6' },

    { c: () => D === 0 && V === 1 && M === 0 && L === 0 && E === 1, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#E6E6FF' },

    { c: () => D === 0 && V === 1 && M === 0 && L === 1 && E === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FF8282' },

    { c: () => D === 0 && V === 1 && M === 0 && L === 1 && E === 1, r: 'Likely NOT Malignant', textColor: 'white', boxColor: '#000096' },



    { c: () => D === 0 && V === 1 && M === 1 && L === 0 && E === 0, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#8282FF' },

    { c: () => D === 0 && V === 1 && M === 1 && L === 0 && E === 1, r: 'Likely NOT Malignant', textColor: 'white', boxColor: '#000096' },

    { c: () => D === 0 && V === 1 && M === 1 && L === 1 && E === 0, r: 'Likely NOT Malignant', textColor: 'white', boxColor: '#000096' },

    { c: () => D === 0 && V === 1 && M === 1 && L === 1 && E === 1, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#8282FF' },



    { c: () => D === 1 && M === 0 && E === 0 && L === 0 && V === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FF8282' },

    { c: () => D === 1 && M === 0 && E === 0 && L === 0 && V === 1, r: 'Likely Malignant', textColor: 'black', boxColor: '#DC4646' },

    { c: () => D === 1 && M === 0 && E === 0 && L === 1 && V === 0, r: 'Likely Malignant', textColor: 'white', boxColor: '#960000' },

    { c: () => D === 1 && M === 0 && E === 0 && L === 1 && V === 1, r: 'Likely Malignant', textColor: 'black', boxColor: '#DC4646' },



    { c: () => D === 1 && M === 0 && E === 1 && V === 0 && L === 0, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#B4B4FF' },

    { c: () => D === 1 && M === 0 && E === 1 && V === 0 && L === 1, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },

    { c: () => D === 1 && M === 0 && E === 1 && V === 1 && L === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FF8282' },

    { c: () => D === 1 && M === 0 && E === 1 && V === 1 && L === 1, r: 'Likely Malignant', textColor: 'black', boxColor: '#FF8282' },



    { c: () => D === 1 && M === 1 && E === 0 && L === 0 && V === 0, r: 'Likely NOT Malignant', textColor: 'black', boxColor: '#B4B4FF' },

    { c: () => D === 1 && M === 1 && E === 0 && L === 0 && V === 1, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },

    { c: () => D === 1 && M === 1 && E === 0 && L === 1 && V === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FFB4B4' },

    { c: () => D === 1 && M === 1 && E === 0 && L === 1 && V === 1, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },



    { c: () => D === 1 && M === 1 && E === 1 && V === 0 && L === 0, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },

    { c: () => D === 1 && M === 1 && E === 1 && V === 0 && L === 1, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },

    { c: () => D === 1 && M === 1 && E === 1 && V === 1 && L === 0, r: 'Likely Malignant', textColor: 'black', boxColor: '#FF8282' },

    { c: () => D === 1 && M === 1 && E === 1 && V === 1 && L === 1, r: 'uncertain case', textColor: 'black', boxColor: '#F2F2F2' },



  ];



  for (let rule of rules) {

    if (rule.c()) {

      result = rule.r;

      textColor = rule.textColor; // Recupera il colore del testo dalla regola

      boxColor = rule.boxColor;   // Recupera il colore di sfondo dalla regola

      break;

    }

  }

 
  // Dopo aver calcolato il risultato, raccogli i dati:
  const formData = parseFormData(result);
  localStorage.setItem("datetime", formData.datetime);
    
  // Ottieni l’IP pubblico
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }

  await sendToServer(formData);
  
  //Salva per prediction.html
  localStorage.setItem("prediction", `:: ${result} ::`);
  localStorage.setItem("predictionColor", textColor);
  localStorage.setItem("predictionBackgroundColor", boxColor);
  localStorage.setItem("model", currModel);

  //Vai al questionario
  window.location.href = "/prediction";
}

const setPredictionLogicBE = async () => {
  const formData = parseFormData();
  localStorage.setItem("datetime", formData.datetime);

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }

  const result = await predictFromServer(formData);

  if (!result || !result.prediction) {
    console.error("Errore: nessuna previsione ricevuta dal server.");
    return;
  }

  const percent = Math.round(parseFloat(result.prediction));
  formData.prediction = `${percent}% Malignant`;
  await sendToServer(formData);
  localStorage.setItem("prediction", `:: ${percent}% Malignant ::`);
  localStorage.setItem("predictionColor", percent <= 25 || percent >= 75 ? "white" : "black");
  localStorage.setItem("predictionBackgroundColor", result.backgroundColor || "#f0f0f0");
  localStorage.setItem("model", currModel);

  // Redirect solo dopo salvataggio dati
  window.location.href = "/prediction";
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

  document.getElementById("result").innerText = "";
  document.getElementById("result").style.backgroundColor = "white";
  document.getElementById("result").style.color = "black";
  document.getElementById("error").innerText = "";
  document.getElementById("validationError").innerText = "";


}
