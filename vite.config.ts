import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'vite-plugin-components'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          d3: ['d3'],
          apexchart: ['apexcharts'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  plugins: [
    vue(),
    Components({
      directoryAsNamespace: true,
      customComponentResolvers: ViteIconsResolver(),
    }),
    ViteIcons(),
    WindiCSS(),
  ],
})
