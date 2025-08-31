import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      "/api/v1/onsko": {
        target: "http://43.204.114.117:3000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()]
})

