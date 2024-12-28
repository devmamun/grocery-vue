<template>
  <aside class="w-64 bg-gray-800 text-white h-screen p-4">
    <h2 class="text-lg font-bold mb-4">Grocery Store</h2>
    <hr>
    <ul class="mt-4">
      <li><router-link to="/admin/orders" class="block py-2 hover:bg-gray-700 bg-gray-700 rounded-md pl-4">Orders</router-link></li>
      <li><router-link to="/" class="block py-2 hover:bg-gray-700 pl-4 rounded-md">Visit Home</router-link></li>
      <li>
        <a @click.prevent="logout" class="block py-2 hover:bg-gray-700 pl-4 rounded-md text-red-600 hover:text-red-800 cursor-pointer">
          Logout
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  name: 'Sidebar',
  methods: {
    logout() {
      const token = localStorage.getItem('token');
      axios.post(`${apiUrl}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Logout successful:', response.data);
        localStorage.removeItem('token'); // Clear the token from local storage
        localStorage.removeItem('user'); // Optionally clear user data
        this.$router.push('/login'); // Redirect to login page
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
    },
  },
};
</script>
