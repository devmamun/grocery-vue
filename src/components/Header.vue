<template>
  <header class="flex justify-between items-center p-4 bg-gray-200 text-gray-600 shadow-md border-b border-gray-400">
    <div class="text-2xl font-bold">
      <router-link to="/" class="text-gray-700">Grocery Store</router-link>
    </div>
    <nav class="flex space-x-4">
      <router-link to="/login" class="text-lg hover:text-gray-800 hover:underline">Login</router-link>
      <router-link to="/admin/orders" class="text-lg hover:text-gray-800 hover:underline">Admin Panel</router-link>
      <router-link to="/logout" class="text-lg hover:text-gray-800 hover:underline">Logout</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>
