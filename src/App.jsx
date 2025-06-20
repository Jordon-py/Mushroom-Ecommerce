// ================================
// App.jsx - Main Application Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~75
//   • Complexity: Medium (theme state + routing)
//   • Dependencies: react, react-router-dom
//   • Child Components: 5 (Footer, SideBar, All Views)
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
// 🚨 RECENT FIXES APPLIED:
//   • ✅ Removed all morphing component references
//   • ✅ Cleaned up routing to core pages only
//   • ✅ Simplified app structure
//
// 💡 ACCESSIBILITY FEATURES:
//   • aria-label on theme toggle button
//   • aria-hidden on decorative background image
// ================================

import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar"
// =========================================
// Import all page components
// ===========================================
import Home from "./views/Home";
import Shop from "./views/Shop";
import Mycology101 from "./views/Mycology101";
import About from "./views/About";
import AdminDashboard from "./views/AdminDashboard";

export default function App() {
  // -------------------------------
  // State: Controls the light/dark mode for the app
  // -------------------------------
  // Default theme is set to light mode for better readability and user preference.
  const [lightMode, setLightMode] = useState(true);

  // Toggle theme handler
  const toggleLightMode = () => setLightMode((prev) => !prev);

  // Dynamically select class names and assets based on theme
  const buttonClass = lightMode ? "button-light-mode" : "button-dark-mode";
  const appSectionClass = lightMode ? "App light-mode" : "App dark-mode";
  const themeIcon = lightMode ? "🌙" : "☀️";
  const themeLabel = lightMode ? "Switch to Dark Mode" : "Switch to Light Mode";
  const backgroundImg = lightMode ? "/Shrooms_0.png" : "/Shrooms_3.png";

   useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      lightMode ? 'light' : 'dark'
     );
   }, [lightMode]);

  return (
    <>
      {/* Background artwork is visually placed behind the main content */}
      <Background
        backgroundImg={backgroundImg}
      />

      {/* Theme toggle button: always visible and accessible */}
      <button
        className={buttonClass}
        onClick={toggleLightMode}
        aria-label={themeLabel}
        title={themeLabel}
      >
        <span className="theme-icon" aria-hidden="true">{themeIcon}</span>
        <span className="sr-only">{themeLabel}</span>
      </button>
      <SideBar />
      {/* Main application content with routing */}
      <div className={appSectionClass}>
        {/* Single Page App Routing */}
        <Routes>
          <Route path="/" element={<Home lightMode={lightMode} appSectionClass={appSectionClass} />} />
          <Route path="/shop" element={<Shop lightMode={lightMode} />} />
          <Route path="/mycology" element={<Mycology101 lightMode={lightMode} />} />
          <Route path="/about" element={<About lightMode={lightMode} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      {/* Footer appears at the bottom of every page */}
      <Footer />
    </>
  );
}
