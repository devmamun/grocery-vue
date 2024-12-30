<template>
  <!-- Sidebar Section -->
  <aside class="w-64 bg-gray-800 text-white h-screen p-4">
    <!-- Title -->
    <h2 class="text-lg font-bold mb-4">Grocery Store</h2>
    <hr />

    <!-- Navigation Menu -->
    <ul class="mt-4">
      <!-- Orders Link -->
      <li>
        <router-link
          to="/admin/orders"
          class="block py-2 hover:bg-gray-700 bg-gray-700 rounded-md pl-4"
        >
          Orders
        </router-link>
      </li>

      <!-- Home Link -->
      <li>
        <router-link
          to="/"
          class="block py-2 hover:bg-gray-700 pl-4 rounded-md"
        >
          Visit Home
        </router-link>
      </li>

      <!-- Logout Button -->
      <li>
        <a
          @click.prevent="handleLogout"
          class="block py-2 hover:bg-gray-700 pl-4 rounded-md text-red-600 hover:text-red-800 cursor-pointer"
        >
          Logout
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { handleApiError } from '@/utils/errorHandler';

export default {
  name: 'Sidebar',

  setup() {
    const router = useRouter();
    return { router };
  },

  methods: {
    // Logout Function
    async handleLogout() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL;

        // Logout API Request
        await axios.post(
          `${apiUrl}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Clear local storage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.push('/login');
      } catch (error) {
        console.error('Logout failed:', handleApiError(error));
      }
    },
  },
};
</script>
