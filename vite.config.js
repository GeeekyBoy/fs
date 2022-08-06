import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../build",
  },
  plugins: [svgr({ svgrOptions: { ref: true } }), react()],
  define: {
    global: {},
  },
});
