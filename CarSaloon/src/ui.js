// src/ui.js
import { loadCarModel, changeCarColor, windowChangeOpacity } from "./carManager.js";
import { carsData } from "./data.js";

export function populateCarDropdown() {
  const dropdown = document.getElementById("carModelSelect");
  carsData.forEach((car, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `${car.make} ${car.model} (${car.year})`;
    dropdown.appendChild(option);
  });
}

export function setupUIEventListeners() {
  // Color Picker
  document.getElementById("colorPicker").addEventListener("input", (event) => {
    changeCarColor(event.target.value);
  });

  // Window opacity slider
  document.getElementById("windowOpacitySlider").addEventListener("input", (event) => {
    windowChangeOpacity(event.target.value);
  });

  // Load car button
  document.getElementById("loadCarBtn").addEventListener("click", () => {
    const selectedIndex = document.getElementById("carModelSelect").value;
    loadCarModel(carsData[selectedIndex]);
  });
}

export function showCarDetails(car) {
  const details = document.getElementById("carDetails");
  details.style.display = "block";
  document.getElementById("carInfo").innerHTML = `
    Make: ${car.make}<br>
    Model: ${car.model}<br>
    Year: ${car.year}<br>
    Price: ${car.price}
  `;
}
