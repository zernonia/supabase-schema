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
      <button @click="state.clearVisual()">Clear Storage</button>
      <div id="canvas-children">
        <Visual
          v-for="(value, id) in state.visuals"
          :key="id"
          :scale="state.dashboardView.scale"
          :mounted="isMounted"
          :id="id"
          @visual-dragging="isDraggingChild = $event"
        />

        <div
          class="absolute top-0 -left-320px w-300px h-300px bg-dark-700 rounded-md"
        >
          <button
            @click="state.addVisual()"
            class="w-full h-full flex items-center justify-center opacity-50 hover:opacity-100 focus:outline-none"
          >
            <i-mdi:chart-box-plus-outline class="w-16 h-16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { state } from '../store'

  export default defineComponent({
    setup() {
      const isMounted = ref(false)
      const isFetching = ref(false)
      onMounted(() => (isMounted.value = true))
      // Canvas
      const canvas = ref<any>(null)

      const scrollEvent = (e: WheelEvent | any) => {
        if (!state.dashboardZoomable) return
        const xs =
          (e.clientX - state.dashboardView.translate.x) /
          state.dashboardView.scale
        const ys =
          (e.clientY - state.dashboardView.translate.y) /
          state.dashboardView.scale
        const delta: number = e.wheelData ? e.wheelData : -e.deltaY
        if (delta > 0) {
          if (state.dashboardView.scale <= 3) state.dashboardView.scale *= 1.1
        } else {
          if (state.dashboardView.scale >= 0.5) state.dashboardView.scale /= 1.1
        }
        state.dashboardView.translate.x =
          e.clientX - xs * state.dashboardView.scale
        state.dashboardView.translate.y =
          e.clientY - ys * state.dashboardView.scale
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
        state.dashboardView.translate.x += movX
        state.dashboardView.translate.y += movY
      }
      const dragEnd = (e: MouseEvent) => {
        isDragging.value = false
        document.onmousemove = null
        document.onmouseup = null
      }

      const transformation = computed(() => {
        return `matrix(${state.dashboardView.scale},0,0,${state.dashboardView.scale},${state.dashboardView.translate.x},${state.dashboardView.translate.y})`
      })
      const transformOrigin = computed(() => {
        return `0 0`
      })

      return {
        isMounted,
        isFetching,
        state,

        canvas,
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
