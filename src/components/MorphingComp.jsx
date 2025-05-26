import React, { useState } from "react";

// Main component
export function MorphingComponent({ states, transition = "fade", timeline = true }) {
  const [index, setIndex] = useState(0);
  const CurrentView = states[index];

  return (
    <div className={`morph-wrap ${transition}`}>
      {/* Render the current UI state */}
      <div className="morph-content">
        <CurrentView />
      </div>

      {/* Optional timeline slider */}
      {timeline && (
        <input
          type="range"
          min="0"
          max={states.length - 1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
        />
      )}
    </div>
  );
}
