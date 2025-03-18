// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: "./tsconfig.app.json" })],
  test: {
    globals: true,
    environment: "jsdom",
  },
  build: {
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "ReactJsxRuntime",
        },
      },
    },
    lib: {
      entry: "src/index.ts",
      name: "ReactProportionSlider",
      fileName: (format) => `react-proportion-slider.${format}.js`,
    },
    sourcemap: true,
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    open: "/dev/index.html", // Open the dev environment on `npm run dev`
  },
});
