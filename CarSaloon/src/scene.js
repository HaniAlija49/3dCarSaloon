// src/scene.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";

export let scene, camera, renderer, controls;

export function initScene() {
  scene = new THREE.Scene();

  // Initial background is loaded in main.js using loadBackground()
  // Set up camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-9, 2, -8);

  // Set up renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // Lights and reflective ground (your existing configuration)
  const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.set(1024, 1024);
  scene.add(directionalLight);

  const spotLight1 = new THREE.SpotLight(0xffffff, 1);
  spotLight1.position.set(-5, 10, 5);
  spotLight1.angle = Math.PI / 6;
  spotLight1.castShadow = true;
  scene.add(spotLight1);

  const spotLight2 = new THREE.SpotLight(0xffffff, 1);
  spotLight2.position.set(5, 10, -5);
  spotLight2.angle = Math.PI / 6;
  spotLight2.castShadow = true;
  scene.add(spotLight2);

  const groundMirror = new Reflector(new THREE.CircleGeometry(6, 64), {
    clipBias: 0.003,
    textureWidth: 512,
    textureHeight: 512,
    color: 0xfffff0,
  });
  groundMirror.rotation.x = -Math.PI / 2;
  groundMirror.position.y = -2;
  scene.add(groundMirror);

  const groundFloor = new Reflector(new THREE.CircleGeometry(15, 64), {
    clipBias: 0.003,
    textureWidth: 512,
    textureHeight: 512,
    color: 0x00000,
  });
  groundFloor.rotation.x = -Math.PI / 2;
  groundFloor.position.y = -1.9;
  scene.add(groundFloor);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.maxPolarAngle = Math.PI / 2;

  controls.maxDistance = 13; // 🔹 Maximum zoom-out distance
}

export function render() {
  renderer.render(scene, camera);
}

// Load background using RGBELoader
export function loadBackground(path) {
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(
    path,
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = texture;
    },
    undefined,
    (error) => {
      console.error("Error loading background:", error);
    }
  );
}
