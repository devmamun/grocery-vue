<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between bg-white border-b p-4">
      <div class="text-xl">Pre-Orders</div>
      <div v-if="userRole === ROLES.ADMIN" class="border px-3 py-1 hover:bg-blue-600 hover:text-white">
        <router-link to="/admin/orders/add">Add Order</router-link>
      </div>
    </div>

    <!-- Search and Error -->
    <div class="mt-4 mb-1 flex items-center justify-end" :class="{ 'justify-between': errorMessage }">
      <div v-if="errorMessage" class="bg-red-100 text-red-700 py-2 px-5 rounded">{{ errorMessage }}</div>
      <input
        type="text"
        v-model="searchQuery"
        @input="fetchOrders"
        placeholder="Search by name or email"
        class="border rounded p-2"
      />
    </div>

    <!-- Table -->
    <div class="relative overflow-x-auto mt-4 sm:rounded-lg">
      <table class="w-full text-sm text-left bg-gray-50">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th class="px-6 py-3">Customer Name</th>
            <th class="px-6 py-3">Email</th>
            <th class="px-6 py-3">Product</th>
            <th class="px-6 py-3">Phone</th>
            <th class="px-6 py-3">Order Date</th>
            <th v-if="userRole !== ROLES.MANAGER" class="px-6 py-3">Actions</th>
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
            <td class="px-6 py-4">{{ formatDate(order.created_at) }}</td>
            <td v-if="userRole !== ROLES.MANAGER" class="px-6 py-4 flex space-x-2">
              <router-link
                v-if="userRole === ROLES.ADMIN"
                :to="'/admin/orders/edit/' + order.id"
                class="text-blue-600 hover:text-blue-800"
              >
                Edit
              </router-link>
              <span
                v-if="userRole === ROLES.ADMIN"
                @click="deleteOrder(order.id)"
                class="text-red-600 hover:text-red-800 cursor-pointer"
              >
                Delete
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
      :currentPage="pagination.current_page"
      :lastPage="pagination.last_page"
      :total="pagination.total"
      @prev="onPageChanged(pagination.current_page - 1)"
      @next="onPageChanged(pagination.current_page + 1)"
    />
  </div>
</template>

<script>
import { getOrders, deleteOrder } from '../../services/apiService';
import { handleApiError } from '../../utils/errorHandler';
import Pagination from '../../components/Pagination.vue';
import { ROLES } from '../../constants/roles';

export default {
  components: { Pagination },
  data() {
    return {
      searchQuery: '',
      orders: [],
      pagination: { total: 0, current_page: 1, last_page: 1 },
      errorTableMessage: '',
      errorMessage: '',
      userRole: '',
      ROLES,
    };
  },
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      }).format(new Date(date));
    },
    fetchOrders() {
      getOrders({ page: this.pagination.current_page, search: this.searchQuery })
        .then((response) => {
          const data = response.data.data;
          this.orders = data.data;
          this.pagination = {
            total: data.total,
            current_page: data.current_page,
            last_page: data.last_page,
          };
          this.errorTableMessage = '';
        })
        .catch((error) => {
          this.errorTableMessage = handleApiError(error);
        });
    },
    deleteOrder(id) {
      deleteOrder(id)
        .then(() => this.fetchOrders())
        .catch((error) => {
          this.errorMessage = handleApiError(error);
        });
    },
    onPageChanged(page) {
      if (page > 0 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchOrders();
      }
    },
    checkAuthentication() {
      if (!localStorage.getItem('token')) {
        this.$router.push('/login');
      }
    },
    fetchUserRole() {
      const user = JSON.parse(localStorage.getItem('user'));
      this.userRole = user ? user.role : '';
    },
  },
  mounted() {
    this.checkAuthentication();
    this.fetchUserRole();
    this.fetchOrders();
  },
};
</script>
