import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
  ],
    esbuild: {
    logLevel: "silent",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@css": path.resolve(__dirname, "./src/css"),
      "@components": path.resolve(__dirname, "./src/components"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://the-dojo.pagoda.africa",
        changeOrigin: true,
        secure: true, 
      },
    },
  },
})
