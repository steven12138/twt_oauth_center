import 'tdesign-vue-next/es/style/index.css';
import './assets/body.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-vue-next'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesign)

app.mount('#app')
