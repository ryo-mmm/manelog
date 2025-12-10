import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Reactの開発サーバーの設定
    port: 5173,
    // ここから追記
    proxy: {
      // /api で始まるリクエストをバックエンド(Laravel)へ転送
      '/api': {
        target: 'http://localhost', // LaravelのURL
        changeOrigin: true,         // オリジンをターゲットに変更
        secure: false,              // HTTPSでない場合はfalse
      },
    },
  }
})

