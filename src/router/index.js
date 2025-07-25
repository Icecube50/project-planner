import Project_chart from '@/components/project_chart.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Project',
      component: Project_chart,
    },
  ],
})

export default router
