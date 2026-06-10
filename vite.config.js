//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//export default defineConfig({
  //plugins: [react()],
//})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      manifest: {
		name: 'SmartDesk',
		short_name: 'SmartDesk',
		description: 'SmartDesk Transport Management System',
		start_url: '/',
		scope: '/',
		display: 'standalone',
		theme_color: '#0f172a',
		background_color: '#0f172a',

        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      workbox: {
		clientsClaim: true,
		skipWaiting: true,
		cleanupOutdatedCaches: true,
		navigateFallback: '/',
	}
    })
  ]
})
