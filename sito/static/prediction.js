window.onload = () => {
  // Popola il risultato nella pagina

  // Modifica la risposta in base alla percentuale
	const rawPrediction = localStorage.getItem("prediction") || ":: Nessun risultato ::";

  const match = rawPrediction.match(/(\d+)%/);  // cattura "23%" ovunque
  let displayPrediction = ":: Invalid prediction format ::";

  if (match) {
    const percent = parseInt(match[1]);

    if (percent < 5) {
      displayPrediction = "Most Likely Benign";
    } else if (percent < 45) {
      displayPrediction = "Likely Benign";
    } else if (percent <= 55) {
      displayPrediction = "Uncertain Case";
    } else if (percent <= 95) {
      displayPrediction = "Likely Malignant";
    } else {
      displayPrediction = "Most Likely Malignant";
    }
  } else {
    displayPrediction = rawPrediction.replace(/\d+% /, "");  // fallback se non è presente la percentuale
  }

  document.getElementById("result").innerText = displayPrediction;
  
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
  
  document.getElementById("result").style.backgroundColor = localStorage.getItem("predictionBackgroundColor") || "#f0f0f0";
  document.getElementById("result").style.color = localStorage.getItem("predictionColor") || "black";
  document.getElementById("selected-model").innerText = `Selected Model: ${localStorage.getItem("model") || "-"}`;

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

      fetch("/questionario", {
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

		// Dopo 1 secondo, torna a index.html
		setTimeout(() => {
		window.location.href = "/";
		}, 1500);
		
		//history.back();
      })
      .catch(error => {
        console.error("❌ Errore nell'invio del questionario:", error);
      });
    });
  }
};
