import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


import Components from 'unplugin-vue-components/vite' // 自动导入插件
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      // 组件解析
      resolvers:[ElementPlusResolver()],
    }),
  ],
})

