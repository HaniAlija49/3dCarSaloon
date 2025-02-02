// src/carManager.js
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { scene } from "./scene.js";
import { showCarDetails } from "./ui.js";

let carModel = null;

export function loadCarModel(car) {
  // Remove any previous model
  if (carModel) {
    scene.remove(carModel);
  }

  // Optional: create and display a loader spinner
  const loaderSpinner = document.createElement("div");
  loaderSpinner.id = "loader";
  loaderSpinner.style =
    "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);";
  document.body.appendChild(loaderSpinner);

  const loader = new GLTFLoader();
  loader.load(
    `/assets/${car.glb}`,
    (gltf) => {
      document.body.removeChild(loaderSpinner);
      carModel = gltf.scene;
      carModel.scale.set(2, 2, 2);
      carModel.castShadow = true;
      carModel.receiveShadow = true;
      carModel.position.y = -1.9;

      carModel.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = true;
          if (child.name.includes("glass")) {
            child.material.opacity = 0.5;
            child.material.transparent = true;
          }
          if (child.name.includes("Plane")) {
            child.material.opacity = 0;
            child.material.transparent = true;
          }
        }
      });

      scene.add(carModel);
      showCarDetails(car);
    },
    undefined,
    (error) => {
      document.body.removeChild(loaderSpinner);
      console.error("Error loading GLTF model:", error);
    }
  );
}

export function changeCarColor(color) {
  if (carModel) {
    carModel.traverse((child) => {
      if (child.isMesh && child.name.includes("body")) {
        child.material.color.set(color);
      }
    });
  }
}

export function windowChangeOpacity(opacity) {
  if (carModel) {
    carModel.traverse((child) => {
      if (child.isMesh && child.name.includes("glass")) {
        child.material.opacity = opacity;
        child.material.transparent = true;
      }
    });
  }
}

// For animation purposes
export function updateCarRotation(delta = 0.002) {
  if (carModel) {
    carModel.rotation.y += delta;
  }
}
