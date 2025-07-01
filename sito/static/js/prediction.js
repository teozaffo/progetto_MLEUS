const metricsDT = {
  balacc: "0.87",
  sens: "0.89",
  spec: "0.85"
}

const metricsNB = {
  balacc: "0.88",
  sens: "0.90",
  spec: "0.85"
}


/*
* Populating html information on DOM content loaded
*/
document.addEventListener('DOMContentLoaded', () => {
  const predictionInformation = getAllPredictionInformationFromSessionStorage();
  console.log(predictionInformation.prediction);

  setPageElementsBasedOnPredictionInformation(predictionInformation);

  checkIfModelIsExplainable(predictionInformation.model);
  checkModelUnderTheHood(predictionInformation.model);

  // listener for Back button
  const backBtn = document.getElementById("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      goBackHome();
    });
  }

  // listener for Feedback form
  const form = document.getElementById("feedback");
  if (form) {
    form.addEventListener("submit", (event) => addListenerToFeedBackForm(event));
  }
});


const goBackHome = () => {
  window.location.href = "/";
}


/*
* gets all prediction information needed to populate the page
* that was sent by the server and then saved on sessionStorage
*/
const getAllPredictionInformationFromSessionStorage = () => {
  return {
    model: sessionStorage.getItem("model"),
    predictionText: sessionStorage.getItem("predictionText"),
    backgroundColor: sessionStorage.getItem("predictionBackgroundColor"),
    textColor: sessionStorage.getItem("predictionColor"),
    prediction: sessionStorage.getItem("prediction")
  }
}



/*
* Sets page elements that need prediction information dynamically
*/

const setPageElementsBasedOnPredictionInformation = (predictionInformation) => {
  const modelParts = predictionInformation.model.split("-");
  const readableModel = modelParts[0]; // es. 'Balanced', 'Sensitive'

  document.getElementById("result").innerText = predictionInformation.predictionText;
  document.getElementById("result").style.backgroundColor = predictionInformation.backgroundColor;
  document.getElementById("result").style.color = predictionInformation.textColor;
  document.getElementById("selected-model").innerText = `Selected Model: ${readableModel}`;
};


/*const setPageElementsBasedOnPredictionInformation = (predictionInformation) => {
  document.getElementById("result").innerText = predictionInformation.predictionText;
  document.getElementById("result").style.backgroundColor = predictionInformation.backgroundColor;
  document.getElementById("result").style.color = predictionInformation.textColor;
  document.getElementById("selected-model").innerText = 
    `Selected Model: ${predictionInformation
      .model
      .slice(0, predictionInformation.model.length - 3)
    }`;
}*/




/* 
* Feedback form methods
*/
const addListenerToFeedBackForm = (event) => {
  event.preventDefault();

  const feedback = getFeedbackFormAnswers();

  sendFeedbackToServerAndShowServerResponse(feedback);
}

const getFeedbackFormAnswers = () => {
  return {
    q1: document.querySelector('input[name="reliability"]:checked')?.value,
    q2: document.querySelector('input[name="usefulness"]:checked')?.value,
    q3: document.querySelector('input[name="influence"]:checked')?.value,
    q4: document.getElementById("recommendability").value,
    q5: String(document.getElementById("reason").value),
  }
}

const sendFeedbackToServerAndShowServerResponse = (feedback) => {
  const userToken = sessionStorage.getItem("userToken");
  console.log(userToken)


  fetch("/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Token": userToken
    },
    body: JSON.stringify(feedback)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Risposta dal server:", data);
    if (data.error !== undefined) {
      showModal("failure");
      return;
    }
    showModal("success");
  })
  .catch(error => {
    console.error("Errore nell'invio del questionario:", error);
    showModal("failure")
  });
}




/* 
* Modal Card methods
*/
const showModal = (type) => {
  document.getElementById(type + 'Modal').style.display = 'flex';
}

const closeModal = (type) => {
  document.getElementById(type + 'Modal').style.display = 'none';
}




/* 
* Method that checks the title of the model 
* (wether it is Sensitive, Explainable, Specific or Balanced)
* and shows the plot of DT model if the title is Explainable
*/
const checkIfModelIsExplainable = (model) => {
  const modelTitle = model.slice(0, model.length - 3);
  const dtButton = document.getElementById("show-DT-button");
  if (modelTitle === "Explainable") {
    dtButton.style.display = "block";
    setEventListenersForDTPlot();
  } else {
    dtButton.style.display = "none";
  }
}




/* 
* Methods for setting all the event listeners for
* DT plot modal
*/
const setEventListenersForDTPlot = () => {
  document.getElementById("show-DT-button").addEventListener("click", () => showDT());
  
  document.getElementById("DT-modal").addEventListener("click", () => closeDT());
  document.getElementById("close-modal").addEventListener("click", () => closeDT());

  document.getElementById("inner-modal").addEventListener("click", (event) => preventEventPropagationForDTModal(event));
}

const showDT = () => {
  document.getElementById("DT-modal").style.display = "block";
}

const closeDT = () => {
  document.getElementById("DT-modal").style.display = "none"
}

const preventEventPropagationForDTModal = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}




/* 
* Methods for checking which model the user has chosen
* under the hood, and based on that it shows the correct model metrics 
*/
const checkModelUnderTheHood = (model) => {
  const modelUnderTheHood = model.slice(model.length - 2);
  if (modelUnderTheHood === "DT") {
    setMetricsInformation(metricsDT);
  } else {
    setMetricsInformation(metricsNB);
  }
}

const setMetricsInformation = (metrics) => {
  document.getElementById("Balanced-Accuracy").innerText = `Balanced Accuracy: ${metrics.balacc}`;
  document.getElementById("Sensitivity").innerText = `Sensitivity: ${metrics.sens}`;
  document.getElementById("Specificity").innerText = `Specificity: ${metrics.spec}`
}



/*
* Method to show the prediction text with prediction percentage
* 50% of the time and prediction text without prediction percentage 
* 50% of the time.
* Call this method in setPageElementsBasedOnPredictionInformation() method
* instead of:
* document.getElementById("result").innerText = predictionInformation.predictionText;
*/
const showPredictionPercentageForResultRandomly = (predictionInformation) => {
  const showPercentage = Math.random() < 0.5;
  const displayPrediction = showPercentage
    ? predictionInformation.prediction
    : predictionInformation.predictionText;
  document.getElementById("result").innerText = displayPrediction;
}
