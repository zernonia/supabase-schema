<template>
  <div>
    <label class="mr-2 text-sm font-semibold uppercase">Table</label>
    <Select v-model="modelValue.table" :options="tableList"></Select>
    <label class="mr-2 mt-2 text-sm font-semibold uppercase">Column</label>
    <Select v-model="modelValue.column" :options="columnList"></Select>
    <label class="mr-2 mt-2 text-sm font-semibold uppercase">Measure</label>
    <Select v-model="modelValue.measure" :options="measureList"></Select>
  </div>
</template>

<script lang="ts">
  import { toRefs } from '@vueuse/core'
  import { defineComponent, computed, ref, watch, PropType } from 'vue'
  import { Column } from '../../interface'
  import { state, supabaseClientState } from '../../store'
  import * as d3 from 'd3'

  interface Config {
    table?: string
    column?: string
    measure?: string
    data?: number
  }
  export default defineComponent({
    props: {
      modelValue: {
        type: Object as PropType<Config>,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup(prop, { emit }) {
      const { modelValue } = toRefs(prop)
      const temp = {
        ...{
          table: '',
          column: '',
          measure: 'count',
          data: 0,
        },
        ...modelValue.value,
      }
      emit('update:modelValue', temp)

      const tableList = computed(() => Object.keys(state.tables))
      const columnList = computed(() => {
        if (!modelValue.value.table) {
          return []
        } else {
          modelValue.value.column = '*'
          const tbl = state.tables[modelValue.value.table].columns as Column[]

          return tbl
            .filter((a) => a.type == 'number' || a.type == 'integer')
            .map((a) => a.title)
        }
      })
      const measureList = ref(['max', 'min', 'count', 'average'])

      const calculated = computed(() => {
        if (!dataJSON.value.length) return 0
        switch (modelValue.value.measure) {
          case 'count':
            return dataJSON.value.length
            break
          case 'min':
            return d3.min(dataJSON.value.map((a) => a[modelValue.value.column]))
            break
          case 'max':
            return d3.max(dataJSON.value.map((a) => a[modelValue.value.column]))
            break
          case 'average':
            return d3.mean(
              dataJSON.value.map((a) => a[modelValue.value.column])
            )
            break
          default:
            return 0
        }
      })

      // fetch Supabase Data
      const dataJSON = ref([])
      const df = ref()
      const fetchData = async () => {
        if (modelValue.value.table) {
          const { data, error } = await supabaseClientState
            .supabase()
            .from(modelValue.value.table)
            .select('*')
          dataJSON.value = data as []
          console.log(dataJSON.value)
        }
      }

      watch(
        () => modelValue.value.table,
        () => {
          fetchData()
        }
      )

      watch(calculated, (n, o) => {
        modelValue.value.data = n
      })
      return {
        tableList,
        columnList,
        measureList,
      }
    },
  })
</script>
