import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	base: '/regex/',
	plugins: [react(),tailwindcss()],
	  server:{
	    host:'0.0.0.0',
	    allowedHosts:['jackeywiki.cn','www.jackeywiki.cn'],
 	   port: 5001,
  	}
})