<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="bg-white p-6 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" v-model="password" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      // Logic for handling login
      console.log('Logging in with', this.email, this.password);
    },
  },
};
</script>
