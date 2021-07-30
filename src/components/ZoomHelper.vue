<template>
  <div
    class="flex items-center border-2 bg-dark-800 border-dark-border rounded-md opacity-50 hover:opacity-100"
  >
    <button
      @click="updateView('minus')"
      class="p-3 hover:bg-dark-600 focus:outline-none"
    >
      <i-heroicons-solid:minus-sm></i-heroicons-solid:minus-sm>
    </button>
    <p class="px-3 w-24 border-x-2 border-dark-border text-center">
      {{ (state.schemaView.scale * 100).toFixed(0) }}%
    </p>
    <button
      @click="updateView('plus')"
      class="p-3 hover:bg-dark-600 focus:outline-none"
    >
      <i-heroicons-solid:plus-sm></i-heroicons-solid:plus-sm>
    </button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { state } from '../store'

  export default defineComponent({
    setup() {
      const updateView = (type: string) => {
        if (type == 'plus') {
          if (state.schemaView.scale >= 3) return
          state.schemaView.scale += 0.1
        } else {
          if (state.schemaView.scale <= 0.47) return
          state.schemaView.scale -= 0.1
        }
      }

      return {
        state,
        updateView,
      }
    },
  })
</script>
