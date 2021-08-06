<template>
  <div class="w-full h-full relative flex items-center justify-center">
    <h1
      class="absolute top-6 font-medium text-center px-6"
      :style="{
        fontSize: modelValue.customize.titleSize + 'px',
      }"
    >
      {{
        modelValue.customize.titleText
          ? modelValue.customize.titleText
          : modelValue.customize.defaultTitleText
      }}
    </h1>
    <p
      class="font-medium text-white"
      :style="{
        fontSize: modelValue.customize.measureSize + 'px',
      }"
    >
      {{ nFormatter(modelValue.config.data, modelValue.customize.decimal) }}
    </p>
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
    setup() {
      const nFormatter = (num: number, digits: number) => {
        const lookup = [
          { value: 1, symbol: '' },
          { value: 1e3, symbol: 'k' },
          { value: 1e6, symbol: 'M' },
          { value: 1e9, symbol: 'G' },
          { value: 1e12, symbol: 'T' },
          { value: 1e15, symbol: 'P' },
          { value: 1e18, symbol: 'E' },
        ]
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
        var item = lookup
          .slice()
          .reverse()
          .find(function (item) {
            return num >= item.value
          })

        if (item) {
          return item
            ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
            : '0'
        } else {
          return num?.toFixed(digits)
        }
      }

      return {
        nFormatter,
      }
    },
  })
</script>

<style></style>
