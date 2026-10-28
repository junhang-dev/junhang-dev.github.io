import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://junhang-dev.github.io',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
