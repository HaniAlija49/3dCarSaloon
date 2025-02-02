// src/main.js
import { initScene, render, controls, loadBackground } from "./scene.js";
import { loadCarModel, updateCarRotation } from "./carManager.js";
import { populateCarDropdown, setupUIEventListeners } from "./ui.js";
import { carsData } from "./data.js";

// Define your two background paths (adjust the paths as needed)
const dayBackground = "/assets/background.hdr";
const nightBackground = "/assets/moonless_golf_1k.hdr";

let rotationEnabled = true;
let isDay = true;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (rotationEnabled) {
    updateCarRotation(0.002);
  }
  render();
}

function init() {
  initScene();

  // Load initial background (day)
  loadBackground(dayBackground);

  populateCarDropdown();
  setupUIEventListeners();
  loadCarModel(carsData[0]);

  // Background toggle event listener
  const toggleBackgroundBtn = document.getElementById("toggleBackgroundBtn");
  toggleBackgroundBtn.addEventListener("click", () => {
    if (isDay) {
      // Switch to night background
      loadBackground(nightBackground);
      // Update the icon to show the sun (indicating you can click to go back to day)
      toggleBackgroundBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      // Switch to day background
      loadBackground(dayBackground);
      // Update the icon to show the moon (indicating you can click to go to night)
      toggleBackgroundBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
    isDay = !isDay;
  });

  // Set up additional UI event listeners for rotation and camera reset
  const toggleRotationBtn = document.getElementById("toggleRotationBtn");
  const resetCameraBtn = document.getElementById("resetCameraBtn");

  toggleRotationBtn.addEventListener("click", () => {
    rotationEnabled = !rotationEnabled;
    // Toggle icon: pause for active rotation, play for stopped rotation.
    toggleRotationBtn.innerHTML = rotationEnabled
      ? '<i class="fas fa-pause"></i>'
      : '<i class="fas fa-play"></i>';
  });

  resetCameraBtn.addEventListener("click", () => {
    controls.reset();
  });

  animate();
}

init();
