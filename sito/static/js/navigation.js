// navigation logic for Single Page App

export const navigateTo = (path) => {
  history.pushState({}, '', path);
  handleRoute(path);
}

export const handleRoute = (path) => {
  if (path === '/prediction') {
    showFeedbackContainer();
  } else if (path === '/') {
    showPredictorContainer();
  }
}

const showPredictorContainer = () => {
  const feedbackForm = document.getElementById("feedback");

  if (feedbackForm) feedbackForm.reset();

  resetPredictionForm()

  document.getElementById("feedback-container").hidden = true;
  document.getElementById("predictor-container").hidden = false;
}

const showFeedbackContainer = () => {
  const inputForm = document.getElementById("inputForm");

  if (inputForm) inputForm.reset();

  checkAndHandleIfPredictorIsDT()

  const confirmation = document.getElementById("feedback-confirmation");
  confirmation.innerText = "";

  document.getElementById("predictor-container").hidden = true;
  document.getElementById("feedback-container").hidden = false;
}

const resetPredictionForm = () => {
  const models = ['DT', 'RF'];

  models.forEach(m => {
    document.getElementById(m).classList.remove('clicked');
  })

  document.getElementById("inputForm").hidden = true;
}

const checkAndHandleIfPredictorIsDT = () => {
  if (sessionStorage.getItem("model") === "DT") {
    document.getElementById("show-DT-button").style.display = "block";
  } else {
    document.getElementById("show-DT-button").style.display = "none";
  }
}