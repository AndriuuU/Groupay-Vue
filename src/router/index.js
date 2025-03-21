import { createRouter, createWebHistory } from 'vue-router';

// Importar vistas
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import GroupDetail from '@/views/GroupDetail.vue';
import NotFound from '@/views/NotFound.vue';
import Profile from '../views/Profile.vue';
import GroupList from '../components/groups/GroupList.vue';
import ExpensesList from '../views/ExpensesList.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:id',
    name: 'group-detail',
    component: GroupDetail,
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/groups',
    name: 'group-list',
    component: GroupList,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: ExpensesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Guardia de navegación para autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
