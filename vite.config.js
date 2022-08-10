import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../build",
  },
  plugins: [svgr({ svgrOptions: { ref: true } }), react(), VitePWA()],
  define: {
    global: {},
  },
});
