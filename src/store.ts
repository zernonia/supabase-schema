import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'
import { Table, Column, TableState } from './interface'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const state = reactive({
  tables: useStorage('table-list', {} as TableState),
  setTables: (definition: any) => {
    let tableGroup: TableState = {}
    let key: string
    let value: any
    for ([key, value] of Object.entries(definition)) {
      let colGroup: Column[] = []
      Object.keys(value.properties).forEach((colKey: string) => {
        // Looping every Column
        const colVal = value.properties[colKey]
        let col: Column = {
          title: colKey,
          format: colVal.format.split(' ')[0],
          type: colVal.type,
          default: colVal.default ? colVal.default : undefined,
          required:
            value.required && value.required?.includes(colKey) ? true : false,
          pk:
            colVal.description && colVal.description?.includes('<pk/>')
              ? true
              : false,
          fk: colVal.description ? colVal.description.split('`')[1] : undefined,
        }
        colGroup.push(col)
      })
      // Push every table
      console.log(key)
      tableGroup[key] = {
        title: key,
        columns: colGroup,
        position: {
          x: state.tables[key] ? state.tables[key].position.x : 0,
          y: state.tables[key] ? state.tables[key].position.y : 0,
        },
      }
    }

    // console.log(tableGroup, state.tables)
    state.tables = tableGroup
  },
})

export const supabaseClientState = reactive({
  apikey: useStorage('supabase-apikey', {
    url: '',
    anon: '',
  }),
  supabase: () =>
    createClient(
      supabaseClientState.apikey.url,
      supabaseClientState.apikey.anon
    ),
})

export const visualState = reactive({})
