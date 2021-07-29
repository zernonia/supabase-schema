<template>
  <main
    class="w-screen h-screen relative bg-dark-900 text-white overflow-hidden"
  >
    <router-view></router-view>
    <Navigation></Navigation>
    <Settings></Settings>
  </main>
  <Loading v-if="isFetching"></Loading>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'

  import { state } from './store'
  export default defineComponent({
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
