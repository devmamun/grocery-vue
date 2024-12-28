<template>
  <div class="flex justify-between bg-white border-b border-gray-400 p-4">
    <div class="text-xl">Pre-Orders</div>
    <div class="border border-gray-500 px-3 py-1 hover:bg-blue-600 hover:text-white">
      <router-link to="/admin/orders/add" class="text-gray-800 hover:text-white">Add Order</router-link>
    </div>
  </div>
  <!-- Table -->
  <div class="mt-4">
    <div class="relative overflow-x-auto sm:rounded-lg">
      <table class="w-full text-sm text-left bg-gray-50">
        <thead class="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th scope="col" class="px-6 py-3">Name</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Phone</th>
            <th scope="col" class="px-6 py-3">Order Date</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-200 border-b">
            <td class="px-6 py-4">{{ order.customerName }}</td>
            <td class="px-6 py-4">{{ order.email }}</td>
            <td class="px-6 py-4">{{ order.phone }}</td>
            <td class="px-6 py-4">{{ order.orderDate }}</td>
            <td class="px-6 py-4 flex space-x-2">
              <span @mouseover="editOrder(order.id)" class="text-blue-600 hover:text-blue-800 cursor-pointer">
                Edit
              </span>
              <span @mouseover="deleteOrder(order.id)" class="text-red-600 hover:text-red-800 cursor-pointer">
                Delete
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Pagination -->
  <div class="flex items-center justify-between bg-white pb-3 lg:px-0 shadow-md rounded-bl-xl rounded-br-xl sm:px-6 px-4">
    <div class="w-full mt-2 ml-5">
      <p>Total records: {{ pagination.total }}</p>
    </div>
    <div class="lg:w-3/5 w-full justify-end flex items-center">
      <div @click="onPageChanged(currentPage - 1)" :disabled="currentPage === 1" class="flex items-center pt-3 mr-5 text-gray-600 dark:text-gray-200 hover:text-indigo-700 cursor-pointer">
        <p class="text-sm ml-3 font-medium leading-none">Previous</p>
      </div>
      <div @click="onPageChanged(currentPage + 1)" :disabled="currentPage === totalPages" class="flex items-center pt-3 mr-5 text-gray-600 dark:text-gray-200 hover:text-indigo-700 cursor-pointer">
        <p class="text-sm font-medium leading-none mr-3">Next</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      orders: [
        { id: 1, customerName: 'John Doe', email: 'john@example.com', phone: '123-456-7890', orderDate: '2024-12-01' },
        { id: 2, customerName: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', orderDate: '2024-12-05' },
        { id: 3, customerName: 'Alice Johnson', email: 'alice@example.com', phone: '456-789-0123', orderDate: '2024-12-10' },
        { id: 4, customerName: 'Bob Brown', email: 'bob@example.com', phone: '321-654-9870', orderDate: '2024-12-15' },
        { id: 5, customerName: 'Charlie Davis', email: 'charlie@example.com', phone: '654-321-0987', orderDate: '2024-12-16' },
        { id: 6, customerName: 'Diana Evans', email: 'diana@example.com', phone: '789-012-3456', orderDate: '2024-12-17' },
        { id: 7, customerName: 'Ethan Foster', email: 'ethan@example.com', phone: '234-567-8901', orderDate: '2024-12-18' },
        { id: 8, customerName: 'Fiona Green', email: 'fiona@example.com', phone: '345-678-9012', orderDate: '2024-12-19' },
        { id: 9, customerName: 'George Harris', email: 'george@example.com', phone: '456-789-0123', orderDate: '2024-12-20' },
        { id: 10, customerName: 'Hannah Ivers', email: 'hannah@example.com', phone: '567-890-1234', orderDate: '2024-12-21' },
        { id: 11, customerName: 'Ian Johnson', email: 'ian@example.com', phone: '678-901-2345', orderDate: '2024-12-22' },
        { id: 12, customerName: 'Jack King', email: 'jack@example.com', phone: '789-012-3456', orderDate: '2024-12-23' },
        { id: 13, customerName: 'Kevin Lee', email: 'kevin@example.com', phone: '901-234-5678', orderDate: '2024-12-24' },
        { id: 14, customerName: 'Laura Martin', email: 'laura@example.com', phone: '123-456-7890', orderDate: '2024-12-25' },
      ],
      currentPage: 1,
      itemsPerPage: 10,
      sortKey: 'customerName',
      sortOrder: 'asc',
      pagination: {
        total: 0,
        prev_page_url: null,
        next_page_url: null,
      },
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => order.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredOrders.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },
  },
  methods: {
    onPageChanged(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    editOrder(id) {
      // Logic to edit the order
    },
    deleteOrder(id) {
      // Logic to delete the order
    },
  },
  mounted() {
    this.pagination.total = this.orders.length;
  },
};
</script>
