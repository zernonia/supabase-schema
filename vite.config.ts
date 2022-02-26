import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          d3: ['d3'],
          chartjs: ['vue-chart-3', 'chart.js'],
        },
      },
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    WindiCSS(),
  ],
})
