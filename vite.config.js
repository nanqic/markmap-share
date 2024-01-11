import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from 'path'
import process from "process"
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'

export default ({ mode }) => {
  // 使用loadEnv获取环境变量
  const env = loadEnv(mode, process.cwd())
  const BASE_URL = env.VITE_BASE_URL
  const SERVER_URL = env.VITE_SERVER_URL

  return defineConfig({
    plugins: [
      react(),
      importToCDN({
        modules: [
          {
            name: "react",
            var: 'React',
            path: 'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/react/18.2.0/umd/react.production.min.js',
            version: "18.2.0"
          },
          {
            name: "react-dom",
            var: 'ReactDOM',
            path: 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react-dom/18.2.0/umd/react-dom.production.min.js',
            version: "18.2.0"
          },
        ],
      }),
      visualizer({
        // 打包完成后自动打开浏览器，显示产物体积报告
        open: false,
      }),],
    base: BASE_URL || '/',
    resolve: {
      alias: {
        '@': resolve('./src'),
        'assets': resolve('./src/assets'),
      }
    },
    server: {
      host: "0.0.0.0",
      // 是否自动在浏览器打开
      open: false,
      // 是否开启 https
      https: false,
      // 服务端渲染
      ssr: false,
      proxy: {
        '/api': {
          target: SERVER_URL,
          changeOrigin: true,
          secure: true,
          // rewrite: path => path.replace(/^\/api/, '')
        },
        '/p': {
          target: SERVER_URL,
          changeOrigin: true,
          secure: true,
        }
      }
    },
    build: {
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 关闭文件计算
      reportCompressedSize: false,
      // 关闭生成map文件 可以达到缩小打包体积
      sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大

      // rollup 配置
      rollupOptions: {
        output: {
          manualChunks: {
            markmap: [
              'markmap-view',
              'markmap-common',
              'markmap-toolbar',
              'markmap-lib',
            ],
            mdEditor: ['@uiw/react-md-editor/nohighlight']
          }
        }
      }
    }
  });
}