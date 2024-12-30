<template>
  <div class="flex justify-between bg-white border-b border-gray-400 p-4">
    <div class="text-xl">Edit Order</div>
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
      <div v-if="requiresPhoneNumber">
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
      <button type="submit" class="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200">Update</button>
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
    requiresPhoneNumber() {
      return this.form.email.endsWith('@xyz.com');
    }
  },
  methods: {
    async submitForm() {
      this.validateForm();
      if (Object.keys(this.errors).length === 0) {
        await this.updateOrder();
      }
    },
    async updateOrder() {
      try {
        const orderId = this.$route.params.id;
        const token = localStorage.getItem('token');
        const response = await axios.put(`${apiUrl}/pre-orders/${orderId}`, this.form, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.errorMessage = '';
        this.successMessage = 'Your order has been updated successfully!';
        await this.fetchOrderDetails();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Error updating order:', error);
      }
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
      if (this.requiresPhoneNumber && !this.form.phone) {
        this.errors.phone = 'Phone number is required for @xyz.com emails.';
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get(`${apiUrl}/products`);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchOrderDetails() {
      try {
        const orderId = this.$route.params.id;
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/pre-orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        this.form = response.data.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.$router.push('/admin/orders');
        } else {
          console.error('Error fetching order details:', error);
        }
      }
    },
    checkAuthentication() {
      const isAuthenticated = !!localStorage.getItem('token');
      if (!isAuthenticated) {
        this.$router.push('/login');
      }
    },
  },
  async mounted() {
    this.checkAuthentication();
    await this.fetchProducts();
    await this.fetchOrderDetails();
  },
};
</script>