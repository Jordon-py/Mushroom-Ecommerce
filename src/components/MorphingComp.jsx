// ================================
// MorphingComponent.jsx - Advanced Animation Component
// ================================
// 📊 COMPONENT METRICS:
//   • Lines of Code: ~65
//   • Complexity: High (controlled/uncontrolled state, transitions)
//   • Dependencies: react, prop-types, react-transition-group
//   • Props: 5 (states, transition, timeline, index, onIndexChange)
//
// 🎯 PURPOSE & RESPONSIBILITIES:
//   • Smooth transitions between different view components
//   • Support for controlled and uncontrolled modes
//   • Timeline slider for manual navigation
//   • CSSTransition integration for smooth animations
//
// 🔄 STATE MANAGEMENT:
//   • Dual mode: controlled (external index) vs uncontrolled (internal state)
//   • safeStates: Array validation with fallback
//   • CurrentView: Memoized component selection
//
// 🚨 USAGE EXAMPLE:
//   const views = [
//     () => <div>View 1</div>,
//     () => <div>View 2</div>,
//     () => <div>View 3</div>
//   ];
//   <MorphingComponent states={views} transition="fade" timeline={true} />
//
// 💡 ACCESSIBILITY FEATURES:
//   • ARIA labels on timeline slider
//   • Proper value/min/max attributes
//   • Keyboard-accessible controls
// ================================

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./MorphingComp.css";

export function MorphingComponent({
  states = [],
  transition = "fade",
  timeline = true,
  index: controlledIndex,
  onIndexChange,
  className = "",
}) {
  const isControlled = controlledIndex !== undefined && onIndexChange;
  const [uncontrolledIndex, setUncontrolledIndex] = useState(0);
  const index = isControlled ? controlledIndex : uncontrolledIndex;

  const safeStates = Array.isArray(states) && states.length > 0 ? states : [() => <div>No views provided</div>];
  const CurrentView = useMemo(() => safeStates[index] || safeStates[0], [safeStates, index]);

  const handleChange = (e) => {
    const newIndex = Number(e.target.value);
    if (isControlled) {
      onIndexChange(newIndex);
    } else {
      setUncontrolledIndex(newIndex);
    }
  };

  return (
    <div className={`morph-wrap ${transition} ${className}`}>
      <SwitchTransition>
        <CSSTransition key={index} timeout={400} classNames="morph-content">
          <div className="morph-content">
            <CurrentView />
          </div>
        </CSSTransition>
      </SwitchTransition>
      {timeline && (
        <div className="morph-timeline">
          <input
            type="range"
            min="0"
            max={safeStates.length - 1}
            value={index}
            onChange={handleChange}
            aria-label={`Morphing timeline - ${index + 1} of ${safeStates.length}`}
            aria-valuenow={index}
            aria-valuemin={0}
            aria-valuemax={safeStates.length - 1}
            className="morph-slider"
          />
          <span className="morph-counter">{index + 1} / {safeStates.length}</span>
        </div>
      )}
    </div>
  );
}

MorphingComponent.propTypes = {
  states: PropTypes.arrayOf(PropTypes.elementType).isRequired,
  transition: PropTypes.string,
  timeline: PropTypes.bool,
  index: PropTypes.number,
  onIndexChange: PropTypes.func,
  className: PropTypes.string,
};
