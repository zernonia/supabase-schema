import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

export let state: any = reactive({
  tables: [],
  getTable: (name: string) => {
    state[name] = useStorage(name, {
      x: 0,
      y: 0,
    })
  },
})
