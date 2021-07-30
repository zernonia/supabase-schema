<template>
  <div class="flex items-center space-x-3 right-3.95 bottom-5 absolute z-10">
    <HelperAutoArrange @click="autoArrange" />
    <HelperFocus @click="focusView" />
    <HelperZoom />
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, watch } from 'vue'
  import { state } from '../store'

  export default defineComponent({
    setup() {
      const autoArrange = () => {
        state.autoArrange()
        nextTick(() => {
          focusView()
        })
      }

      const focusView = () => {
        const padding = 100 // padding around the view
        const assumeWidthHeight = 300
        const allX = Object.values(state.tables).map((a) => a.position.x)
        const minX = Math.min.apply(null, allX)
        const maxX = Math.max.apply(null, allX) + assumeWidthHeight
        const allY = Object.values(state.tables).map((a) => a.position.y)
        const minY = Math.min.apply(null, allY)
        const maxY = Math.max.apply(null, allY) + assumeWidthHeight

        const diffX = maxX - minX + padding * 2
        const diffY = maxY - minY + padding * 2
        const scaleX = window.innerWidth / diffX
        const scaleY = window.innerHeight / diffY

        const bestScale = Math.min(scaleX, scaleY)
        state.schemaView.scale = bestScale

        const centeringX = (window.innerWidth - diffX * bestScale) * bestScale
        const centeringY = (window.innerHeight - diffY * bestScale) * bestScale

        const translateX = (-1 * minX + centeringX + padding) * bestScale
        const translateY = (-1 * minY + centeringY + padding) * bestScale

        state.schemaView.translate.x = translateX
        state.schemaView.translate.y = translateY
      }

      return {
        state,
        autoArrange,
        focusView,
      }
    },
  })
</script>
