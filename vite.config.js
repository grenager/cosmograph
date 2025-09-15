import { defineConfig } from 'vite'

export default defineConfig({
  // Ensure assets are served correctly
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy index.html to dist root
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  
  // Preview server configuration for Railway
  preview: {
    port: process.env.PORT || 4173,
    host: '0.0.0.0'
  }
})
