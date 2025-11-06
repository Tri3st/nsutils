import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  build:  {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: any) {
          if(id.includes('node_modules')) {
            if (id.includes('ant-design-vue')) {
              return 'vendor_antdesign';
            }
            if (id.includes('pinia')) {
              return 'vendor_pinia';
            }
          }
          return 'vendor';
        }
      }
    },
    chunkSizeWarningLimit: 1600
  },
  plugins: [
    vue(),
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
