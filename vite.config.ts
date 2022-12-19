import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from "vite-plugin-pwa"
//import viteComponents from 'vite-plugin-components';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'masonry-layout'
        }
      }
    }),
    VueI18nPlugin({
      include: path.resolve(__dirname, './src/locales/**')
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Requirements Bazaar',
        short_name: 'Requirements Bazaar',
        description: 'Requirements Bazaar allows users to discuss innovative ideas so that developers can focus on features that really matter.',
        theme_color: '#447500',
        background_color: '#447500',
        display: 'standalone',
        icons: [
          {
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // enables us to use import @/components etc. instead of using relative paths like ./../components
    }
  }
})
