import React from "react";
import { ProportionSlider } from "../src/components/PropertionSlider";

function App() {
  const [proportions, setProportions] = React.useState<[number, number]>([
    50, 50,
  ]);
  return (
    <ProportionSlider
      value={proportions}
      proportions={[{ name: "Left" }, { name: "Right" }]}
      onChange={(change) => {
        setProportions(change);
      }}
      sliderOptions={{
        width: 5,
        gap: 3,
      }}
      options={{
        height: 40,
        displayValueType: "percentage",
      }}
    />
  );
}

export default App;
