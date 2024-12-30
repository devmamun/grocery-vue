<template>
  <div v-if="total > 0" class="pagination flex justify-between space-x-2 mt-3">
    <span>Total Records: {{ total }}</span>
    <div class="pagination flex justify-end space-x-2 mt-3">
      <button class="text-blue-500 hover:text-blue-600 transition duration-200" @click="$emit('prev')" :disabled="currentPage === 1">Previous</button>
      <span class="text-gray-600">{{ currentPage }} / {{ lastPage }}</span>
      <button class="text-blue-500 hover:text-blue-600 transition duration-200" @click="$emit('next')" :disabled="currentPage === lastPage">Next</button>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    props: ['currentPage', 'lastPage', 'total'],
  };
  </script>
  