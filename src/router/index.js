import Layout from '@/components/PlanningTool/pages/Layout.vue'
import Login from '@/components/PlanningTool/pages/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Planning',
      name: 'Planning',
      component: Layout,
    },
  ],
})

export default router
