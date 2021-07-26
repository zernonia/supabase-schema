<template>
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
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStorage } from '@vueuse/core'
  import { state } from '../store'

  export default defineComponent({
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
        if (isDraggingChild.value) return
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
      }
    },
  })
</script>

<style></style>
