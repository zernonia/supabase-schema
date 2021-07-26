<template>
  <div>
    <h3>{{ measure }}</h3>
    <title>Count for X</title>
  </div>
</template>

<script lang="ts">
  import { toRefs } from '@vueuse/core'
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      measure: Number,
    },
    setup(prop) {
      const { measure } = toRefs(prop)
      return {}
    },
  })
</script>

<style></style>
