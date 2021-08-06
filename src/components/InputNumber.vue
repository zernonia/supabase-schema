<template>
  <div class="flex items-center mb-2">
    <input
      type="number"
      :name="name"
      :value="modelValue"
      :min="min"
      :max="max"
      @input="inputValue"
      class="w-full bg-dark-900 text-white-700 placeholder-dark-500 rounded-md px-4 py-2 h-10 w-full border-dark-border focus:border-green-500 focus:ring-green-500"
    />
    <span v-if="postfix != ''" class="text-sm ml-2">{{ postfix }}</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    props: {
      name: {
        type: String,
        default: '',
      },
      modelValue: {
        type: Number,
        default: 0,
      },
      postfix: {
        type: String,
        default: 'px',
      },
      min: {
        type: Number,
        default: 8,
      },
      max: {
        type: Number,
        default: 100,
      },
    },
    emits: ['update:modelValue'],
    setup(prop, { emit }) {
      const inputValue = (e: Event) => {
        emit(
          'update:modelValue',
          parseInt((e.target as HTMLInputElement).value)
        )
      }
      return {
        inputValue,
      }
    },
  })
</script>
