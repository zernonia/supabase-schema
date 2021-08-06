import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Schema', component: () => import('./views/Schema.vue') },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
