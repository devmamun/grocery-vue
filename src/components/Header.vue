<template>
  <!-- Header Section -->
  <header class="flex justify-between items-center p-4 bg-gray-200 text-gray-600 shadow-md border-b border-gray-400">
    <!-- Logo -->
    <div class="text-2xl font-bold">
      <router-link to="/" class="text-gray-700">Grocery Store</router-link>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex space-x-4">
      <ul class="flex space-x-4">
        <!-- Authenticated Links -->
        <li v-if="isAuthenticated">
          <router-link
            to="/admin/orders"
            class="text-lg hover:text-gray-800 hover:underline"
          >
            Orders
          </router-link>
        </li>
        <li v-if="isAuthenticated">
          <a
            @click.prevent="handleLogout"
            class="text-lg hover:text-gray-800 hover:underline cursor-pointer"
          >
            Logout
          </a>
        </li>

        <!-- Guest Link -->
        <li v-else>
          <router-link
            to="/login"
            class="text-lg hover:text-gray-800 hover:underline"
          >
            Login
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { handleApiError } from '@/utils/errorHandler';

export default {
  name: 'Header',

  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
    };
  },

  setup() {
    const router = useRouter();
    return { router };
  },

  methods: {
    async handleLogout() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;

        // Logout API request
        await axios.post(
          `${apiUrl}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Clear local storage and update authentication state
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthenticated = false;

        // Redirect to login page
        this.router.push('/login');
      } catch (error) {
        console.error('Logout failed:', handleApiError(error));
      }
    },
  },
};
</script>
