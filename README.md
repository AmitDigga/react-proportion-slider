# React Proportion Slider

> **Note:** This package is currently in beta.

A React component that allows users to adjust the proportion of two elements using a slider.

https://github.com/user-attachments/assets/edd1b8fa-b9d7-401c-9815-69713758e454



## Installation

```bash
npm install react-proportion-slider
```

```bash
yarn add react-proportion-slider
```

## Usage

```tsx
function App() {
  const [proportions, setProportions] = React.useState<[number, number]>([
    50, 50,
  ]);
  return (
    <div>
      <ProportionSlider
        value={proportions}
        width={500}
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
```

## Props

| Prop Name   | Type                                 | Required | Description                                         |
| ----------- | ------------------------------------ | -------- | --------------------------------------------------- |
| value       | [number, number]                     | Yes      | Current values of the two proportions [left, right] |
| proportions | [ProportionDetail, ProportionDetail] | Yes      | Details for the two proportions [left, right]       |
| onChange    | (values: [number, number]) => void   | No       | Callback when values change                         |
| knobOptions | SliderKnobOptions                    | No       | Appearance of the slider knob                       |
| height      | number                               | No       | Height of the slider in pixels                      |
| width       | number                               | No       | Width of the slider in pixels                       |
| disabled    | boolean                              | No       | Whether the slider is disabled                      |
| className   | string                               | No       | Custom class name for the slider container          |
| style       | React.CSSProperties                  | No       | Custom styles for the slider container              |
| ariaLabel   | string                               | No       | Accessibility label for the slider                  |

### ProportionDetail

| Property        | Type   | Required | Description                                     |
| --------------- | ------ | -------- | ----------------------------------------------- |
| label           | string | Yes      | Custom label to display                         |
| backgroundColor | string | No       | Color of the proportion segment                 |
| data            | any    | No       | Optional data to associate with this proportion |
| ariaLabel       | string | No       | Accessibility label for this proportion         |

### SliderKnobOptions

| Property        | Type                | Required | Description                          |
| --------------- | ------------------- | -------- | ------------------------------------ |
| width           | number              | No       | Width of the slider knob in pixels   |
| gap             | number              | No       | Gap around the slider knob in pixels |
| backgroundColor | string              | No       | Color of the slider knob             |
| className       | string              | No       | Custom class name for the knob       |
| style           | React.CSSProperties | No       | Custom styles for the knob           |

## Future Features

1. Make it possible to adjust the proportion of more than two elements
2. Add more customization options

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
