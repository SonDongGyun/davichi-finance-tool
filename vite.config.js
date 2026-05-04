import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendors out of the main entry chunk so initial paint
        // ships less JS and downloads can parallelize.
        manualChunks: {
          motion: ['framer-motion'],
          charts: ['recharts'],
          icons: ['lucide-react'],
          xlsx: ['xlsx'],
        },
      },
    },
  },
})
