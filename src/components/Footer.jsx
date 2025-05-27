// ================================
// Footer.jsx - Site Footer Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~29
//   • Complexity: Low (static content)
//   • Dependencies: None (pure React)
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
// 🚨 POTENTIAL IMPROVEMENTS:
//   • Replace href links with React Router Link components
//   • Add social media links
//   • Consider newsletter signup
//
// 💡 ACCESSIBILITY FEATURES:
//   • role="contentinfo" for screen readers
//   • aria-label for footer navigation
//   • Semantic nav and ul structure
// ================================

import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Ensure this file exists and uses LCH color space

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">        <nav className="footer-nav" aria-label="Footer navigation">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/mycology">Mycology 101</Link></li>
          </ul>
        </nav>
        <div className="footer-contact" id="contacts">
          <p>
            Contact: <a href="mailto:support@shroomstore.com">support@shroomstore.com</a>
          </p>
          <p>
            &copy; {new Date().getFullYear()} ShroomStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;