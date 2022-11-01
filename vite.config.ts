import { defineConfig } from 'vite'
import fs from "fs"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    https:{
      key: fs.readFileSync('./localhost+1-key.pem'),
      cert:fs.readFileSync('./localhost+1.pem'),
    },
  }
})
