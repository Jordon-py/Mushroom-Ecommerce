// ================================
// Footer.jsx - Site Footer Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~35
//   • Complexity: Low (static content)
//   • Dependencies: react, react-router-dom
//   • Accessibility: High (proper ARIA labels, semantic HTML)
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Site-wide footer with navigation and contact info
//   • Consistent branding and legal information
//   • Secondary navigation for all pages
//   • Contact information accessibility
//
// 🔄 COMPONENT STRUCTURE:
//   • Semantic footer element with proper ARIA role
//   • Navigation list with proper structure
//   • Dynamic copyright year calculation
//
// 🚨 RECENT FIXES APPLIED:
//   • ✅ Improved mobile responsiveness
//   • ✅ Better flexbox layout for small screens
//   • ✅ Enhanced touch targets for mobile
//   • ✅ Fixed content overflow issues
//
// 💡 ACCESSIBILITY FEATURES:
//   • role="contentinfo" for screen readers
//   • aria-label for footer navigation
//   • Semantic nav and ul structure
//   • Improved focus indicators
// ================================
// ================================
// Futuristic Footer Component (v2)
// ================================
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaStore, FaInfoCircle, FaLeaf } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {

  return (
    <footer className="footer-glass" id="footer" role="contentinfo">
      <nav className="footer-nav-glass" id="footer-nav" aria-label="Footer navigation">
        <ul>
          <li><Link to="/" aria-label="Home"><FaHome /> <span>Home</span></Link></li>
          <li><Link to="/shop" aria-label="Shop"><FaStore /> <span>Shop</span></Link></li>
          <li><Link to="/about" aria-label="About"><FaInfoCircle /> <span>About</span></Link></li>
          <li><Link to="/mycology" aria-label="Mycology 101"><FaLeaf /> <span>Mycology</span></Link></li>
        </ul>
      </nav>
      <div className="footer-contact-glass" id="footer-contact">
        <p>
          Contact: <a href="mailto:support@shroomstore.com">support@shroomstore.com</a>
        </p>
        <p>
          &copy; {new Date().getFullYear()} ShroomStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
