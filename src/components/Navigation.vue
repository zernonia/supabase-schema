<template>
  <menu
    class="absolute z-1000 top-5 right-5 m-0 p-0 rounded-md border border-dark-border opacity-50 hover:opacity-100"
  >
    <div class="relative bg-dark-800 rounded-bl-md">
      <div class="flex flex-row">
        <div
          class="p-3 cursor-pointer hover:bg-dark-600 text-white-800"
          :class="{ '!text-white': route.name == 'Dashboard' }"
          @click="router.push({ name: 'Dashboard' })"
        >
          <i-majesticons:analytics-line></i-majesticons:analytics-line>
        </div>
        <div
          class="p-3 cursor-pointer hover:bg-dark-600 text-white-800"
          :class="{ '!text-white': route.name == 'Schema' }"
          @click="router.push({ name: 'Schema' })"
        >
          <i-ic:outline-account-tree></i-ic:outline-account-tree>
        </div>
      </div>
    </div>
  </menu>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import Logo from '../assets/logo.svg'

  export default defineComponent({
    setup() {
      const route = useRoute()
      const router = useRouter()

      return {
        Logo,
        route,
        router,
      }
    },
  })
</script>

<style></style>
