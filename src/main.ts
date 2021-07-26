import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import './assets/main.css'
import router from './router'
import ApexCharts from 'vue3-apexcharts'

createApp(App).use(router).use(ApexCharts).mount('#app')
