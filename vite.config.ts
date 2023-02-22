import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import ImportMetaEnvPlugin from '@import-meta-env/unplugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    WindiCSS(),
    ImportMetaEnvPlugin.vite({
      example: '.env.example',
      // "env": "...",
      // "transformMode": "..."
    }),
  ],
})
