import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Polyfill global for Draft.js
const defineGlobal = () => {
  return {
    name: 'define-global',
    config() {
      return {
        define: {
          global: 'window',
        },
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), defineGlobal()],
})
