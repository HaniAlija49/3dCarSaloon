import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let scene, camera, renderer, controls, carModel;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF); // Set background color to white

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5); // Set camera above the ground

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;  // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  // Optional: set shadow map type
    document.body.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 2);  // Increased intensity
    scene.add(ambientLight);

    // Directional Light (strong global lighting)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    directionalLight.castShadow = true; // Enable shadow casting
    directionalLight.shadow.mapSize.width = 1024;  // Set shadow map size for quality
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5; // Shadow camera near plane
    directionalLight.shadow.camera.far = 10;  // Shadow camera far plane
    directionalLight.shadow.camera.left = -5;  // Adjust shadow camera frustum
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    scene.add(directionalLight);

    // SpotLight setup (focused lighting)
    const spotLight = new THREE.SpotLight(0xffffff, 1, 50, Math.PI / 6, 0.1, 1);
    spotLight.position.set(5, 5, 5);
    spotLight.castShadow = true;  // Enable shadow casting
    spotLight.shadow.mapSize.width = 1024;  // Set shadow map size for quality
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);
    scene.add(spotLight.target);  // Set spotlight target

    // Point Light (global omnidirectional lighting)
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 5, 0);  // Position it above the scene
    pointLight.castShadow = true;  // Enable shadow casting
    pointLight.shadow.mapSize.width = 1024;  // Set shadow map size for quality
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);

    // Hemisphere Light (soft light from two hemispheres)
    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x444444, 1.5); // Top light: light blue, bottom light: dark gray
    hemisphereLight.position.set(0, 5, 0);
    scene.add(hemisphereLight);

    // Orbit controls for the camera
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;  // Limit the camera's vertical movement (no going below the ground)
    controls.minDistance = 2;  // Prevent the camera from getting too close to the ground
    controls.maxDistance = 20;  // Optional: Limit how far the camera can zoom out

    // Circular shiny black ground setup
    const circleGeometry = new THREE.CircleGeometry(6, 64); // Outer circle radius 10
    const innerCircleGeometry = new THREE.CircleGeometry(6.5, 64); // Inner circle with slightly smaller radius for the border

    // Material for the border (light blue)
    const borderMaterial = new THREE.MeshStandardMaterial({
        color: 0xADD8E6, // Light blue color for the border
        metalness: 0.5,   // Medium metalness for reflection
        roughness: 0.2,   // Slightly more rough than the main circle for distinction
        envMapIntensity: 1, // Reflection intensity
    });

    // Material for the main thick circle (black)
    const shinyBlackMaterial = new THREE.MeshStandardMaterial({
        color: 0xD3D3D3, // Black color for the circle
        metalness: 0.5,    // High metalness for shininess
        roughness: 0.1,  // Low roughness for smooth reflection
        envMapIntensity: 1, // Set the environment map intensity for reflections
    });

    // Create the main circle (thick circle)
    const circleGround = new THREE.Mesh(circleGeometry, shinyBlackMaterial);
    circleGround.rotation.x = - Math.PI / 2;  // Make it flat on the x-axis
    circleGround.position.y = -2.9;  // Position it below the car
    circleGround.receiveShadow = true;  // Enable shadow reception on the ground

    // Create the border circle (smaller, light blue border)
    const borderCircle = new THREE.Mesh(innerCircleGeometry, borderMaterial);
    borderCircle.rotation.x = - Math.PI / 2;  // Align it with the main circle
    borderCircle.position.y = -3;  // Position it at the same height as the main circle

    // Add both meshes to the scene
    scene.add(circleGround);
    scene.add(borderCircle);

    // Initial car model load
    loadCarModel('Mercedes.glb');  // Default model to load initially

    // Event listener for color change
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', (event) => {
        const color = event.target.value;
        changeCarColor(color);
    });

    // Event listener for window opacity change
    const windowOpacitySlider = document.getElementById('windowOpacitySlider');
    windowOpacitySlider.addEventListener('input', (event) => {
        const opacity = event.target.value;
        windowChangeOpacity(opacity);
    });

    // Event listener for model change
    const loadCarBtn = document.getElementById('loadCarBtn');
    loadCarBtn.addEventListener('click', () => {
        const selectedModel = document.getElementById('carModelSelect').value;
        loadCarModel(selectedModel);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function loadCarModel(modelPath) {
    // Remove existing car model (if any)
    if (carModel) {
        scene.remove(carModel);
    }

    // Load new car model
    const loader = new GLTFLoader();
    loader.load(`/src/assets/${modelPath}`, (gltf) => {
        carModel = gltf.scene;
        carModel.scale.set(2, 2, 2);  // Scale the car model as needed
        carModel.castShadow = true;  // Enable shadow casting for the car
        carModel.receiveShadow = true;  // Enable shadow reception for the car
        carModel.position.y = -2.9;  // Set car position to sit on the ground (y = 0)
        carModel.traverse((child) => {
            console.log(child.name)
            
            if (child.isMesh ) {
                if(child.name.includes('Plane')){
                    child.material.opacity = 0;
                    child.material.transparent = true;
                }
                if(child.name.includes('glass')){
                    child.material.opacity = 0.5;  // Change opacity
                    child.material.transparent = true;  // Ensure material is transparent
                }
                
            }
        });
        scene.add(carModel);
        showCarDetails(carModel);  // Show details when the car is loaded
    });
}

function changeCarColor(color) {
    if (carModel) {
        carModel.traverse((child) => {
            if (child.isMesh && child.name.includes('body',0)) {
                child.material.color.set(color);
            }
        });
    }
}

function windowChangeOpacity(opacity) {
    if (carModel) {
        carModel.traverse((child) => {
            if (child.isMesh && child.name.includes('glass')) {
                child.material.color.set("000000")
                child.material.opacity = opacity;  // Change opacity
                child.material.transparent = true;  // Ensure material is transparent
            }
        });
    }
}

function showCarDetails(car) {
    const details = document.getElementById('carDetails');
    details.style.display = 'block';
    document.getElementById('carInfo').innerText = `Make: ${car.make}, Model: ${car.model}`;
}

init();
