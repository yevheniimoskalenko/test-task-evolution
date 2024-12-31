import axios from 'axios'
export default {
	install(app, options) {
		const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 5000
		const instance = axios.create({
			baseURL: import.meta.env.VITE_API_BASE_URL,
			timeout: timeout,
			headers: {
				Authorization: `d737d43c-7291-4f09-b2d3-f6799eee91af`,
				'Content-Type': 'application/json',
			},
		})

		// Додаємо Axios як глобальний об'єкт
		app.config.globalProperties.$axios = instance

		// Можна також зробити його доступним через provide/inject
		app.provide('axios', instance)
	},
}
