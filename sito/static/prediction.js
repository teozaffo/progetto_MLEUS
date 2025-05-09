window.onload = () => {
  document.getElementById("selected-model").innerText = `Selected Model: ${localStorage.getItem("model")}`

  document.getElementById("result").innerText = `${localStorage.getItem("prediction")}`;
  document.getElementById("result").style.backgroundColor = `${localStorage.getItem("predictionBackgroundColor")}`;
  document.getElementById("result").style.color = `${localStorage.getItem("predictionColor")}`;
}

document,addEventListener('DOMContentLoaded', () => {
  document
    .getElementById("feedback")
    .addEventListener(
      "submit",
      (event) => submitFeedbackForm(event)
    );
})

const submitFeedbackForm = (event) => {
  event.preventDefault();

  const reliability = document
    .querySelector('input[name="reliability"]:checked')?.value;
  
  const usefulness = document
    .querySelector('input[name="usefulness"]:checked')?.value;

  const influence = document
    .querySelector('input[name="influence"]:checked')?.value;

  const recommendability = document
    .getElementById('recommendability').value;

  const reason = document
    .getElementById('reason').value;

  const feedback = {
    reliability,
    usefulness,
    influence,
    recommendability,
    reason
  };

  console.log(feedback);
}