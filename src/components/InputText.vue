<template>
  <div class="mb-2">
    <input
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      @input="inputValue"
      class="w-full dark:bg-dark-900 dark:text-white-700 dark:placeholder-dark-500 rounded-md px-4 py-2 h-10 flex-grow border-warm-gray-300 dark:border-dark-border focus:border-green-500 focus:ring-green-500"
    />
  </div>
</template>
<script setup lang="ts">
  const prop = defineProps({
    type: {
      type: String,
      default: 'text',
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'placeholder',
    },
    modelValue: {
      type: String,
      required: true,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue'])
  const inputValue = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
  }
</script>
