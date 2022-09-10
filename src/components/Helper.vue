<template>
  <div class="flex items-center space-x-3 right-3.95 bottom-5 absolute z-10">
    <button
      class="btn"
      v-tooltip="copied ? 'Copied' : 'Share link'"
      @click="shareLink"
    >
      <i-mdi:share-variant-outline></i-mdi:share-variant-outline>
    </button>

    <button class="btn" v-tooltip="'Export Types'" @click="exportTypes = true">
      <i-mdi:language-typescript></i-mdi:language-typescript>
    </button>

    <button class="btn" v-tooltip="'Export SQL'" @click="exportSQL = true">
      <i-mdi:database-export-outline></i-mdi:database-export-outline>
    </button>

    <button class="btn" v-tooltip="'Take a screenshot'" @click="screenshot">
      <i-mdi:camera-outline></i-mdi:camera-outline>
    </button>

    <button class="btn" v-tooltip="'Auto arrange'" @click="autoArrange">
      <i-ic:baseline-auto-fix-high></i-ic:baseline-auto-fix-high>
    </button>

    <button
      class="btn"
      v-tooltip="'Focus everything center'"
      @click="focusView"
    >
      <i-uil:focus-target></i-uil:focus-target>
    </button>

    <HelperZoom />

    <ModalSQL :open="exportSQL" @close="exportSQL = false"></ModalSQL>
    <ModalTypes :open="exportTypes" @close="exportTypes = false"></ModalTypes>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { state, supabaseClientState } from '../store'
  import { toPng } from 'html-to-image'
  import { useClipboard } from '@vueuse/core'
  import ModalTypes from './ModalTypes.vue'
  import AES from 'crypto-js/aes'

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

  const { copy, copied } = useClipboard()
  const shareLink = () => {
    const supabaseApikey = JSON.parse(
      localStorage.getItem('supabase-apikey') ?? ''
    )
    const view = JSON.parse(localStorage.getItem('view') ?? '')
    const tableList = JSON.parse(localStorage.getItem('table-list') ?? '')

    const encrypted = AES.encrypt(
      JSON.stringify({
        apikey: supabaseClientState.apikey,
        schemaView: state.schemaView,
        tables: state.tables,
      }),
      'this password doesnt matter'
    ).toString()

    const url = new URL(window.location.href)
    url.hash = encrypted
    copy(url.toString())
  }
</script>
