<template>
  <div>
    <AutoArrange />
    <SelectionArea
      class="container"
      :options="{ selectables: 'div.selectable' }"
      :on-move="onMove"
      :on-start="onStart"
      :on-before-start="onBeforeStart"
    >
      <div
        id="screen-canvas"
        class="w-screen h-screen relative overflow-hidden"
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
              :scale="view.scale"
              :mounted="isMounted"
              @table-dragging="isDraggingChild = $event"
            />
          </div>
        </div>
      </div>
    </SelectionArea>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted, watch } from 'vue'
  import { useStorage } from '@vueuse/core'
  import SelectionArea, { SelectionEvent } from '@viselect/vue'
  import { state } from '../store'

  export default defineComponent({
    components: {
      SelectionArea,
    },
    setup() {
      const isMounted = ref(false)
      const isFetching = ref(false)
      onMounted(() => (isMounted.value = true))
      // Canvas
      const canvas = ref<any>(null)
      const view = useStorage('view', {
        translate: {
          x: 0,
          y: 0,
        },
        scale: 1,
      })

      const scrollEvent = (e: WheelEvent | any) => {
        if (isDraggingChild.value) return
        const xs = (e.clientX - view.value.translate.x) / view.value.scale
        const ys = (e.clientY - view.value.translate.y) / view.value.scale
        const delta: number = e.wheelData ? e.wheelData : -e.deltaY
        if (delta > 0) {
          if (view.value.scale <= 3) view.value.scale *= 1.1
        } else {
          if (view.value.scale >= 0.5) view.value.scale /= 1.1
        }
        view.value.translate.x = e.clientX - xs * view.value.scale
        view.value.translate.y = e.clientY - ys * view.value.scale
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
        view.value.translate.x += movX
        view.value.translate.y += movY
      }
      const dragEnd = (e: MouseEvent) => {
        isDragging.value = false
        document.onmousemove = null
        document.onmouseup = null
      }

      const transformation = computed(() => {
        return `matrix(${view.value.scale},0,0,${view.value.scale},${view.value.translate.x},${view.value.translate.y})`
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

      return {
        isMounted,
        isFetching,
        state,

        canvas,
        view,
        isDragging,
        isDraggingChild,
        scrollEvent,
        dragStart,
        dragEvent,
        transformOrigin,
        transformation,

        onStart,
        onBeforeStart,
        onMove,
      }
    },
  })
</script>

<style lang="postcss">
  .selection-area {
    background: rgba(16, 185, 129, 0.055);
    border: 2px solid rgb(16, 185, 129);
    border-radius: 0.1em;
  }
  .selected {
    @apply border-green-500;
  }
</style>
