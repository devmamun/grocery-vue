<template>
  <aside class="w-64 bg-gray-800 text-white h-screen p-4">
    <h2 class="text-lg font-bold mb-4">Grocery Store</h2>
    <hr>
    <ul class="mt-4">
      <li><router-link to="/admin/orders" class="block py-2 hover:bg-gray-700 bg-gray-700 rounded-md pl-4">Orders</router-link></li>
      <li><router-link to="/" class="block py-2 hover:bg-gray-700 pl-4 rounded-md">Visit Home</router-link></li>
      <li><router-link to="/logout" class="block py-2 hover:bg-gray-700 pl-4 rounded-md">Logout</router-link></li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>
