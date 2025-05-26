import React from "react";
import "./Footer.css"; // Ensure this file exists and uses LCH color space

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <nav className="footer-nav" aria-label="Footer navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
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