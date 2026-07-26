import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/' is correct for a custom domain (rimshaahmed.com).
// If you ever host at username.github.io/repo-name instead, change this to '/repo-name/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
