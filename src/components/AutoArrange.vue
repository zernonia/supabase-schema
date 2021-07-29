<template>
  <button
    class="right-3.95 top-5 absolute z-10 p-3 rounded-md bg-dark-800 border-2 border-dark-border cursor-pointer opacity-50 hover:opacity-100 hover:bg-dark-600 focus:outline-none"
    @click="state.autoArrange"
  >
    <i-ic:baseline-auto-fix-high></i-ic:baseline-auto-fix-high>
  </button>
</template>

<script lang="ts">
  import { defineComponent, watch } from 'vue'
  import { state } from '../store'

  export default defineComponent({
    setup() {
      return {
        state,
      }
    },
  })
</script>
