import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  // Em produção (GitHub Pages) o site é servido em https://<user>.github.io/brandRiot/.
  // Em dev (`npm run dev`) servimos na raiz, então `base` continua "/".
  base: mode === "production" ? "/brandRiot/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5260",
        changeOrigin: true
      },
      "/health": {
        target: "http://localhost:5260",
        changeOrigin: true
      }
    }
  }
}));
