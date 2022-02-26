<template>
  <div>
    <Helper />
    <SelectionArea
      class="container"
      :options="{ selectables: 'div.selectable' }"
      :on-move="onMove"
      :on-start="onStart"
      :on-before-start="onBeforeStart"
    >
      <div
        id="screen-canvas"
        class="w-screen h-screen relative overflow-hidden dark:bg-dark-900"
        :style="{ cursor: isDragging ? 'grabbing' : 'default' }"
        @wheel="scrollEvent"
        @mousedown="dragStart"
        @mouseup="isDragging = false"
      >
        <div
          id="canvas"
          ref="canvas"
          :style="{ transformOrigin, transform: transformation }"
          class="absolute select-none relative boxes"
        >
          <div id="canvas-children">
            <Table
              v-for="table in state.tables"
              :key="table.title"
              :table="table"
              :scale="state.schemaView.scale"
              :mounted="isMounted"
              @table-dragging="isDraggingChild = $event"
            />
          </div>
        </div>
      </div>
    </SelectionArea>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import SelectionArea, { SelectionEvent } from '@viselect/vue'
  import { state } from '../store'

  const isMounted = ref(false)
  const isFetching = ref(false)
  onMounted(() => (isMounted.value = true))
  // Canvas
  const canvas = ref<any>(null)

  const scrollEvent = (e: WheelEvent | any) => {
    if (isDraggingChild.value) return
    const xs =
      (e.clientX - state.schemaView.translate.x) / state.schemaView.scale
    const ys =
      (e.clientY - state.schemaView.translate.y) / state.schemaView.scale
    const delta: number = e.wheelData ? e.wheelData : -e.deltaY
    if (delta > 0) {
      if (state.schemaView.scale <= 3) state.schemaView.scale *= 1.1
    } else {
      if (state.schemaView.scale >= 0.5) state.schemaView.scale /= 1.1
    }
    state.schemaView.translate.x = e.clientX - xs * state.schemaView.scale
    state.schemaView.translate.y = e.clientY - ys * state.schemaView.scale
  }

  const isDragging = ref(false)
  const isDraggingChild = ref(false)
  const dragStart = (e: MouseEvent) => {
    if (e.which != 2) return
    isDragging.value = true
    document.onmousemove = dragEvent
    document.onmouseup = dragEnd
  }
  const dragEvent = (e: MouseEvent) => {
    const movX = e.movementX
    const movY = e.movementY
    state.schemaView.translate.x += movX
    state.schemaView.translate.y += movY
  }
  const dragEnd = (e: MouseEvent) => {
    isDragging.value = false
    document.onmousemove = null
    document.onmouseup = null
  }

  const transformation = computed(() => {
    return `matrix(${state.schemaView.scale},0,0,${state.schemaView.scale},${state.schemaView.translate.x},${state.schemaView.translate.y})`
  })
  const transformOrigin = computed(() => {
    return `0 0`
  })

  // SelectionJS
  const onBeforeStart = ({ event, selection }: SelectionEvent) => {
    const element = event?.target as Element
    if (event?.which != 1) {
      return false
    } else if (element.closest('.selectable')) {
      return false
    }
    state.tableSelected.forEach((el) => {
      el.classList.remove('selected')
    })
    selection.clearSelection()
    state.tableSelected.clear()
  }
  const onStart = ({ event, selection }: SelectionEvent) => {
    // if (!event?.ctrlKey && !event?.metaKey) {
    //   selection.clearSelection()
    //   state.tableSelected.clear()
    // }
  }

  const onMove = ({
    event,
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    for (const el of added) {
      state.tableSelected.add(el)
      el.classList.add('selected')
    }
    for (const el of removed) {
      state.tableSelected.delete(el)
      el.classList.remove('selected')
    }
  }

  // clear previous v1 localstorage
  onMounted(() => {
    if (localStorage.getItem('url') != null) {
      localStorage.clear()
      location.reload()
    }
  })
</script>

<style lang="postcss">
  .selection-area {
    background: rgba(16, 185, 129, 0.055);
    border: 2px solid rgb(16, 185, 129);
    border-radius: 0.1em;
  }
  .selected {
    @apply !border-green-500;
  }
  .container {
    @apply !max-w-none;
  }
</style>
