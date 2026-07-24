import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'images/*.webp', 'images/*.gif'],
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,webp,gif,woff2}'],
			},
			manifest: {
				name: '금요일 퇴근시간 계산기',
				short_name: '퇴근계산기',
				description: '아이스크림에듀 금요일 퇴근시간 계산기',
				lang: 'ko',
				display: 'standalone',
				theme_color: '#fffaf3',
				background_color: '#fffaf3',
				icons: [
					{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
				],
			},
		}),
	],
	test: {
		include: ['src/**/*.test.ts'],
	},
});
