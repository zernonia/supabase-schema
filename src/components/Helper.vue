<template>
  <div class="flex items-center space-x-3 right-3.95 bottom-5 absolute z-10">
    <HelperExportTypes v-tooltip="'Export Types'" @click="exportTypes = true" />
    <HelperExport v-tooltip="'Export SQL'" @click="exportSQL = true" />
    <HelperScreenshot v-tooltip="'Take a screenshot'" @click="screenshot" />
    <HelperAutoArrange v-tooltip="'Auto arrange'" @click="autoArrange" />
    <HelperFocus v-tooltip="'Focus everything center'" @click="focusView" />
    <HelperZoom />

    <ModalSQL :open="exportSQL" @close="exportSQL = false"></ModalSQL>
    <ModalTypes :open="exportTypes" @close="exportTypes = false"></ModalTypes>
  </div>
</template>

<script lang="ts">
  import { defineComponent, nextTick, ref, watch } from 'vue'
  import { state } from '../store'
  import { toPng } from 'html-to-image'
  import ModalTypes from './ModalTypes.vue'

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

      const screenshot = () => {
        const el = document.getElementById('screen-canvas') as HTMLElement
        toPng(el).then((dataUrl) => {
          var link = document.createElement('a')
          link.download = 'Supbase Schema.png'
          link.href = dataUrl
          link.click()
        })
      }

      const exportSQL = ref(false)
      const exportTypes = ref(false)

      return {
        state,
        autoArrange,
        focusView,
        screenshot,
        exportSQL,
        exportTypes,
      }
    },
  })
</script>
