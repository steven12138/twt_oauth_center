import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { useTokenManager } from '@/stores/token_manager.js'
import RegisterView from '@/views/RegisterView.vue'
import { useUserInfoStore } from '@/stores/userInfo.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue')
    }
  ]
})
const authenticate_required_pages = [
  '/'
]


router.beforeEach((to, from, next) => {
  if (authenticate_required_pages.indexOf(to.path) !== -1) {
    const token = useTokenManager().getToken()
    if (!token) {
      next('/login')
    } else {
      useUserInfoStore().fetchUserInfo()
      next()
    }
  }
  next()
})

export default router
