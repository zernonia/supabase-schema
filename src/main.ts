import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import './assets/main.css'
import router from './router'

createApp(App).use(router).mount('#app')
