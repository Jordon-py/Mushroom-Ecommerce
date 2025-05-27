// ================================
// About.jsx - About Page with MorphingComponent Demo
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~45
//   • Complexity: Medium (multiple morphing views)
//   • Dependencies: react, MorphingComponent
//   • Features: Company story, process explanation, mission statement
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Showcase company information through animated transitions
//   • Demonstrate MorphingComponent functionality
//   • Provide engaging user experience
//   • Educational content about mushroom cultivation
//
// 🍄 CONTENT STRUCTURE:
//   • View 1: Company introduction and welcome
//   • View 2: Cultivation process and expertise
//   • View 3: Mission and values statement
//
// 💡 IMPLEMENTATION NOTES:
//   • Uses MorphingComponent for smooth transitions
//   • Each view focuses on different aspects of the business
//   • Engaging mushroom-themed content and emojis
// ================================

import React from "react";
import { MorphingComponent } from "../components/MorphingComp";
import "./About.css";
import SideBar from "../components/SideBar";

// Individual view components for the morphing demonstration
const WelcomeView = () => (
  <div className="about-view about-welcome">
    <h2>🍄 Welcome to Our Mushroom World</h2>
    <p>
      We're passionate cultivators dedicated to bringing you the finest
      mushroom spores and grow bags. Our journey started with curiosity
      and grew into expertise.
    </p>
  </div>
);

const ProcessView = () => (
  <div className="about-view about-process">
    <h2>🌱 Our Cultivation Process</h2>
    <p>
      From sterile laboratory conditions to carefully prepared grow bags,
      every step is designed to ensure the highest quality spores and
      optimal growing conditions for your mushroom journey.
    </p>
  </div>
);

const MissionView = () => (
  <div className="about-view about-mission">
    <h2>🎯 Our Mission</h2>
    <p>
      To make mushroom cultivation accessible to everyone, whether you're
      a curious beginner or an experienced mycologist. We believe in the
      power of fungi to connect us with nature.
    </p>
  </div>
);

export default function About() {
  const morphingViews = [WelcomeView, ProcessView, MissionView];

  return (
    <>
      <SideBar />
      <main className="main-content">
        <header className="about-header">
          <h1>About Our Store</h1>
          <p>Discover our story through the interactive timeline below</p>
        </header>

        <section className="about-morphing-section">
          <MorphingComponent
            states={morphingViews}
            transition="fade"
            timeline={true}
            className="about-morph-container"
          />
        </section>

        <footer className="about-footer">
          <p>Use the slider above to explore different aspects of our business</p>
        </footer>
      </main>
    </>
  );
}
