import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'
import { Column, TableState } from './interface'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const state = reactive({
  isModalOpen: false,
  tables: useStorage('table-list', {} as TableState),
  setTables: (definition: any, paths: any) => {
    let tableGroup: TableState = {}
    let key: string
    let value: any
    const checkView = (title: string) => {
      if (Object.keys(paths[`/${title}`]).length == 1) {
        return true
      } else {
        return false
      }
    }

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
      tableGroup[key] = {
        title: key,
        is_view: checkView(key),
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
  autoArrange: () => {
    const gap = 250 // gap beween each table
    const column = 3
    const minWidth: number[] = []
    const minHeight: number[] = []
    const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(
      '#canvas-children > div'
    )
    nodeList.forEach((el, index) => {
      if (minWidth[index % column]) {
        minWidth[index % column] < el.offsetWidth
          ? (minWidth[index % column] = minWidth[index % column])
          : ''
      } else {
        minWidth[index % column] = el.offsetWidth
      }
      if (minHeight[Math.floor(index / column)]) {
        minHeight[Math.floor(index / column)] < el.offsetHeight
          ? (minHeight[Math.floor(index / column)] =
              minHeight[Math.floor(index / column)])
          : ''
      } else {
        minHeight[Math.floor(index / column)] = el.offsetHeight
      }
    })

    minWidth.unshift(0)
    minHeight.unshift(0)

    const setLeft = minWidth.map((elem, index) =>
      minWidth.slice(0, index + 1).reduce((a, b) => a + b + gap)
    )
    const setTop = minHeight.map((elem, index) =>
      minHeight.slice(0, index + 1).reduce((a, b) => a + b + gap)
    )

    nodeList.forEach((el, index) => {
      state.tables[el.id].position.x = setLeft[index % column]
      state.tables[el.id].position.y = setTop[Math.floor(index / column)]
    })
  },
  tableSelected: new Set<Element>(),
  tableHighlighted: '',
  connectorHighlighted: [],
  schemaView: useStorage('view', {
    translate: {
      x: 0,
      y: 0,
    },
    scale: 1,
  }),
})

export const supabaseClientState = reactive({
  apikey: useStorage('supabase-apikey', {
    url: import.meta.env.SUPABASE_API_URL || '',
    anon: import.meta.env.SUPABASE_ANON_KEY || '',
    last_url: '',
  } as { url: string; anon: string; last_url: string }),
  supabase: () =>
    createClient(
      supabaseClientState.apikey.url,
      supabaseClientState.apikey.anon
    ),
})

export const visualState = reactive({})
