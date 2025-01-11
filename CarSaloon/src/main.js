import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

let scene, camera, renderer, controls, carModel;
const carsData = [
    { make: "Mercedes", model: "S-Class", year: "2023", glb: "Mercedes.glb" },
    { make: "Audi", model: "Q5", year: "2023", glb: "audi.glb" },
    { make: "Volvo", model: "s60", year: "2023", glb: "s60.glb" }
];

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Load HDRI Environment using RGBELoader
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/src/assets/background.hdr', (hdrTexture) => {
        hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdrTexture; // Set as environment map for reflections
        scene.background = hdrTexture; // Set as background
    }, undefined, (error) => {
        console.error('Failed to load HDR:', error);
    });

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 13);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5); // Increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Additional Spotlights for dynamic lighting
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

    // Reflective ground setup
    const groundMirror = new Reflector(new THREE.CircleGeometry(6, 64), {
        clipBias: 0.003,
        textureWidth: 512,
        textureHeight: 512,
        color: 0xfffff0
    });
    groundMirror.rotation.x = -Math.PI / 2;
    groundMirror.position.y = -1.9;
    scene.add(groundMirror);

    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.maxPolarAngle = Math.PI / 2;

    // Populate dropdown and load the first model
    populateCarDropdown();
    loadCarModel(carsData[0]);

    // UI Event listeners
    document.getElementById('colorPicker').addEventListener('input', (event) => changeCarColor(event.target.value));
    document.getElementById('windowOpacitySlider').addEventListener('input', (event) => windowChangeOpacity(event.target.value));
    document.getElementById('loadCarBtn').addEventListener('click', () => {
        const selectedIndex = document.getElementById('carModelSelect').value;
        loadCarModel(carsData[selectedIndex]);
    });

    animate();
}

function populateCarDropdown() {
    const dropdown = document.getElementById('carModelSelect');
    carsData.forEach((car, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.text = `${car.make} ${car.model} (${car.year})`;
        dropdown.appendChild(option);
    });
}

let frame = 0;

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (carModel) {
        carModel.rotation.y += 0.002; // Spin the car
    }
    if (frame % 2 === 0) { // Skip every other frame to reduce load
        renderer.render(scene, camera);
    }
    frame++;
}

function loadCarModel(car) {
    if (carModel) scene.remove(carModel);

    const loader = new GLTFLoader();
    const loaderSpinner = document.createElement('div');
    loaderSpinner.id = 'loader';
    loaderSpinner.style = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);';
    document.body.appendChild(loaderSpinner);

    loader.load(`/src/assets/${car.glb}`, (gltf) => {
        document.body.removeChild(loaderSpinner);
        carModel = gltf.scene;
        carModel.scale.set(2, 2, 2);
        carModel.castShadow = true;
        carModel.receiveShadow = true;
        carModel.position.y = -1.9;

        carModel.traverse((child) => {
            if (child.isMesh) {
                child.frustumCulled = true; // Optimize by culling unseen objects
                if (child.name.includes('glass')) {
                    child.material.opacity = 0.5;
                    child.material.transparent = true;
                }
                if (child.name.includes('Plane')) {
                    child.material.opacity = 0;
                    child.material.transparent = true;
                }
            }
        });

        scene.add(carModel);
        showCarDetails(car);
    });
}

function changeCarColor(color) {
    if (carModel) {
        carModel.traverse((child) => {
            if (child.isMesh && child.name.includes('body')) {
                child.material.color.set(color);
            }
        });
    }
}

function windowChangeOpacity(opacity) {
    if (carModel) {
        carModel.traverse((child) => {
            if (child.isMesh && child.name.includes('glass')) {
                child.material.opacity = opacity;
                child.material.transparent = true;
            }
        });
    }
}

function showCarDetails(car) {
    const details = document.getElementById('carDetails');
    details.style.display = 'block';
    document.getElementById('carInfo').innerHTML = `
        Make: ${car.make}<br>
        Model: ${car.model}<br>
        Year: ${car.year}
    `;
}

init();
