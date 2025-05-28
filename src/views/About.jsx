// ================================
// About.jsx - About Page
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~35
//   • Complexity: Low (static content)
//   • Dependencies: react
//   • Features: Company story, process explanation, mission statement
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Showcase company information 
//   • Provide engaging user experience
//   • Educational content about mushroom cultivation
//
// 🍄 CONTENT STRUCTURE:
//   • Company introduction and welcome
//   • Cultivation process and expertise
//   • Mission and values statement
//
// 🚨 RECENT FIXES APPLIED:
//   • ✅ Removed MorphingComponent dependency
//   • ✅ Converted to standard content layout
//   • ✅ Improved semantic structure
//
// 💡 IMPLEMENTATION NOTES:
//   • Clean, accessible content structure
//   • Engaging mushroom-themed content and emojis
//   • Semantic HTML for better SEO
// ================================

import React from "react";
import "./About.css";

export default function About() {
  return (
    <>
      <main className="main-content">
        <header className="about-header">
          <h1>About Our Store</h1>
          <p>Discover our story and commitment to quality</p>
        </header>

        <section className="about-content">
          <article className="about-section">
            <h2>🍄 Welcome to Our Mushroom World</h2>
            <p>
              We're passionate cultivators dedicated to bringing you the finest
              mushroom spores and grow bags. Our journey started with curiosity
              and grew into expertise.
            </p>
          </article>

          <article className="about-section">
            <h2>🌱 Our Cultivation Process</h2>
            <p>
              From sterile laboratory conditions to carefully prepared grow bags,
              every step is designed to ensure the highest quality spores and
              optimal growing conditions for your mushroom journey.
            </p>
          </article>

          <article className="about-section">
            <h2>🎯 Our Mission</h2>
            <p>
              To make mushroom cultivation accessible to everyone, whether you're
              a curious beginner or an experienced mycologist. We believe in the
              power of fungi to connect us with nature.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
