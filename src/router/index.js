import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import AdminLayout from '../views/AdminLayout.vue';

const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/AdminOrders.vue'),
      },
      {
        path: 'orders/add',
        name: 'AddOrder',
        component: () => import('../views/AddOrder.vue'),
        meta: { requiresManagerCheck: true },
      },
      {
        path: 'orders/edit/:id',
        name: 'EditOrder',
        component: () => import('../views/EditOrder.vue'),
        meta: { requiresManagerCheck: true },
      },
    ],
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard to check authentication and role
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.role : '';

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to login if not authenticated
    next({ path: '/login' });
  } else if (to.matched.some(record => record.meta.requiresManagerCheck) && userRole === 'manager') {
    // Redirect manager to orders page if trying to access add/edit routes
    next({ path: '/admin/orders' });
  } else {
    next(); // Proceed to the route
  }
});

export default router
