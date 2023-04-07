import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import WindiCSS from 'vite-plugin-windicss';
import Vercel from 'vite-plugin-vercel';
import VueRouter from 'unplugin-vue-router/vite';
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    vue(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    WindiCSS(),
    Vercel(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
