import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Background from './components/Background';
import Footer from './components/Footer';
import SideBar from './components/SideBar';
import Home from './views/Home';
import Shop from './views/Shop';
import Mycology101 from './views/Mycology101';
import About from './views/About';
import AdminDashboard from './views/AdminDashboard';

/*
  NEXT STEP #5 (Security + operational readiness):
  Protect /admin with authentication + role checks.

  Why here?
  - Routing is defined in App.jsx, so access control should be enforced at route level.

  Educational implementation example:
  import ProtectedRoute from './components/ProtectedRoute';

  <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  ProtectedRoute should:
  1) Redirect unauthenticated users to /login.
  2) Render 403-style UI for authenticated users without admin role.
  3) Log access-denied events to analytics for security visibility.
*/
export default function App() {
  const [lightMode, setLightMode] = useState(true);

  const toggleLightMode = () => setLightMode((prev) => !prev);

  const buttonClass = lightMode ? 'button-light-mode' : 'button-dark-mode';
  const appSectionClass = lightMode ? 'App light-mode' : 'App dark-mode';
  const themeIcon = lightMode ? '🌙' : '☀️';
  const themeLabel = lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  const backgroundImg = lightMode ? '/Shrooms_0.png' : '/Shrooms_3.png';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', lightMode ? 'light' : 'dark');
  }, [lightMode]);

  return (
    <>
      <Background backgroundImg={backgroundImg} />

      <button className={buttonClass} onClick={toggleLightMode} aria-label={themeLabel} title={themeLabel}>
        <span className="theme-icon" aria-hidden="true">
          {themeIcon}
        </span>
        <span className="sr-only">{themeLabel}</span>
      </button>
      <SideBar />
      <div className={appSectionClass}>
        <Routes>
          <Route path="/" element={<Home lightMode={lightMode} appSectionClass={appSectionClass} />} />
          <Route path="/shop" element={<Shop lightMode={lightMode} />} />
          <Route path="/mycology" element={<Mycology101 lightMode={lightMode} />} />
          <Route path="/about" element={<About lightMode={lightMode} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}
