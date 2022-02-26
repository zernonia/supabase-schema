<template>
  <main
    class="w-screen h-screen relative bg-dark-900 text-white overflow-hidden"
  >
    <router-view></router-view>
    <!-- <Navigation></Navigation> -->
    <Settings></Settings>
  </main>
  <Loading v-if="isFetching"></Loading>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const isFetching = ref(false)
</script>
