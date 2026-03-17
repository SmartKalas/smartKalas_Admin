import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (development/production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.js',
    },
    define: {
      // Ensure VITE_API_URL is properly available during build
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3000/api'),
    },
  }
})
