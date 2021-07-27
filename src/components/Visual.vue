<template>
  <div
    ref="el"
    class="absolute z-20 box rounded-md bg-dark-700 border border-dark-border hover:border-green-500"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    @mousedown.prevent="dragStart"
    @click="isConfigOpen = true"
  >
    <div
      style="cursor: grab"
      :style="{ width: size.width + 'px', height: size.height + 'px' }"
      class="text-white-800 flex flex-row justify-center items-center"
    >
      <ChartCard v-model="visualData"></ChartCard>
    </div>
  </div>
  <div
    ref="elConfig"
    class="absolute relative w-64 bg-dark-700 flex flex-col p-4 pb-8 rounded-md rounded-tl-none z-20"
    :style="{ top: position.y + 'px', left: position.x + width + 20 + 'px' }"
    v-if="isConfigOpen"
  >
    <div class="absolute -top-10 left-0 flex flex-row">
      <div
        @click="tab = 'chart'"
        class="py-3 px-6 rounded-md rounded-bl-none mr-2 bg-dark-700 cursor-pointer"
        :class="[tab == 'chart' ? 'opacity-100' : 'opacity-50']"
      >
        <i-uil:focus class="p-1px"></i-uil:focus>
      </div>
      <div
        @click="tab = 'config'"
        class="py-3 px-6 rounded-md mr-2 bg-dark-700 cursor-pointer"
        :class="[tab == 'config' ? 'opacity-100' : 'opacity-50']"
      >
        <i-mdi:focus-field-horizontal></i-mdi:focus-field-horizontal>
      </div>
      <div
        @click="tab = 'customize'"
        class="py-3 px-6 rounded-md bg-dark-700 cursor-pointer"
        :class="[tab == 'customize' ? 'opacity-100' : 'opacity-50']"
      >
        <i-line-md:paint-drop-half-twotone></i-line-md:paint-drop-half-twotone>
      </div>
    </div>
    <div id="icon-list" v-show="tab == 'chart'">
      <SelectChart v-model="graphType" value="card">
        <i-fluent:number-symbol-square-20-regular />
      </SelectChart>
      <SelectChart v-model="graphType" value="bar">
        <i-ant-design:bar-chart-outlined />
      </SelectChart>
      <SelectChart v-model="graphType" value="line">
        <i-ant-design:line-chart-outlined />
      </SelectChart>
      <SelectChart v-model="graphType" value="area">
        <i-ant-design:area-chart-outlined />
      </SelectChart>
      <SelectChart v-model="graphType" value="donut">
        <i-ant-design:pie-chart-twotone class="p-2px" />
      </SelectChart>
      <SelectChart v-model="graphType" value="table">
        <i-ant-design:table-outlined />
      </SelectChart>
    </div>
    <div v-show="tab == 'config'">
      <component :is="currentConfig" v-model="visualData.config" />
    </div>
    <div v-show="tab == 'customize'">
      <component :is="currentCustomize" v-model="visualData" />
    </div>
  </div>
</template>

<script lang="ts">
  import { onClickOutside, toRefs, useStorage } from '@vueuse/core'
  import { computed, defineComponent, ref } from 'vue'
  import { state } from '../store'
  import { useResizeObserver } from '@vueuse/core'

  import ConfigCard from './Config/Card.vue'

  import CustomizeCard from './Customize/Card.vue'

  export default defineComponent({
    emits: ['visualDragging'],
    props: {
      scale: {
        type: Number,
        required: true,
      },
      mounted: Boolean,
    },
    components: { ConfigCard, CustomizeCard },
    setup(prop, { emit }) {
      const { scale } = toRefs(prop)
      const isDragging = ref(false)
      const ix = ref(0) //initial
      const iy = ref(0)

      const position = ref({
        x: 0,
        y: 0,
      })

      const size = ref({
        width: 300,
        height: 300,
      })

      // Dragging Event
      const dragStart = (e: MouseEvent) => {
        emit('visualDragging', true)
        isDragging.value = true
        ix.value = e.clientX - position.value.x * scale.value
        iy.value = e.clientY - position.value.y * scale.value
        document.onmousemove = dragEvent
        document.onmouseup = dragEnd
      }
      const dragEvent = (e: MouseEvent) => {
        if (!isDragging) return
        position.value = {
          x: (e.clientX - ix.value) / scale.value,
          y: (e.clientY - iy.value) / scale.value,
        }
      }
      const dragEnd = (e: MouseEvent) => {
        emit('visualDragging', false)
        isDragging.value = false
        document.onmousemove = null
        document.onmouseup = null
      }

      // tab
      const tab = ref('chart')
      // graph
      const graphType = ref('card')
      // config
      const elConfig = ref(null)
      const isConfigOpen = ref(false)
      const visualData = useStorage('visual1', {
        config: {},
        customize: {},
      })
      const currentConfig = computed(() => {
        return 'config-' + graphType.value
      })
      const currentCustomize = computed(() => {
        return 'customize-' + graphType.value
      })

      onClickOutside(elConfig, (e) => {
        isConfigOpen.value = false
      })

      // form info
      const el = ref(null)
      const width = ref(0)
      useResizeObserver(el, (entries) => {
        const entry = entries[0]
        const rect = entry.contentRect
        width.value = rect.width
      })

      return {
        isDragging,
        dragStart,
        dragEvent,
        dragEnd,
        state,
        position,
        size,

        tab,
        elConfig,
        isConfigOpen,
        graphType,
        currentConfig,
        currentCustomize,

        el,
        width,
        visualData,
      }
    },
  })
</script>

<style lang="postcss">
  #icon-list {
    @apply grid grid-cols-4 place-items-center gap-2;
  }
  #icon-list > button {
    @apply w-full p-2 rounded-md flex justify-center opacity-50 hover:opacity-100 hover:bg-dark-600 focus:outline-none;
  }
  #icon-list > button > svg {
    @apply w-8 h-8 p-0.5;
  }
</style>
