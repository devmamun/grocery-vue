<template>
  <div>
    <Header />
    <div class="flex items-center justify-center bg-gray-100 login-container py-20">
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

        <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-4">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="bg-green-100 text-green-700 p-4 rounded mb-4">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              v-model.trim="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div class="mb-4">
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <button
            @click="handleLoginClick"
            :disabled="isButtonDisabled"
            :class="{ 'disabled-button': isButtonDisabled }"
            type="submit"
            class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import { handleApiError } from '@/utils/errorHandler';

export default {
  name: 'Login',
  components: {
    Header,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      successMessage: '',
      isButtonDisabled: false,
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async handleLogin() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        // Login API request
        const response = await axios.post(`${apiUrl}/login`, {
          email: this.email,
          password: this.password,
        });

        // On success
        this.successMessage = 'Login successful! Redirecting...';
        this.errorMessage = '';
        // Store token and user data
        const { access_token, user } = response.data.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to orders page
        this.router.push('/admin/orders');
      } catch (error) {
        // Handle API errors
        this.errorMessage = handleApiError(error);
        this.successMessage = '';
      }
    },
    handleLoginClick() {
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.isButtonDisabled = false;
      }, 2000);
      this.handleLogin();
    },
  },
};
</script>

<style scoped>
.disabled-button {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}
</style>
