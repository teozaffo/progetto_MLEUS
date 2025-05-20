window.onload = () => {
  // Popola il risultato nella pagina
  
  // Nasconde la percentuale
  const rawPrediction = localStorage.getItem("prediction") || ":: Nessun risultato ::";
  const cleanedPrediction = rawPrediction.replace(/\d+% /, "");  // rimuove "23% "
  document.getElementById("result").innerText = cleanedPrediction;
  
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
      const reason = document.getElementById("reason").value;

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
