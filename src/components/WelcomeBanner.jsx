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
import PropTypes from 'prop-types';

function WelcomeBanner({ appSectionClass = '', welcome = "Trippy.Shroom Store" }) {
  return (
    <header className={`welcome-banner ${appSectionClass}`} aria-labelledby="welcome-title">
      <h1 id="welcome-title">{welcome}</h1>
      <p>Your source for premium spores and grow bags.</p>
    </header>
  );
}

WelcomeBanner.propTypes = {
  appSectionClass: PropTypes.string,
  welcome: PropTypes.string,
};

export default WelcomeBanner;
