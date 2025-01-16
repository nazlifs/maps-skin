import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target:
          " https://mapping-staging-11d8643b0e13.herokuapp.com/accommodations.json?km_radius=5&latitude=-37.855641&longitude=144.667088",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/maps-api": {
        target: "https://maps.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/maps-api/, ""),
      },
    },
  },
});
