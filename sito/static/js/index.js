let currModel = "";

const allFeatures = [
  'Age',
  'Sex', 
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

const mandatoryFeaturesDT = [
  'Arteries',
  'Lymphadenopathy',
  'DuctRetrodilation', 
  'Ecostructure', 
  'Margins',
];

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



document.addEventListener('DOMContentLoaded', function () {
  resetFields();

  document
    .getElementById("predictButton")
    .addEventListener("click", async () => await predictClass());

  document.getElementById("inputForm").hidden = true;

  addEventListenersForModelButtons();

  document.getElementById("inputForm").reset();
});




const resetFields = () => {
  // Pulisce tutti i campi di input e select
  const fieldsToReset = [
    'Age', 'Sex', 'Dim1', 'Dim2', 'Veins', 'Arteries', 'DuctRetrodilation',
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

  document.getElementById("validationError").innerText = "";
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
    
      //Ripristina il colore di sfondo di tutti i campi
      allFeatures.concat(["HospitalCenter", "ProtocolCode"]).forEach(id => {
        const el = document.getElementById(id);
        el.style.backgroundColor = "white";
      });

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



const setMandatoryFeatures = (model) => {
  let mandatoryFeatures = {}

  if (model === "DT") {
    mandatoryFeatures = mandatoryFeaturesDT;
  } else if (model === "NB") {
    mandatoryFeatures = mandatoryFeaturesNB;
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
  // Ripristina colore bianco a tutti i campi
  allFeatures.forEach(id => {
    document.getElementById(id).style.backgroundColor = "white";
  });

  // Messaggio di errore per i campi obbligatori
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
  // Controlli sui valori numerici
  const age = parseInt(document.getElementById("Age").value);
  const dim1 = parseInt(document.getElementById("Dim1").value);
  const dim2 = parseInt(document.getElementById("Dim2").value);

  let valueErrors = [];

  if (isNaN(age) || age < 1 || age > 120) { 
    valueErrors.push("Age must be between 1 and 120");
    document.getElementById("Age").classList.add("error");
  }
  if (isNaN(dim1) || dim1 < 1 || dim1 > 120) { 
    valueErrors.push("Max Dimension (Dim1) must be between 1 and 120"); 
    document.getElementById("Dim1").classList.add("error");
  }
  if (isNaN(dim2) || dim2 < 1 || dim2 > 120) { 
    valueErrors.push("Min Dimension (Dim2) must be between 1 and 120");
    document.getElementById("Dim2").classList.add("error");
  }
  if (!isNaN(dim1) && !isNaN(dim2) && dim2 > dim1) { 
    valueErrors.push("Min Dimension must be less than or equal to Max Dimension");
    document.getElementById("Dim1").classList.add("error");
    document.getElementById("Dim2").classList.add("error");
  }

  if (valueErrors.length > 0) {
    validationError.innerHTML = `⚠️ Please correct the following fields:<br>${valueErrors.join("<br>")}`;


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





const predictFromServer = async (data) => {
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


const getUserIP = async (formData) => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }
}



const setPredictionLogicBE = async () => {
  const formData = parseFormData();
  sessionStorage.setItem("datetime", formData.datetime);

  const result = await predictFromServer(formData);
  
  if (!result || !result.prediction) {
    console.error("Errore: nessuna previsione ricevuta dal server.");
    return;
  }

  console.log(result)

  console.log(currModel)

  sessionStorage.setItem("model", currModel);
  sessionStorage.setItem("prediction", result.prediction);
  sessionStorage.setItem("predictionBackgroundColor", result.backgroundcolor);
  sessionStorage.setItem("predictionColor", result.textColor);
  sessionStorage.setItem("predictionText", result.predictionText)

  console.log(result.prediction);

  window.location.href = "/result";

  //const errorDiv = document.getElementById('error');

  //errorDiv.innerText = '';
};
