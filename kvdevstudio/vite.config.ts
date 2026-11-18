import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // three.js + R3F live in lazy chunks fetched after first paint; that
    // shared chunk is expected to exceed the default 500 kB warning.
    chunkSizeWarningLimit: 1200,
  },
})
