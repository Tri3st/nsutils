import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  build:  {
    sourcemap: true,
    rollupOptions: {
      output: {
        // manualChunks(id: string) {
        //   if(id.includes('node_modules')) {
        //     if (id.includes('ant-design-vue')) {
        //       return 'vendor_antdesign';
        //     }
        //     if (id.includes('pinia')) {
        //       return 'vendor_pinia';
        //     }
        //     if (id.includes('vue-router')) {
        //       return 'vendor_router';
        //     }
        //   }
        //   return 'vendor_others';
        // }
      }
    },
    chunkSizeWarningLimit: 1600
  },
  plugins: [
    vue(),
    visualizer({ open: true, filename: 'dist/stats.html' }),
    Components({
      resolvers:[
        AntDesignVueResolver({
          importStyle: false  // css in js
        }),
      ],
      dts: true,  // generates a `components.d.ts` file for Typescript support
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
