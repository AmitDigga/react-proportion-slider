import React from "react";
import "./App.css";
import { ProportionSlider } from "../src/components/ProportionSlider";

function App() {
  const [proportions, setProportions] = React.useState<[number, number]>([
    50, 50,
  ]);
  return (
    <div
      style={{
        height: "100%",
        flex: 1,
        padding: "20px 200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ProportionSlider
        value={proportions}
        proportions={[
          {
            name: "Skill",
            backgroundColor: "#31332E",
          },
          {
            name: "3.7 Sonnet",
            backgroundColor: "#5f625C",
          },
        ]}
        onChange={(change) => {
          setProportions(change);
        }}
        sliderOptions={{
          width: 5,
          gap: 5,
          backgroundColor: "#EC1308",
        }}
        options={{
          height: 50,
          displayValueType: "percentage",
        }}
      />
    </div>
  );
}

export default App;
