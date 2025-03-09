import { useState } from "react";

export const AwesomeRatioSlider = () => {
  const [ratio, setRatio] = useState(0.5);
  return (
    <div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={ratio}
        onChange={(e) => setRatio(parseFloat(e.target.value))}
      />
      <p>Current ratio: {ratio}</p>
    </div>
  );
};
