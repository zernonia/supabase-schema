<template>
  <div
    class="absolute"
    :class="[isConfigOpen || isDragging ? '!z-10000' : '']"
    :style="{
      top: positionY + 'px',
      left: positionX + 'px',
    }"
  >
    <div
      class="box rounded-md bg-dark-700 border border-dark-border hover:border-green-500"
      :class="[isConfigOpen ? 'border-green-500' : '']"
      @mousedown.prevent="dragStart"
      @click="clickVisual"
    >
      <div
        style="cursor: grab"
        :style="{
          width: state.visuals[id].size.width + 'px',
          height: state.visuals[id].size.height + 'px',
        }"
        class="text-white-800 flex flex-row justify-center items-center"
      >
        <component :is="currentChart" v-model="state.visuals[id].visual" />
      </div>
    </div>
    <div
      @mousedown.prevent="resizeStart"
      class="w-4 h-4 bg-green-500 absolute -right-0 -bottom-0"
      style="cursor: nw-resize"
    ></div>
    <div
      ref="elConfig"
      class="absolute top-0 left-full ml-4 !z-1000 !shadow-xl w-64 bg-dark-800 rounded-md rounded-tl-none z-20"
      style="filter: drop-shadow(rgba(0, 0, 0, 0.15) 5px 5px 5px)"
      v-if="isConfigOpen"
    >
      <div class="absolute -top-10 left-0 flex flex-row">
        <div
          @click="tab = 'chart'"
          class="py-3 px-6 rounded-md rounded-bl-none mr-2 bg-dark-800 cursor-pointer"
        >
          <i-uil:focus
            class="p-1px"
            :class="[tab == 'chart' ? 'opacity-100' : 'opacity-25']"
          ></i-uil:focus>
        </div>
        <div
          @click="tab = 'config'"
          class="py-3 px-6 rounded-md mr-2 bg-dark-800 cursor-pointer"
        >
          <i-mdi:focus-field-horizontal
            :class="[tab == 'config' ? 'opacity-100' : 'opacity-25']"
          ></i-mdi:focus-field-horizontal>
        </div>
        <div
          @click="tab = 'customize'"
          class="py-3 px-6 rounded-md bg-dark-800 cursor-pointer"
        >
          <i-line-md:paint-drop-half-twotone
            :class="[tab == 'customize' ? 'opacity-100' : 'opacity-25']"
          ></i-line-md:paint-drop-half-twotone>
        </div>
      </div>
      <div class="flex flex-col p-4 pb-8 max-h-84 overflow-y-scroll">
        <div id="icon-list" v-show="tab == 'chart'">
          <SelectChart v-model="state.visuals[id].type" value="card">
            <i-fluent:number-symbol-square-20-regular />
          </SelectChart>
          <SelectChart v-model="state.visuals[id].type" value="bar">
            <i-ant-design:bar-chart-outlined />
          </SelectChart>
          <SelectChart v-model="state.visuals[id].type" value="line">
            <i-ant-design:line-chart-outlined />
          </SelectChart>
          <SelectChart v-model="state.visuals[id].type" value="area">
            <i-ant-design:area-chart-outlined />
          </SelectChart>
          <SelectChart v-model="state.visuals[id].type" value="donut">
            <i-ant-design:pie-chart-twotone class="p-2px" />
          </SelectChart>
          <SelectChart v-model="state.visuals[id].type" value="table">
            <i-ant-design:table-outlined />
          </SelectChart>
        </div>
        <div v-show="tab == 'config'">
          <component
            :is="currentConfig"
            v-model="state.visuals[id].visual.config"
          />
        </div>
        <div v-show="tab == 'customize'">
          <component
            :is="currentCustomize"
            v-model="state.visuals[id].visual"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { onClickOutside, toRefs } from '@vueuse/core'
  import { computed, defineComponent, ref, watch } from 'vue'
  import { state } from '../store'

  import ChartCard from './Chart/Card.vue'
  import ChartBar from './Chart/Bar.vue'

  import ConfigCard from './Config/Card.vue'
  import ConfigBar from './Config/Bar.vue'

  import CustomizeCard from './Customize/Card.vue'
  import CustomizeBar from './Customize/Bar.vue'

  export default defineComponent({
    emits: ['visualDragging'],
    props: {
      scale: {
        type: Number,
        required: true,
      },
      mounted: Boolean,
      id: {
        type: String,
        required: true,
      },
    },
    components: {
      ChartCard,
      ChartBar,
      ConfigCard,
      ConfigBar,
      CustomizeCard,
      CustomizeBar,
    },
    setup(prop, { emit }) {
      const { scale, id } = toRefs(prop)
      const isDragging = ref(false)
      const ix = ref(0) //initial
      const iy = ref(0)
      const iwidth = ref(0) //initial
      const iheight = ref(0)

      // Dragging Event
      const positionX = computed(() => {
        return state.visuals[id.value].position.x
      })
      const positionY = computed(() => {
        return state.visuals[id.value].position.y
      })
      const sizeWidth = computed(() => {
        return state.visuals[id.value].size.width
      })
      const sizeHeight = computed(() => {
        return state.visuals[id.value].size.height
      })

      const dragStart = (e: MouseEvent) => {
        emit('visualDragging', true)
        isDragging.value = true
        ix.value = e.clientX - positionX.value * scale.value
        iy.value = e.clientY - positionY.value * scale.value
        document.onmousemove = dragEvent
        document.onmouseup = dragEnd
      }
      const dragEvent = (e: MouseEvent) => {
        if (!isDragging) return
        state.visuals[id.value].position = {
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

      // Resize Event
      const resizeStart = (e: MouseEvent) => {
        emit('visualDragging', true)
        isDragging.value = true
        iwidth.value = e.clientX - sizeWidth.value * scale.value
        iheight.value = e.clientY - sizeHeight.value * scale.value
        document.onmousemove = resizeEvent
        document.onmouseup = resizeEnd
      }
      const resizeEvent = (e: MouseEvent) => {
        if (!isDragging) return
        state.visuals[id.value].size = {
          width: (e.clientX - iwidth.value) / scale.value,
          height: (e.clientY - iheight.value) / scale.value,
        }
      }
      const resizeEnd = (e: MouseEvent) => {
        emit('visualDragging', false)
        isDragging.value = false
        document.onmousemove = null
        document.onmouseup = null
      }

      // tab
      const tab = ref('chart')
      // config
      const elConfig = ref(null)
      const isConfigOpen = ref(false)

      const currentChart = computed(() => {
        return 'chart-' + state.visuals[id.value]?.type
      })
      const currentConfig = computed(() => {
        return 'config-' + state.visuals[id.value]?.type
      })
      const currentCustomize = computed(() => {
        return 'customize-' + state.visuals[id.value]?.type
      })

      // click on Visual Event
      const clickVisual = () => {
        isConfigOpen.value = true
      }

      onClickOutside(elConfig, (e) => {
        isConfigOpen.value = false
      })

      watch(isConfigOpen, (n) => {
        if (n) {
          state.dashboardZoomable = false
          emit('visualDragging', true)
        } else {
          state.dashboardZoomable = true
          emit('visualDragging', false)
        }
      })

      return {
        state,
        isDragging,
        dragStart,
        dragEvent,
        dragEnd,

        resizeStart,

        positionX,
        positionY,

        tab,
        elConfig,
        isConfigOpen,
        currentChart,
        currentConfig,
        currentCustomize,

        clickVisual,
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
