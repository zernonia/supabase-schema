import { createRouter, createWebHistory } from 'vue-router'
import Schema from './views/Schema.vue'
import Dashboard from './views/Dashboard.vue'

const routes = [
  { path: '/', name: 'Schema', component: Schema },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
