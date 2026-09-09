import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'

// Work around a Node 22 + @tailwindcss/vite loader hang.
// This keeps Vite startup from freezing at "vite" with no URL output.
const require = createRequire(import.meta.url)
const moduleBuiltin = require('module') as { register?: unknown }
if (typeof moduleBuiltin.register === 'function') {
  moduleBuiltin.register = undefined
}

const tailwindcss = (await import('@tailwindcss/vite')).default

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
