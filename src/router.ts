import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Schema', component: () => import('./views/Schema.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
