<template>
  <header class="flex justify-between items-center p-4 bg-gray-200 text-gray-600 shadow-md border-b border-gray-400">
    <div class="text-2xl font-bold">
      <router-link to="/" class="text-gray-700">Grocery Store</router-link>
    </div>
    <nav class="flex space-x-4">
      <ul class="flex space-x-4">
        <li v-if="isAuthenticated"><router-link to="/admin/orders" class="text-lg hover:text-gray-800 hover:underline">Orders</router-link></li>
        <li v-if="isAuthenticated"><a @click.prevent="logout" class="text-lg hover:text-gray-800 hover:underline cursor-pointer">Logout</a></li>
        <li v-else><router-link to="/login" class="text-lg hover:text-gray-800 hover:underline">Login</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Header',
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
    };
  },
  methods: {
    logout() {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL;
      axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Logout successful:', response.data);
        localStorage.removeItem('token'); // Clear the token from local storage
        localStorage.removeItem('user'); // Optionally clear user data
        this.isAuthenticated = false; // Update authentication status
        this.$router.push('/login'); // Redirect to login page
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
    },
  },
};
</script>
