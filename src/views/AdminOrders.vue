<template>
  <div class="flex justify-between bg-white border-b border-gray-400 p-4">
    <div class="text-xl">Pre-Orders</div>
    <div v-if="userRole === 'admin'" class="border border-gray-500 px-3 py-1 hover:bg-blue-600 hover:text-white">
      <router-link to="/admin/orders/add" class="text-gray-800 hover:text-white">Add Order</router-link>
    </div>
  </div>
  <!-- Table -->
   <div class="mt-4 mb-1 flex items-center justify-end" :class="{ 'justify-between': errorMessage }">
     <div v-if="errorMessage" class="bg-red-100 text-red-700 py-2 px-5 rounded">{{ errorMessage }}</div>
     <input type="text" v-model="searchQuery" @input="fetchOrders" placeholder="Search by name or email" class="border rounded p-2" />
   </div>
  <div>
    <div class="relative overflow-x-auto sm:rounded-lg">
      <table class="w-full text-sm text-left bg-gray-50">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3">Customer Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Product</th>
            <th scope="col" class="px-6 py-3">Phone</th>
            <th scope="col" class="px-6 py-3">Order Date</th>
            <th v-if="userRole !== 'manager'" scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="errorTableMessage">
            <td colspan="6" class="text-center text-red-600 py-3">{{ errorTableMessage }}</td>
          </tr>
          <tr v-else v-for="order in orders" :key="order.id" class="hover:bg-gray-200 border-b">
            <td class="px-6 py-4">{{ order.name }}</td>
            <td class="px-6 py-4">{{ order.email }}</td>
            <td class="px-6 py-4">{{ order.product }}</td>
            <td class="px-6 py-4">{{ order.phone }}</td>
            <td class="px-6 py-4">{{ new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(order.created_at)) }}</td>
            <td v-if="userRole !== 'manager'" class="px-6 py-4 flex space-x-2">
              <router-link v-if="userRole === 'admin'" :to="'/admin/orders/edit/' + order.id" class="text-blue-600 hover:text-blue-800 cursor-pointer">Edit</router-link>
              <span v-if="userRole === 'admin'" @click="deleteOrder(order.id)" class="text-red-600 hover:text-red-800 cursor-pointer">
                Delete
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Pagination -->
  <div v-if="errorTableMessage === ''" class="flex items-center justify-between bg-white pb-3 lg:px-0 shadow-md rounded-bl-xl rounded-br-xl sm:px-6 px-4">
    <div class="w-full mt-2 ml-5">
      <p>Total records: {{ pagination.total }}</p>
    </div>
    <div class="lg:w-3/5 w-full justify-end flex items-center">
      <div @click="onPageChanged(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="flex items-center pt-3 mr-5 text-gray-600 dark:text-gray-200 hover:text-indigo-700 cursor-pointer">
        <p class="text-sm ml-3 font-medium leading-none">Previous</p>
      </div>
      <div @click="onPageChanged(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="flex items-center pt-3 mr-5 text-gray-600 dark:text-gray-200 hover:text-indigo-700 cursor-pointer">
        <p class="text-sm font-medium leading-none mr-3">Next</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { debounce } from 'lodash'; // Import debounce from lodash

const apiUrl = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      searchQuery: '',
      orders: [],
      sortKey: 'customer_name',
      sortOrder: 'asc',
      pagination: {
        total: 0,
        prev_page_url: null,
        next_page_url: null,
        current_page: 1,
        last_page: 1,
      },
      errorTableMessage: '',
      errorMessage: '',
      userRole: '', // Variable to store user role
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.pagination.total / this.itemsPerPage);
    },
  },
  methods: {
    onPageChanged(page) {
      if (page > 0 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchOrders(); // Fetch orders for the selected page
      }
    },
    editOrder(id) {
      // Logic to edit the order
    },
    deleteOrder(id) {
      const token = localStorage.getItem('token');
      axios.delete(`${apiUrl}/pre-orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Order deleted:', response.data);
        this.fetchOrders(); // Refresh the order list after deletion
      })
      .catch(error => {
        if (error.response && error.response.status === 403) {
          this.errorMessage = 'You do not have permission to delete order'; // Set error message for 403
        } else {
          this.errorMessage = 'Error deleting order';
          console.error('Error deleting order:', error);
        }
      });
    },
    fetchOrders: debounce(function() {
      const token = localStorage.getItem('token');
      axios.get(`${apiUrl}/pre-orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: this.pagination.current_page,
          search: this.searchQuery // Include the search query in the request
        }
      })
      .then(response => {
        console.log('API Response:', response.data); // Log the entire response
        this.orders = response.data.data.data; // Access the orders array
        this.pagination.total = response.data.data.total; // Set the total count of orders
        this.pagination.current_page = response.data.data.current_page; // Set current page
        this.pagination.last_page = response.data.data.last_page; // Set last page
        this.errorTableMessage = ''; // Clear any previous error messages
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          this.errorTableMessage = 'No record found'; // Set error message for 404
        } else if(error.response && error.response.status === 401) {
          localStorage.removeItem('token'); // Clear the token from local storage
          localStorage.removeItem('user'); // Optionally clear user data
          this.$router.push('/login'); // Redirect to login if not authenticated
        } else {
          this.errorTableMessage = 'Error fetching orders';
        }
      });
    }, 300), // Adjust the debounce time as needed (300ms here)
    checkAuthentication() {
      const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists
      if (!isAuthenticated) {
        this.$router.push('/login'); // Redirect to login if not authenticated
      }
    },
    fetchUserRole() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.userRole = user ? user.role : ''; // Get user role from local storage
    },
  },
  mounted() {
    this.checkAuthentication();
    this.fetchUserRole(); // Fetch user role on mount
    this.fetchOrders();
  },
};
</script>
