<template>
  <button
    :class="[modelValue == value ? '!opacity-100 bg-dark-600' : '']"
    @click="$emit('update:modelValue', value)"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      modelValue: String,
      value: String,
    },
    emits: ['update:modelValue'],
  })
</script>
