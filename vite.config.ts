import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: "./tsconfig.app.json" })],
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
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
