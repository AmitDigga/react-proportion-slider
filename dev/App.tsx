import React from "react";
import "./App.css";
import { ProportionSlider } from "../src";

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
            label: "Skill",
            backgroundColor: "#31332E",
          },
          {
            label: "3.7 Sonnet",
            backgroundColor: "#5f625C",
          },
        ]}
        onChange={(change) => {
          setProportions(change);
        }}
        knobOptions={{
          width: 5,
          gap: 5,
          backgroundColor: "#EC1308",
        }}
        height={50}
      />
    </div>
  );
}

export default App;
