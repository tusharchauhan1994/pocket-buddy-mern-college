import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/user': 'http://localhost:3000',
//     },
//     historyApiFallback: {
//       rewrites: [
//         { from: /\/reset-password/, to: '/index.html' }
//       ]
//     }
//   }
// })



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    fs: {
      strict: false,
    },
  },
})
