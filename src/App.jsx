// ================================
// App.jsx - Main Application Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~101
//   • Complexity: Medium (theme state + routing)
//   • Dependencies: react, react-router-dom
//   • Child Components: 9 (Footer, MorphingComponent, All Views)
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Global theme management (light/dark mode)
//   • SPA routing configuration
//   • Background image handling
//   • Layout structure coordination
//
// 🔄 STATE MANAGEMENT:
//   • lightMode: boolean - Controls app-wide theme
//   • Derived state: buttonClass, appSectionClass, buttonText, backgroundImg
//
// 🚨 POTENTIAL IMPROVEMENTS:
//   • Consider moving theme to Context API for deeper component trees
//   • Background image preloading for better UX
//   • Theme persistence in localStorage
//
// 💡 ACCESSIBILITY FEATURES:
//   • aria-label on theme toggle button
//   • aria-hidden on decorative background image
// ================================

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Importing custom components and assets
import Footer from "./components/Footer";
import "./App.css"; // App-wide styles

// Import all page components
import Home from "./views/Home";
import Shop from "./views/Shop";
import Mycology101 from "./views/Mycology101";
import About from "./views/About";
import { ViewOne, ViewTwo, ViewThree } from "./components/MorphDemoViews";


export default function App() {
  // -------------------------------
  // State: Controls the light/dark mode for the app
  // Placing theme state at the top level lets you easily pass it as a prop to any component
  // -------------------------------
  const [lightMode, setLightMode] = useState(true);

  // Toggle theme handler
  const toggleLightMode = () => setLightMode((prev) => !prev);

  // Dynamically select class names and assets based on theme
  const buttonClass = lightMode ? "button-light-mode" : "button-dark-mode";
  const appSectionClass = lightMode ? "App light-mode" : "App dark-mode";
  const buttonText = lightMode ? "Switch to Dark Mode" : "Switch to Light Mode";  // Use public folder paths for images
  const backgroundImg = lightMode ? "/Shrooms_0.png" : "/Shrooms_3.png";
  
  return (
    <>
      {/* Background artwork is visually placed behind the main content */}
      <span className="App-Background" id="background">
        {/* Use asset directly as src in JSX */}
        <img src={backgroundImg} alt="Background" className="background" aria-hidden="true" />
      </span>
      {/* Theme toggle button: always visible and accessible */}
      <button
        className={buttonClass}
        onClick={toggleLightMode}
        aria-label="Toggle light and dark mode"
      >
        {buttonText}
      </button>

      {/* Main application content with routing */}
      <div className={appSectionClass}>
        {/* Single Page App Routing (each route displays a different page/component) */}
        <Routes>
          <Route path="/" element={<Home lightMode={lightMode} appSectionClass={appSectionClass} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/mycology" element={<Mycology101 />} />
          <Route path="/about" element={<About viewList={[ ViewOne, ViewTwo, ViewThree ]} />} />
        </Routes>
      </div>

      {/* Footer appears at the bottom of every page */}
      <Footer />
    </>
  );
}
