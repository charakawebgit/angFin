import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { angular } from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: 'src/test-setup.ts'
  }
});
