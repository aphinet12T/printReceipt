import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('/src/views/Order.vue'),
  },
  {
    path: '/detail',
    component: () => import('/src/views/OrderDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
