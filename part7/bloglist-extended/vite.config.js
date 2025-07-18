import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/blogs': {
        target: 'http://localhost:3003/blogs',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/blogs/, ''),
      },
      '/api/login': {
        target: 'http://localhost:3003/login',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/login/, ''),
      },
      '/api/users': {
        target: 'http://localhost:3003/users',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/users/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testSetup.js',
  },
})
