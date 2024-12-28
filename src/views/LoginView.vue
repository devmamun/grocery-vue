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
        <form @submit.prevent="login">
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
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  components: {
    Header
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    login() {
      axios.post(`${apiUrl}/login`, {
        email: this.email,
        password: this.password
      })
      .then(response => {
        console.log('Login successful:', response.data);
        this.successMessage = 'Login successful!';
        this.errorMessage = ''; // Clear any previous error messages
        // Store token and user information in local storage
        localStorage.setItem('token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        // Redirect to /admin/orders
        this.router.push('/admin/orders');
      })
      .catch(error => {
        if (error.response && error.response.status === 422) {
            this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Error logging in:', error);
      });
    },
  },
};
</script>
