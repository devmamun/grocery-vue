import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';
import AdminLayout from '../views/AdminLayout.vue';

const routes = [
  {
    path: '/admin',
    component: AdminLayout,
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
      },
      {
        path: 'orders/edit/:id',
        name: 'EditOrder',
        component: () => import('../views/EditOrder.vue'),
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

export default router
