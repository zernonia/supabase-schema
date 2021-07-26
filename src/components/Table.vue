<template>
  <div
    class="pb-2 absolute z-20 box rounded-md overflow-hidden bg-dark-700 border border-dark-border hover:border-green-500"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    style="cursor: grab"
    @mousedown.prevent="dragStart"
  >
    <h5
      class="py-2 pb-3 px-2 bg-dark-800 font-semibold text-lg text-center border-b border-dark-border"
    >
      {{ table?.title }}
    </h5>
    <div v-for="col in table?.columns" :key="col.title">
      <div
        class="py-1 px-4 flex items-center text-white-800 border-l-2 border-transparent hover:bg-dark-600 hover:text-white"
        :class="{ 'border-green-500': col.pk }"
        :id="`${table?.title}.${col.title}`"
      >
        <p class="flex-grow">
          {{ col.title }}
        </p>
        <p class="ml-8 flex-grow-0 text-sm text-white-900">
          {{ col.format }}
        </p>
      </div>
      <teleport v-if="mounted" to="#canvas-children">
        <Connector
          v-if="col.fk != undefined"
          :svg="`svg-${table?.title}.${col.title}`"
          :id="`${table?.title}.${col.title}`"
          :target="col.fk"
        ></Connector>
      </teleport>
    </div>
  </div>
</template>

<script lang="ts">
  import { toRefs } from '@vueuse/core'
  import { computed, defineComponent, onBeforeMount, PropType, ref } from 'vue'
  import { Table } from '../interface'
  import Connector from './Connector.vue'
  import { state } from '../store'

  export default defineComponent({
    components: {
      Connector,
    },
    props: {
      table: {
        type: Object as PropType<Table>,
        required: true,
      },
      scale: {
        type: Number,
        required: true,
      },
      mounted: Boolean,
    },
    emits: ['tableDragging'],
    setup(prop, { emit }) {
      const { scale, table } = toRefs(prop)
      const isDragging = ref(false)
      const ix = ref(0) //initial
      const iy = ref(0)

      const position = computed(
        () => state.tables[`${table.value.title}`].position
      ) // position
      const index = computed(() =>
        Object.keys(state.tables).findIndex(
          (item: any) => item == table.value.title
        )
      )
      // First mount
      onBeforeMount(() => {
        if (position.value.x == 0 && position.value.y == 0) {
          autoArrange()
        }
      })

      const autoArrange = () => {
        position.value.x = (index.value % 3) * 300 + 50
        position.value.y = Math.floor(index.value / 3) * 300 + 50
      }

      // Dragging Event
      const dragStart = (e: MouseEvent) => {
        emit('tableDragging', true)
        isDragging.value = true
        ix.value = e.clientX - position.value.x * scale.value
        iy.value = e.clientY - position.value.y * scale.value
        document.onmousemove = dragEvent
        document.onmouseup = dragEnd
      }
      const dragEvent = (e: MouseEvent) => {
        if (!isDragging) return
        state.tables[`${table.value.title}`].position = {
          x: (e.clientX - ix.value) / scale.value,
          y: (e.clientY - iy.value) / scale.value,
        }
      }
      const dragEnd = (e: MouseEvent) => {
        emit('tableDragging', false)
        isDragging.value = false
        document.onmousemove = null
        document.onmouseup = null
      }

      return {
        isDragging,
        dragStart,
        dragEvent,
        dragEnd,
        state,
        position,
      }
    },
  })
</script>

<style></style>
