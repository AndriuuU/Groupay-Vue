import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
// Importar vistas
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import GroupDetail from '@/views/GroupDetail.vue';
import NotFound from '../views/NotFound.vue';
import Profile from '../views/Profile.vue';
import GroupList from '../components/groups/GroupList.vue';
import ExpensesList from '../views/ExpensesList.vue';
import Statistics from '../views/Statistics.vue';

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
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: Statistics,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Función auxiliar para esperar el usuario de Firebase
function getCurrentUser() {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(auth, user => {
      removeListener();
      resolve(user);
    }, reject);
  });
}

// Guardia de navegación para autenticación con Firebase
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = await getCurrentUser();

  if (requiresAuth && !user) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'register') && user) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;