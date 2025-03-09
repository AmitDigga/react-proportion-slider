import React from "react";
import { ProportionSlider } from "../src/components/PropertionSlider";

function App() {
  return (
    <ProportionSlider
      value={[0, 100]}
      proportions={[{ name: "Left" }, { name: "Right" }]}
      onChange={(change) => console.log(change)}
    />
  );
}

export default App;
