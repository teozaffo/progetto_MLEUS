import { navigateTo, handleRoute } from "./navigation.js";

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

let formData = {};



//on load handler:

// on Load -> reset everything
window.onload = () => {
  document.querySelector(".container").hidden = true;

  resetInputFields()
}

const resetInputFields = () => {
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

  document.getElementById("error").innerText = "";
  document.getElementById("validationError").innerText = "";

}



// handler for navigation between "pages"
window.addEventListener('popstate', () => {
  handleRoute(window.location.pathname);
});



// handlers for Pyscript events:


// pyscript has been initialized and is ready to run Python code
// some packages are being downloaded still, and some aren't finished
window.addEventListener("py:ready", () => {
  console.log("interpreter Finished!!")
  document.getElementById("loader-text").textContent = "Scanning Files Fetched...";
})

// ALL Pyscript tasks are fully complete and the site is reactive
window.addEventListener("py:all-done", () => {
  console.log("All done!");
  document.getElementById("loader-text").textContent = "All Done!";
  document.querySelector(".loader").classList.add("paused");

  setTimeout(() => {
    console.log("in timeout")

    document.querySelector(".loader-container").style.display = "none";
    document.querySelector("#predictor-container").hidden = false;
  }, 500);
})




// DOM event listeners for initialization (adding event listeners to some buttons etc..):

// event listeners for initialization
document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById("predictButton")
    .addEventListener("click", () => predictClass());

  document.getElementById("inputForm").hidden = true;

  const models = ["DT", "RF"];

  models.forEach(model => {
    addEventListenersForModelButtons(model, models);
  });

  document.getElementById("inputForm").reset();
});

const addEventListenersForModelButtons = (model, models) => {
  document.getElementById(model).addEventListener("click", () => {
    document.getElementById("inputForm").hidden = false;

    document.getElementById(model).classList.add("clicked")
	
	  currModel = model;

    setMandatoryFeatures(model);
	
    //Ripristina il colore di sfondo di tutti i campi
    allFeatures.concat(["HospitalCenter", "ProtocolCode"]).forEach(id => {
      const el = document.getElementById(id);
      el.style.backgroundColor = "white";
    });

    models.map(innerModel => {
      if (innerModel !== model) {
        document.getElementById(innerModel).classList.remove("clicked")
      }
    });
	
    //Reset risultati e messaggi
    document.getElementById("error").innerText = "";
    document.getElementById("validationError").innerText = "";

    document.querySelectorAll('.info-toggle').forEach(cb => cb.checked = false);
  });
}

const setMandatoryFeatures = (model) => {
  const mandatoryFeaturesDT = [
    'Lymphadenopathy',
    'DuctRetrodilation', 
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





// logic for sending the data to prediction logic:

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

const predictClass = async () => {
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
  
  await setPredictionLogicBE();

  navigateTo('/prediction');
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

// send the data to prediction logic (python script)
const setPredictionLogicBE = async () => {
	formData = parseFormData(); // tienilo oggetto
	sessionStorage.setItem("datetime", formData.datetime);

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }

  await window.predict(formData);
};
