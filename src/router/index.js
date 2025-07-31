import Layout from '@/components/PlanningTool/pages/Layout.vue'
import Project_chart from '@/components/Project_Chart.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Project',
      component: Project_chart,
    },
    {
      path: '/Planning',
      name: 'Planning',
      component: Layout,
    }
  ],
})

export default router
