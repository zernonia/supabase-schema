<template>
  <div>
    <div>
      <label class="mr-2 text-sm font-medium uppercase">Title Text</label>
      <InputText v-model="modelValue.customize.titleText" />
    </div>
    <div>
      <label class="mr-2 text-sm font-medium uppercase">Title Size</label>
      <InputNumber v-model="modelValue.customize.titleSize" />
    </div>
    <div>
      <label class="mr-2 text-sm font-medium uppercase">Measure Size</label>
      <InputNumber v-model="modelValue.customize.measureSize" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, toRefs, watch } from 'vue'

  export default defineComponent({
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(prop, { emit }) {
      const { modelValue } = toRefs(prop)
      const temp = {
        ...{
          titleText: '',
          titleSize: 8,
          measureSize: 8,
        },
        ...modelValue.value.customize,
      }
      emit('update:modelValue', {
        config: modelValue.value.config,
        customize: temp,
      })

      watch(
        () => modelValue.value.config,
        (n, o) => {
          if (n.column != '*') {
            modelValue.value.customize.defaultTitleText =
              n.measure + ' of ' + n.column
          } else {
            modelValue.value.customize.defaultTitleText =
              n.measure + ' of ' + n.table
          }
        },
        {
          deep: true,
        }
      )

      return {}
    },
  })
</script>
