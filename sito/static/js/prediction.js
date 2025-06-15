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

document.addEventListener('DOMContentLoaded', () => {
  // Popola il risultato nella pagina

  // Modifica la risposta in base alla percentuale
  const model = sessionStorage.getItem("model")
  const predictionText = sessionStorage.getItem("predictionText")
  const backgroundColor = sessionStorage.getItem("predictionBackgroundColor")
  const textColor = sessionStorage.getItem("predictionColor")

  console.log(sessionStorage.getItem("prediction"))
  
  // Nasconde la percentuale
  /*const rawPrediction = localStorage.getItem("prediction") || ":: Nessun risultato ::";
  const cleanedPrediction = rawPrediction.replace(/\d+% /, "");  // rimuove "23% "
  document.getElementById("result").innerText = cleanedPrediction;*/
  
  // Randomizza la visualizzazione della percentuale
  /*const rawPrediction = localStorage.getItem("prediction") || ":: Nessun risultato ::";
  const showPercentage = Math.random() < 0.5;
  const displayPrediction = showPercentage
    ? rawPrediction
    : rawPrediction.replace(/\d+% /, "");
  document.getElementById("result").innerText = displayPrediction;*/
  
  //Mostra la percentuale
  // document.getElementById("result").innerText = localStorage.getItem("prediction") || ":: Nessun risultato ::";
  
    
  document.getElementById("result").innerText = predictionText;
  document.getElementById("result").style.backgroundColor = backgroundColor;
  document.getElementById("result").style.color = textColor;
  document.getElementById("selected-model").innerText = `Selected Model: ${model.slice(0, model.length - 3)}`;

  checkIfModelIsDT(model);

  // Listener per bottone Indietro
  const backBtn = document.getElementById("back-button");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "/";
	  //history.back();
    });
  }

  // Listener per invio del form feedback
  const form = document.getElementById("feedback");
  if (form) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();

      const reliability = document.querySelector('input[name="reliability"]:checked')?.value;
      const usefulness = document.querySelector('input[name="usefulness"]:checked')?.value;
      const influence = document.querySelector('input[name="influence"]:checked')?.value;
      const recommendability = document.getElementById("recommendability").value;
      const reason = String(document.getElementById("reason").value);

      const feedback = {
        datetime: localStorage.getItem("datetime"),
        q1: reliability,
        q2: usefulness,
        q3: influence,
        q4: recommendability,
        q5: reason
      };

      fetch("/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(feedback)
      })
      .then(response => response.json())
      .then(data => {
		console.log("✅ Risposta dal server:", data);
		//document.getElementById("feedback-confirmation").innerText = "✅ Feedback saved successfully.";
		const confirmation = document.getElementById("feedback-confirmation");
		confirmation.innerText = "✅ Feedback saved successfully.";
		
		// Inverti i colori dei pulsanti Send e Back
		const sendBtn = document.getElementById("form-submit");
		const backBtn = document.getElementById("back-button");

		if (sendBtn && backBtn) {
		  const sendStyles = getComputedStyle(sendBtn);
		  const backStyles = getComputedStyle(backBtn);
		  
		  if (sendBtn) sendBtn.disabled = true;

		  sendBtn.style.backgroundColor = backStyles.backgroundColor;
		  sendBtn.style.color = backStyles.color;
		  sendBtn.style.border = "1px solid black";

		  backBtn.style.backgroundColor = "#007bff"; 
		  backBtn.style.color = "white";
		  backBtn.style.border = "none";

		  // disattiva effetto hover e focus
		  backBtn.classList.add("no-hover-focus");
		}

		// Dopo 1 secondo, torna a index.html
		// setTimeout(() => {
		// window.location.href = "/";
		// }, 1500);
		
		//history.back();
      })
      .catch(error => {
        console.error("❌ Errore nell'invio del questionario:", error);
      });
    });
  }
});

const checkIfModelIsDT = (model) => {
  const underTheHood = model.slice(0, model.length - 3);
  const dtButton = document.getElementById("show-DT-button");
  if (underTheHood === "Explainable") {
    dtButton.style.display = "block";
    setEventListenersForDTPlot();
    setMetricsInformation(metricsDT)
  } else {
    dtButton.style.display = "none";
    setMetricsInformation(metricsNB)
  }
}

const setEventListenersForDTPlot = () => {
  document.getElementById("show-DT-button").addEventListener("click", () => showDT());
  
  document.getElementById("DT-Modal").addEventListener("click", () => closeDT());

  document.getElementById("inner-modal").addEventListener("click", (event) => preventEventPropagationForDTModal(event));
}

const showDT = () => {
  document.getElementsByClassName("modal")[0].style.display = "block";
}

const closeDT = () => {
  document.getElementsByClassName("modal")[0].style.display = "none"
}

const preventEventPropagationForDTModal = (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  return false;
}

const setMetricsInformation = (metrics) => {
  document.getElementById("Balanced-Accuracy").innerText = `Balanced Accuracy: ${metrics.balacc}`;
  document.getElementById("Sensitivity").innerText = `Sensitivity: ${metrics.sens}`;
  document.getElementById("Specificity").innerText = `Specificity: ${metrics.spec}`
}
const setMetricsInformation = (metrics) => {
  document.getElementById("Balanced-Accuracy").innerText = `Balanced Accuracy: ${metrics.balacc}`;
  document.getElementById("Sensitivity").innerText = `Sensitivity: ${metrics.sens}`;
  document.getElementById("Specificity").innerText = `Specificity: ${metrics.spec}`
}
