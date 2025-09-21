import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // input https://www.npmjs.com/package/html-minifier-terser options
    ViteMinifyPlugin({}),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        // drop_console: true,
        arrows: true,       // Converts functions to arrow functions
        comparisons: true,  // Optimizes `typeof` checks, if false will Disables '==' optimization
        conditionals: true, // Flattens nested ternaries
        toplevel: true,     // Minifies top-level functions
      },
      format: {
        comments: false, // Removes comments
      },
    },
    // reportCompressedSize: false, // For fast build
  },
})
