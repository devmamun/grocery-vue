<template>
  <Header />
  <main class="flex flex-col items-center justify-center py-20 bg-gray-100 p-4">
    <!-- Title -->
    <h1 class="text-3xl font-bold mb-6">Pre-Order Form</h1>

    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-red-100 text-red-700 p-4 rounded mb-4">
      {{ errorMessage }}
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-100 text-green-700 p-4 rounded mb-4">
      {{ successMessage }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded px-8 py-6 space-y-4 w-full max-w-md">
      <!-- Name Field -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
        />
        <p v-if="errors.name" class="text-red-500 text-xs italic">{{ errors.name }}</p>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="email"
          id="email"
          v-model="form.email"
          class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
        />
        <p v-if="errors.email" class="text-red-500 text-xs italic">{{ errors.email }}</p>
      </div>

      <!-- Phone Field (Conditional) -->
      <div v-if="requiresPhoneNumber">
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone:</label>
        <input
          type="tel"
          id="phone"
          v-model="form.phone"
          class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
        />
        <p v-if="errors.phone" class="text-red-500 text-xs italic">{{ errors.phone }}</p>
      </div>

      <!-- Product Field -->
      <div>
        <label for="product" class="block text-sm font-medium text-gray-700">Product:</label>
        <select
          id="product"
          v-model="form.product_id"
          class="border rounded p-2 w-full focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="" selected>Select a product</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
        <p v-if="errors.product_id" class="text-red-500 text-xs italic">{{ errors.product_id }}</p>
      </div>

      <!-- reCAPTCHA -->
      <vue-recaptcha ref="recaptcha" :sitekey="siteKey" @verify="handleRecaptchaVerify"></vue-recaptcha>

      <!-- Submit Button -->
      <button
        type="submit"
        class="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200"
      >
        Submit
      </button>
    </form>
  </main>
</template>

<script>
import Header from '../components/Header.vue';
import axios from 'axios';
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  name: 'PreOrderForm',

  components: {
    Header,
    VueRecaptcha,
  },

  data() {
    return {
      // Form Data
      form: {
        name: '',
        email: '',
        product_id: '',
        phone: '',
        recaptcha: '',
      },
      // Errors and Status Messages
      errors: {},
      errorMessage: '',
      successMessage: '',
      products: [],

      // Configuration
      siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      apiUrl: import.meta.env.VITE_API_URL,
    };
  },

  computed: {
    requiresPhoneNumber() {
      return this.form.email.endsWith('@xyz.com');
    },
  },

  methods: {
    /**
     * Fetch products from the API
     */
    fetchProducts() {
      axios
        .get(`${this.apiUrl}/products`)
        .then((response) => {
          this.products = response.data;
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    },

    /**
     * Handle reCAPTCHA verification
     */
    handleRecaptchaVerify(response) {
      this.form.recaptcha = response;
    },

    /**
     * Validate form fields
     */
    validateForm() {
      this.errors = {};
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.form.name) this.errors.name = 'Name is required.';
      if (!emailPattern.test(this.form.email)) this.errors.email = 'Valid email is required.';
      if (!this.form.product_id) this.errors.product_id = 'Product selection is required.';
      if (this.requiresPhoneNumber && !this.form.phone)
        this.errors.phone = 'Phone number is required for @xyz.com emails.';
    },

    /**
     * Submit the form
     */
    async handleSubmit() {
      this.validateForm();

      if (Object.keys(this.errors).length > 0) {
        return;
      }

      try {
        const response = await axios.post(`${this.apiUrl}/pre-orders`, {
          name: this.form.name,
          email: this.form.email,
          product_id: this.form.product_id,
          phone: this.form.phone,
          'g-recaptcha-response': this.form.recaptcha,
        });

        // Success response handling
        this.successMessage = 'Your pre-order has been submitted successfully!';
        this.errorMessage = '';
        this.resetForm();
      } catch (error) {
        // Error response handling
        if (error.response && error.response.status === 422) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        console.error('Error submitting pre-order:', error);
      }
    },

    /**
     * Reset the form fields
     */
    resetForm() {
      this.form = {
        name: '',
        email: '',
        product_id: '',
        phone: '',
        recaptcha: '',
      };
      this.errors = {};
      this.$refs.recaptcha.reset();
    },
  },

  /**
   * Lifecycle Hook: Fetch products when component is mounted
   */
  mounted() {
    this.fetchProducts();
  },
};
</script>
