# 3D Car Salon

## 🚗 About the Project
The **3D Car Salon** is an interactive web-based car showroom that allows users to explore, rotate, and customize cars in a virtual environment. Built using **Three.js**, this project aims to revolutionize the online car-buying experience by providing an immersive, realistic, and dynamic visualization of vehicles.

## ✨ Features
### 🎮 Interactive Showroom
- A modern, sleek 3D environment with polished floors and dynamic lighting.
- Individual platforms for car display with spotlight effects.

### 🚗 Real-Time Car Interaction
- Rotate and inspect car models from all angles.
- Smooth camera controls using **OrbitControls**.
- Toggle auto-rotation of cars.

### 🎨 Car Customization
- Change the car’s **color** dynamically.
- Adjust the **window opacity** for a realistic glass effect.

### 🌅 Dynamic Environment
- **Day/Night Mode**: Switch between different lighting conditions using HDR textures.
- **Real-time reflections** on the showroom floor for added realism.

### 📜 Car Information Panel
- Displays **make, model, year, price** when a car is selected.
- UI panel updates dynamically with selected car details.

## 🛠️ Technologies Used
- **Three.js** – 3D rendering
- **GLTFLoader** – Loading 3D car models
- **RGBELoader** – HDR environment maps
- **OrbitControls** – Smooth camera control
- **Reflector.js** – Realistic reflections

## 📂 Project Structure
```
3d-car-salon/
│── public/assets/                 # 3D models (.glb) and textures
│── src/
│   │── carManager.js       # Handles car loading, customization, and interactions
│   │── data.js             # Stores car information (make, model, year, price)
│   │── main.js             # Initializes scene, UI event listeners, and animations
│   │── scene.js            # Configures Three.js scene, lighting, and reflections
│   │── ui.js               # Handles UI updates and interactions
│── index.html              # Main entry point (HTML structure)
│── styles.css              # UI styling
│── README.md               # Project documentation
```

## 🔧 Setup & Installation
### Prerequisites
- Install **Node.js** and **npm** (if not already installed)

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/HaniAlija49/3dCarSaloon.git
cd 3dCarSaloon
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Run the Project
```sh
npm run dev
```

### 4️⃣ Open in Browser
Visit: `http://localhost:3000` (or the configured local server URL)

## 🚀 Usage Guide
1. **Select a Car**: Choose a car from the dropdown.
2. **Rotate & Zoom**: Click and drag to rotate, scroll to zoom.
3. **Customize**:
   - Change the **car color** using the color picker.
   - Adjust **window transparency** with the slider.
4. **Toggle Background**: Switch between **day/night** mode.
5. **Reset Camera**: Click the reset button to return to the default view.

## 🌟 Future Improvements
- More customization options (rims, decals, interior changes)
- Virtual test drive experience
- Integration with real-world car dealerships

## 🤝 Contributors
- **Hani Alija** ([GitHub](https://github.com/HaniAlija49))
- **Uvejs Murtezi** ([GitHub](https://github.com/UvejsMr))

## 🔍 Live Preview
Check out the live preview: [3D Car Salon](https://3d-car-saloon.vercel.app/)

---
💡 *Inspired to enhance the car-buying experience with immersive 3D technology!* 🚗💨

