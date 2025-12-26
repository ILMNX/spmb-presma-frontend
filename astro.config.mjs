// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'server',
  adapter : vercel({}),
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('[PROXY] Request:', req.method, req.url, '→', options.target + (req.url || ''));
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('[PROXY] Response:', proxyRes.statusCode, req.url || '');
            });
            proxy.on('error', (err, req, res) => {
              console.error('[PROXY] Error:', err.message, req.url || '');
            });
          }
        }
      }
    }
  }
});