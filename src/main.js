import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import axiosPlugin from './plugins/axiosPlugin'
import App from './App.vue'

import './style.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'

const pinia = createPinia()
const app = createApp(App)

app.use(axiosPlugin)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
