window.onload = () => {
  document.getElementById("selected-model").innerText = `Selected Model: ${localStorage.getItem("model")}`

  document.getElementById("result").innerText = `${localStorage.getItem("prediction")}`;
  document.getElementById("result").style.backgroundColor = `${localStorage.getItem("predictionBackgroundColor")}`;
  document.getElementById("result").style.color = `${localStorage.getItem("predictionColor")}`;
}