<template>
  <div class="w-full h-full relative flex items-center justify-center">
    <h1 class="absolute top-5 text-2xl font-medium">
      {{
        modelValue.customize.titleText
          ? modelValue.customize.titleText
          : modelValue.customize.defaultTitleText
      }}
    </h1>
    <p class="text-6xl font-medium text-white">{{ modelValue.config.data }}</p>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
    },
  })
</script>

<style></style>
