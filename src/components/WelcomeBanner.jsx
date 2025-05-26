// ================================
// WelcomeBanner.jsx
// ================================
// This component displays a prominent banner/header on every page.
// It receives theme state and background image as props from App,
// so it stays in sync with the current light/dark mode.
// No state or effects needed here—just props and presentational logic.
//
// Key Concepts Covered:
//   • Using props for styling and consistency
//   • Semantic HTML for accessibility
//   • Simple, clean component structure
// ================================

import "./WelcomeBanner.css";

function WelcomeBanner({ appSectionClass }) {
  return (
    <header className={ appSectionClass } aria-labelledby="welcome-title">
      <h1 id="welcome-title">Trippy.Shroom Store</h1>
      <p id="p">Your source for premium spores and grow bags.</p>
    </header>
  );
}

export default WelcomeBanner;
