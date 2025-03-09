import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
      name: "react-proportion-slider",
      fileName: (format) => `my-react-library.${format}.js`,
    },
  },
  server: {
    open: "/dev/index.html", // Open the dev environment on `npm run dev`
  },
});
