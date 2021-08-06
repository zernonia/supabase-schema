import { useStorage } from '@vueuse/core'
import { reactive } from 'vue'
import { Table, Column, TableState, VisualState } from './interface'
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

  dashboardZoomable: true,
  dashboardView: useStorage('view-dashboard', {
    translate: {
      x: 0,
      y: 0,
    },
    scale: 1,
  }),
  zoomonVisual: (x: number, y: number) => {
    state.dashboardView.translate = {
      x,
      y,
    }
  },
  isEditing: false,
  visuals: useStorage('visual-list', {} as VisualState),
  clearVisual: () => {
    for (var member in state.visuals) delete state.visuals[member]
  },
  addVisual: () => {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    const firstPart = (Math.random() * 46656) | 0
    const secondPart = (Math.random() * 46656) | 0
    const first = ('000' + firstPart.toString(36)).slice(-3)
    const second = ('000' + secondPart.toString(36)).slice(-3)
    const combine = first + second
    state.visuals[combine] = {
      id: combine,
      type: 'card',
      position: {
        x: -320,
        y: 320,
      },
      size: {
        width: 300,
        height: 300,
      },
      visual: {
        config: {},
        customize: {},
      },
    }
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
