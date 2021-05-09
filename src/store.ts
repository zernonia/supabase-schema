import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'

export const state: any = reactive({
  tables: [],
  getTable: (name: string) => {
    state[name] = useStorage(name, {
      x: 0,
      y: 0,
    })
  },
})
