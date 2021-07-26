<template>
  <main
    class="w-screen h-screen relative bg-dark-900 text-white overflow-hidden"
  >
    <router-view></router-view>
    <VNavigation></VNavigation>
    <VSettings></VSettings>
  </main>
  <VLoading v-if="isFetching"></VLoading>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import VTable from './components/Table.vue'
  import VSettings from './components/Settings.vue'
  import VNavigation from './components/Navigation.vue'
  import VLoading from './components/Loading.vue'
  import { state } from './store'
  export default defineComponent({
    components: {
      VTable,
      VSettings,
      VNavigation,
      VLoading,
    },
    setup() {
      const isMounted = ref(false)
      const isFetching = ref(false)

      return {
        isMounted,
        isFetching,
        state,
      }
    },
  })
</script>

<script lang="ts"></script>

<style></style>
