import Layout from '@/components/PlanningTool/pages/Layout.vue'
import Login from '@/components/PlanningTool/pages/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { AuthStore } from '@/store/auth_store'
import Developer from '@/components/PlanningTool/pages/Developer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Layout,
      meta: { protected: true}
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/Dev',
      name: 'Developer',
      component: Developer,
    },
  ],
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = AuthStore();

  if (to.meta.protected && !authStore.isLoggedIn()) {
    // not logged in → redirect to login
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router
