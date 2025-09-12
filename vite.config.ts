import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { tanstackRouter  } from "@tanstack/router-vite-plugin"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tanstackRouter ({ routesDirectory: './src/routes',}),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@css": path.resolve(__dirname, "./src/css"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
      extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".css"], 
  },
})
