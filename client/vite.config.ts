import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sass from 'sass';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-transform-class-properties', { loose: true }],
        ],
      },
    }),
    tsconfigPaths(),
    svgr({ include: '**/*.svgr.svg' }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
  build: {
    target: 'esnext',
  },
  define: {
    'process.env': process.env,
  },
});
