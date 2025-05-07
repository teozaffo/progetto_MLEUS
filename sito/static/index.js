let currModel = "DT"

async function showConnectionInfo() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    const ip = data.ip;
    const now = new Date().toLocaleString();
    document.getElementById("connectionInfo").innerText = `Indirizzo IP: ${ip} | Connessione: ${now}`;
  } catch (e) {
    document.getElementById("connectionInfo").innerText = "Impossibile recuperare l'indirizzo IP.";
  }
}

document.addEventListener('DOMContentLoaded', function () {
  showConnectionInfo()
  document
    .getElementById("predictButton")
    .addEventListener("click", () => predictClass())

  const models = ["DT", "NB", "LR"]

  document.getElementById("DT").style.backgroundColor = "#007bff"
  document.getElementById("DT").style.color = "white"

  setMandatoryFeaturesDT()

  models.forEach(model => {
    addEventListenersForModelButtons(model, models)
  })

  switch (currModel) {
    case "DT":

  }
})

const addEventListenersForModelButtons = (model, models) => {
  document.getElementById(model).addEventListener("click", () => {
    document.getElementById(model).style.backgroundColor = "#007bff"
    document.getElementById(model).style.color = "white"

    currModel = model

    setMandatoryFeatures(model)

    models.map(innerModel => {
      if (innerModel !== model) {
        document.getElementById(innerModel).style.color = "black"
        document.getElementById(innerModel).style.backgroundColor = "white"
        document.getElementById(innerModel).style.borderColor = "#007bff"
      }
    })
  })
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

const predictClass = () => {
  if (currModel === "DT") {
    setPredictionLogicFE()
  } else {
    setPredictionLogicBE()
  }
}

const parseFormData = (result) => {
  return {
    DuctRetrodilatation: parseInt(document.getElementById('DuctRetrodilatation').value),
    VesselCompression: parseInt(document.getElementById('VesselCompression').value),
    Lymphadenopathy: parseInt(document.getElementById('Lymphadenopathy').value),
    Margins: parseInt(document.getElementById('Margins').value),
    Ecostructure: parseInt(document.getElementById('Ecostructure').value),
    age: parseInt(document.getElementById('Age').value),
    sex: parseInt(document.getElementById('Sex').value),
    Dim1: parseInt(document.getElementById('Dim1').value),
    Dim2: parseInt(document.getElementById('Dim2').value),
    Arteries: parseInt(document.getElementById('Arteries').value),
    Veins: parseInt(document.getElementById('Veins').value),
    Multiple: parseInt(document.getElementById('Margins').value),
    prediction: result,
    datetime: new Date().toISOString(),
    model: currModel
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



  resultDiv.innerText = `:: ${result} ::`;

  resultDiv.style.color = textColor; // Applica il colore del testo

  resultDiv.style.backgroundColor = boxColor; // Applica il colore di sfondo
  // Dopo aver calcolato il risultato, raccogli i dati:
  const formData = parseFormData(result)
    
  // Ottieni l’IP pubblico
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }

  //sendToServer(formData);
}

const setPredictionLogicBE = async () => {
  const formData = parseFormData()

  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    formData.ip = data.ip;
  } catch (e) {
    formData.ip = "IP non disponibile";
  }

  result = await predictFromServer(formData);

  console.log(result.prediction);

  const errorDiv = document.getElementById('error');

  const resultDiv = document.getElementById('result');

  errorDiv.innerText = '';

  resultDiv.innerText = '';

  resultDiv.style.backgroundColor = `${result.backgroundColor}`;

  if (parseFloat(result.prediction) <= 0.25 || parseFloat(result.prediction) >= 0.75) {
    resultDiv.style.color = 'white';
  } else {
    resultDiv.style.color = 'black';
  }

  resultDiv.innerText = `:: ${result.prediction}% Malignant ::`;
}