<template>
  <main
    class="w-screen h-screen relative bg-dark-900 text-white overflow-hidden"
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
          <VTable
            v-for="table in state.tables"
            :key="table.title"
            :table="table"
            :scale="scale"
            :mounted="isMounted"
            @table-dragging="isDraggingChild = $event"
          />
        </div>
      </div>
    </div>
    <VSettings></VSettings>
  </main>
  <VLoading v-if="isFetching"></VLoading>
</template>

<script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue'
  import { useStorage } from '@vueuse/core'
  import VTable from './components/Table.vue'
  import VSettings from './components/Settings.vue'
  import VLoading from './components/Loading.vue'
  import { state } from './store'
  export default defineComponent({
    components: {
      VTable,
      VSettings,
      VLoading,
    },
    setup() {
      const isMounted = ref(false)
      const isFetching = ref(false)
      onMounted(() => (isMounted.value = true))
      // Canvas
      const canvas = ref<any>(null)
      const translate = useStorage('translate', {
        x: 0,
        y: 0,
      }) // translate
      const scale = useStorage('scale', 1)

      const scrollEvent = (e: WheelEvent | any) => {
        const xs = (e.clientX - translate.value.x) / scale.value
        const ys = (e.clientY - translate.value.y) / scale.value
        const delta: number = e.wheelData ? e.wheelData : -e.deltaY
        if (delta > 0) {
          if (scale.value <= 3) scale.value *= 1.1
        } else {
          if (scale.value >= 0.5) scale.value /= 1.1
        }
        translate.value.x = e.clientX - xs * scale.value
        translate.value.y = e.clientY - ys * scale.value
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
        translate.value.x += movX
        translate.value.y += movY
      }
      const dragEnd = (e: MouseEvent) => {
        isDragging.value = false
        document.onmousemove = null
        document.onmouseup = null
      }

      const transformation = computed(() => {
        return `matrix(${scale.value},0,0,${scale.value},${translate.value.x},${translate.value.y})`
      })
      const transformOrigin = computed(() => {
        return `0 0`
      })

      return {
        isMounted,
        isFetching,
        state,

        canvas,
        scale,
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
