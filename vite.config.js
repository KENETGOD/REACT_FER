import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          if (
            id.includes('/node_modules/antd') ||
            id.includes('/node_modules/@ant-design/') ||
            id.includes('/node_modules/rc-') ||
            id.includes('/node_modules/@rc-component/')
          ) {
            return 'antd-vendor'
          }

          if (id.includes('@tanstack')) {
            return 'query-vendor'
          }

          if (id.includes('react-router')) {
            return 'router-vendor'
          }

          if (id.includes('react')) {
            return 'react-vendor'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
