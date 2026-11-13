import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { site, derived } from './src/config/site';

/** Fills <title>, description and Open Graph tags from the single config file. */
function metaFromConfig(): Plugin {
  return {
    name: 'meta-from-config',
    transformIndexHtml(html) {
      const host = process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.siteUrl);
      const base = host.replace(/\/$/, '');
      return html
        .replaceAll('%TITLE%', derived.title)
        .replaceAll('%DESCRIPTION%', derived.description)
        .replaceAll('%SITE_URL%', base);
    },
  };
}

export default defineConfig({
  plugins: [react(), metaFromConfig()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
  },
});
