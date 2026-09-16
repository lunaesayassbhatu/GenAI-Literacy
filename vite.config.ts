import { defineConfig, loadEnv, type Plugin } from 'vite'
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

// Serves POST /api/chat during `npm run dev`, mirroring the real api/chat.ts
// Vercel function — plain `vite` doesn't run serverless functions on its own,
// so without this the Ask Wave chat widget 404s locally even with a valid key.
function devChatApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'dev-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        let raw = ''
        req.on('data', (chunk) => { raw += chunk })
        req.on('end', async () => {
          try {
            const { runChat } = await import('./api/chatHandler.ts')
            const parsed = raw ? JSON.parse(raw) : {}
            const result = await runChat(parsed?.messages, apiKey)
            res.statusCode = result.status
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify(result.body))
          } catch (err) {
            console.error('dev chat middleware error:', err)
            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ error: 'Something went wrong. Please try again.' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
      devChatApiPlugin(env.ANTHROPIC_API_KEY),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
