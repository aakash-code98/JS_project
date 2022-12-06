export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country, Zip Code");
};

export const addSpinner = (el) => {
  animateButton(el);
  setTimeout(animateButton, 1000, el);
};

const animateButton = (el) => {
  el.classList.toggle("none");
  el.nextElementSibling.classList.toggle("block");
  el.nextElementSibling.classList.toggle("none");
};

export const displayError = (headerMsg, srMsg) => {
  updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (msg) => {
  const h1 = document.getElementById("currentForecast__location");
  h1.textContent = msg;
};

export const updateScreenReaderConfirmation = (msg) => {
  document.getElementById("confirmation").textContent = msg;
};
