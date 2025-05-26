import { FaHome, FaStore, FaLeaf, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./SideBar.css";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  
    return (
      <nav className={`sidebar ${isOpen ? "isOpen" : "closed"}`}>
        {/* Hamburger Toggle Button (visible on mobile) */}
        <button
          className="sidebar-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Open sidebar" : "Close sidebar"}
          aria-expanded={!isOpen}
        >
          {/* SVG Hamburger/X icon for accessibility */}
          {isOpen ? (
            // Hamburger icon
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <rect y="6" width="28" height="3" rx="1.5" fill="currentColor"/>
              <rect y="13" width="28" height="3" rx="1.5" fill="currentColor"/>
              <rect y="20" width="28" height="3" rx="1.5" fill="currentColor"/>
            </svg>
          ) : (
            // X icon
            <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
              <line x1="6" y1="6" x2="22" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <line x1="22" y1="6" x2="6" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          )}
        </button>
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
        </ul>
      </nav>
    );
 }