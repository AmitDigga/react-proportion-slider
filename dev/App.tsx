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
    />
  );
}

export default App;
