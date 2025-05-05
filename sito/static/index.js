document.addEventListener('DOMContentLoaded', function () {
  const models = ["DT", "NB", "LR"]

  document.getElementById("DT").style.backgroundColor = "#007bff"
  document.getElementById("DT").style.color = "white"

  setMandatoryFeaturesDT()

  models.forEach(model => {
    addEventListenersForModelButtons(model, models)
  })
})

const addEventListenersForModelButtons = (model, models) => {
  document.getElementById(model).addEventListener("click", () => {
    document.getElementById(model).style.backgroundColor = "#007bff"
    document.getElementById(model).style.color = "white"

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
      console.log(feature)
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