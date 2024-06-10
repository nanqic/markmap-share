import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from 'path'
import process from "process"

export default ({ mode }) => {
  // 使用loadEnv获取环境变量
  const env = loadEnv(mode, process.cwd())
  const BASE_URL = env.VITE_BASE_URL
  const SERVER_URL = env.VITE_SERVER_URL

  return defineConfig({
    plugins: [
      react(),
      visualizer({
        open: true,
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
      open: false,
      https: false,
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
          drop_console: true,
          drop_debugger: true,
        },
      },
      reportCompressedSize: true,
      sourcemap: false,
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