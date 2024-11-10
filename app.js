// Base URL for the API (replace with your actual API key)
const BASE_URL = "https://v6.exchangerate-api.com/v6/71b5ac9459486ccd5f067245/latest/"; // Use the API key you provided

// Cache DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Function to populate dropdowns with currencies
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Default to 1 if no valid input
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Build the request URL
  const URL = `${BASE_URL}${fromCurr.value}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate.");
    }

    let data = await response.json();
    if (data.result === "success") {
      let rate = data.conversion_rates[toCurr.value]; // Fetch the conversion rate
      let finalAmount = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } else {
      msg.innerText = "Error fetching exchange rate.";
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    msg.innerText = "Error fetching exchange rate. Please try again later.";
  }
};

// Function to update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for the "Get Exchange Rate" button
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load initial exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
