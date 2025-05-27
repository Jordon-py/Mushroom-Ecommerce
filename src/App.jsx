// ================================
// App.jsx
// ================================
// This is the main entry point of your React SPA.
// It handles global layout, page routing, and theme (light/dark mode) state.
// The App component renders the sidebar, background, header banner, main content, and footer.
// All primary app logic and layout structure is managed here for clarity and scalability.
//
// Key Concepts Covered:
//   • React state for theme toggling
//   • Prop drilling for consistent theme state
//   • SPA routing with react-router-dom
//   • Clean component organization
// ================================

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Importing custom components and assets
import WelcomeBanner from "./components/WelcomeBanner";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";
import "./App.css"; // App-wide styles

// Example main content page components (should be split into separate files as your app grows)
function Home() {
  return <h1>Welcome to Magic Mushrooms!</h1>;
}
function Shop() {
  return <h1>Shop for Spores & Grow Kits</h1>;
}
function Mycology101() {
  return <h1>Learn Mycology 101</h1>;
}
function About() {
  return <h1>About This Project</h1>;
}

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
  const buttonText = lightMode ? "Switch to Dark Mode" : "Switch to Light Mode";
  // Use public folder paths for images
  const backgroundImg = lightMode ? "/Shrooms_0.png" : "/Shrooms_3.png";
  return (
    <>
      {/* Background artwork is visually placed behind the main content */}
      <span className="App-Background" id="background">
        {/* Use asset directly as src in JSX */}
        <img src={backgroundImg} alt="Background" className="background" aria-hidden="true" />
      </span>

      <div className={appSectionClass}>
        {/* Sidebar navigation stays visible for quick access */}
        <SideBar />
        <main className="main-content">
          <WelcomeBanner backgroundImg={backgroundImg} appSectionClass={appSectionClass} />
          {/* Theme toggle button: always visible and accessible */}
          <button
            className={buttonClass}
            onClick={toggleLightMode}
            aria-label="Toggle light and dark mode"
          >
            {buttonText}
          </button>

          {/* Single Page App Routing (each route displays a different page/component) */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/mycology" element={<Mycology101 />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>

      {/* Footer appears at the bottom of every page */}
      <Footer />
    </>
  );
}
