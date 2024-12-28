<template>
  <div class="flex justify-between bg-white border-b border-gray-400 p-4">
    <div class="text-xl">Add Order</div>
    <div class="border border-gray-500 px-3 py-1 hover:bg-blue-600 hover:text-white">
      <router-link to="/admin/orders" class="text-gray-800 hover:text-white">Back to Orders</router-link>
    </div>
  </div>
  <main class="flex flex-col items-center justify-center bg-gray-100 p-5 py-20">
    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-4">
        {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="bg-green-100 text-green-700 p-4 rounded mb-4">
      {{ successMessage }}
    </div>
    <form @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 py-6 space-y-4 w-full max-w-md">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input type="text" id="name" v-model="form.name" class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300" />
        <p v-if="errors.name" class="text-red-500 text-xs italic">{{ errors.name }}</p>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
        <input type="email" id="email" v-model="form.email" class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300" />
        <p v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</p>
      </div>
      <div v-if="isXyzEmail">
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone:</label>
        <input type="text" id="phone" v-model="form.phone" class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300" />
        <p v-if="errors.phone" class="text-red-500 text-xs italic">{{ errors.phone }}</p>
      </div>
      <div>
        <label for="product" class="block text-sm font-medium text-gray-700">Product:</label>
        <select id="product" v-model="form.product_id" class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300">
          <option value="" selected>Select a product</option>
          <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
        </select>
        <p v-if="errors.product" class="text-red-500 text-xs italic">{{ errors.product }}</p>
      </div>
      <button type="submit" class="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200">Submit</button>
    </form>
  </main>
</template>

<script>
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        product_id: '',
        phone: ''
      },
      errors: {},
      products: [],
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    isXyzEmail() {
      return this.form.email.endsWith('@xyz.com');
    }
  },
  methods: {
    submitForm() {
      this.validateForm();
      if (Object.keys(this.errors).length === 0) {
        this.submitPreOrder();
      }
    },
    submitPreOrder() {
      axios.post(`${apiUrl}/pre-orders`, this.form)
        .then(response => {
          this.errorMessage = ''; // Clear any previous error messages
          this.successMessage = 'Your pre-order has been submitted successfully!';
          this.form = { name: '', email: '', product_id: '', phone: '' }; // Reset the form
        })
        .catch(error => {
          if (error.response && error.response.status === 422) {
            this.errorMessage = error.response.data.message;
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
          console.error('Error submitting pre-order:', error);
        });
    },
    validateForm() {
      this.errors = {};
      if (!this.form.name) {
        this.errors.name = 'Name is required.';
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email.';
      }
      if (!this.form.product_id) {
        this.errors.product = 'Please select a product.';
      }
      if (this.isXyzEmail && !this.form.phone) {
        this.errors.phone = 'Phone number is required for @xyz.com emails.';
      }
    },
    fetchProducts() {
      axios.get(`${apiUrl}/products`)
        .then(response => {
          this.products = response.data;
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    },
    checkAuthentication() {
      const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists
      if (!isAuthenticated) {
        this.$router.push('/login'); // Redirect to login if not authenticated
      }
    },
  },
  mounted() {
    this.checkAuthentication();
    this.fetchProducts();
  },
};
</script>
