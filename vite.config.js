import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:5000'

  return {
    plugins: [react()],
    // Tell Vite where the client source root is
    root: './',
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Only proxied in local dev; Vercel calls the Render URL directly
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        }
      }
    }
  }
})
