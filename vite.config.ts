import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    host: 'localhost',
    port: 5174, // 👈 여기가 핵심
    hmr: {
      host: 'localhost',
      port: 5174, // 👈 HMR도 동일 포트로 맞추기
      protocol: 'ws',
    },
  },
})
