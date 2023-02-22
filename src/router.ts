import { createRouter, createWebHistory, RouteLocation } from 'vue-router'

const routes = [
  { path: '/', name: 'Schema', component: () => import('./views/Schema.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to: RouteLocation, from: RouteLocation) => {
  // Redirect to the root path if the route is not the root path
  if (to.path !== '/') {
    router.push('/')
  }
})

export default router
