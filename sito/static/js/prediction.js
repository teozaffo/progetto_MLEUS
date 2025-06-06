import { navigateTo } from "./navigation.js";
// logic for the feedback "page"


document.addEventListener('DOMContentLoaded', () => {
  const target = document.getElementById('feedback-container');

  const observer = new MutationObserver(() => {
    if (!target.hidden) {
      console.log("now at prediction result");

      // Popola il risultato nella pagina

      // Modifica la risposta in base alla percentuale

      //const match = rawPrediction.match(/(\d+)%/);  // cattura "23%" ovunque
      // default se il formato del prediction non è valido 
      // (alternativa: settare la logica del testo in backend)
      const displayPrediction = sessionStorage.getItem("prediction");
      const backgroundColor = sessionStorage.getItem("predictionBackgroundColor");
      const textColor = sessionStorage.getItem("predictionColor");

      document.getElementById("result").innerText = displayPrediction;
      
      // Nasconde la percentuale
      /*const rawPrediction = sessionStorage.getItem("prediction") || ":: Nessun risultato ::";
      const cleanedPrediction = rawPrediction.replace(/\d+% /, "");  // rimuove "23% "
      document.getElementById("result").innerText = cleanedPrediction;*/
      
      // Randomizza la visualizzazione della percentuale
      /*const rawPrediction = sessionStorage.getItem("prediction") || ":: Nessun risultato ::";
      const showPercentage = Math.random() < 0.5;
      const displayPrediction = showPercentage
        ? rawPrediction
        : rawPrediction.replace(/\d+% /, "");
      document.getElementById("result").innerText = displayPrediction;*/
      
      //Mostra la percentuale
      // document.getElementById("result").innerText = sessionStorage.getItem("prediction") || ":: Nessun risultato ::";
      
      document.getElementById("result").style.backgroundColor = backgroundColor || "#f0f0f0";
      document.getElementById("result").style.color = textColor || "black";
      document.getElementById("selected-model").innerText = `Selected Model: ${sessionStorage.getItem("model") || "-"}`;

      // Listener per bottone Indietro
      const backBtn = document.getElementById("back-button");
      if (backBtn) {
        backBtn.addEventListener("click", () => {
          navigateTo('/')
        });
      }
    }
  })

  observer.observe(target, { attributes: true, attributeFilter: ['hidden'] });
})

window.onload = () => {
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
        datetime: sessionStorage.getItem("datetime"),
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
      navigateTo('/')
    }, 1500);
      })
      .catch(error => {
        console.error("❌ Errore nell'invio del questionario:", error);
      });
    });
  }
}


