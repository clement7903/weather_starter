import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  server: {
    host: '127.0.0.1',
  },
  integrations: [
    starlight({
      title: 'Weather Starter Docs',
    }),
  ],
});