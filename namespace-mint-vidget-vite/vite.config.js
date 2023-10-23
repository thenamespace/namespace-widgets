import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:3000
  },
  plugins: [react()],
  base: "https://namespace-widgets.fra1.cdn.digitaloceanspaces.com/namespace-vite-widget/",
  build: {
    rollupOptions: {
      output: {
        // Customize the output format
        entryFileNames: 'bundle.js',
      },
    },
  },
})
