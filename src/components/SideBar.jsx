// ================================
// SideBar.jsx - Main Navigation Component  
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~42
//   • Complexity: Low-Medium (toggle state)
//   • Dependencies: react, react-router-dom, react-icons
//   • State Variables: 1 (open/closed)
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Primary site navigation
//   • Collapsible hamburger menu
//   • Route management with React Router
//   • Icon-based visual navigation cues
//
// 🔄 STATE MANAGEMENT:
//   • open: boolean - Controls sidebar visibility
//   • CSS classes dynamically applied based on state
//
// 🚨 RECENT FIXES APPLIED:
//   • ✅ Removed Morph Demo navigation link
//   • ✅ Cleaned up icon imports
//   • ✅ Simplified navigation structure
//
// 💡 ACCESSIBILITY FEATURES:
//   • Semantic nav element
//   • Link elements with proper structure
//   • Visual icons enhance usability
// ================================

// SideBar.jsx
import { FaHome, FaInfoCircle, FaStore, FaLeaf, FaChartBar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./SideBar.css";

/**
 * Sidebar navigation component.
 * Handles open/close state with a hamburger menu.
 */
export default function SideBar() {
  const [open, setOpen] = useState(false); // sidebar open/close state

  return (
    <>
      {/* Hamburger button toggles sidebar open/close */}
      <button onClick={() => setOpen(!open)} className="hamburger-btn">
        ☰
      </button>
      {/* Sidebar nav - class changes based on open state */}
      <nav className={`sidebar ${open ? "open" : "closed"}`}>
        <ul className="sidebar-links">
          <li>
            <Link className="trippy-link" to="/">
              <FaHome className="sidebar-icon" /> Home
            </Link>
          </li>
          <li>
            <Link className="trippy-link" to="/shop">
              <FaStore className="sidebar-icon" /> Shop
            </Link>
          </li>
          <li>
            <Link className="trippy-link" to="/mycology">
              <FaLeaf className="sidebar-icon" /> Mycology 101
            </Link>
          </li>
          <li>
            <Link className="trippy-link" to="/about">
              <FaInfoCircle className="sidebar-icon" /> About
            </Link>
          </li>
          <li>
            <Link className="trippy-link" to="/admin">
              <FaChartBar className="sidebar-icon" /> Admin
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
