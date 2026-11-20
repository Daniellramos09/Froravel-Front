import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(() => {
  // Na Vercel ou ambientes CI sem suporte a SW Rollup bundling, desabilita a geração pesada do PWA
  const disablePwa = process.env.VERCEL === '1' || process.env.DISABLE_PWA === 'true'

  return {
    plugins: [
      react(),
      tailwindcss(),
      !disablePwa && VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Florável — Espaço da Mãe',
          short_name: 'Florável',
          description: 'Seu espaço de acolhimento, diário emocional e rede de apoio na maternidade.',
          lang: 'pt-BR',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#FCF7F9',
          theme_color: '#294D33',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          globPatterns: ['**/*.{js,css,html}', 'icons/*.png', 'LogoFin.png', 'img/fotoheader/logo.png'],
          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/img/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'imagens-v3',
                networkTimeoutSeconds: 3,
                expiration: { maxEntries: 80, maxAgeSeconds: 7 * 24 * 60 * 60 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'fontes-css' },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
              handler: 'CacheFirst',
              options: {
                cacheName: 'fontes',
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
              },
            },
          ],
        },
      }),
    ].filter(Boolean),
    server: {
      port: 5174,
    },
  }
})
