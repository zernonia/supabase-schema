<template>
  <svg class="absolute z-10 opacity-50" :id="svg" width="0" height="0">
    <path
      ref="path"
      class="stroke-white fill-transparent"
      style="stroke-width: 3px; pointer-event: stroke"
    ></path>
    <circle :cx="fkPos.x" :cy="fkPos.y" r="5" class="stroke-white fill-current">
      fk
    </circle>
  </svg>
</template>

<script lang="ts">
  import { state } from '../store'

  import { computed, defineComponent, onMounted, ref, toRefs, watch } from 'vue'

  export default defineComponent({
    props: {
      svg: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
      target: {
        type: String,
        required: true,
      },
    },
    setup(prop) {
      const { svg, id, target } = toRefs(prop)

      onMounted(() => {
        drawSVG()
      })

      const tableName = computed(() => id.value.split('.')[0])
      const tableTargetName = computed(() => target.value.split('.')[0])
      const positionStart = computed(
        () => state.tables[`${tableName.value}`].position
      )
      const positionEnd = computed(
        () => state.tables[`${tableTargetName.value}`].position
      )

      const fkPos = ref({
        x: 0,
        y: 0,
      })

      watch(
        [positionStart, positionEnd],
        () => {
          drawSVG()
        },
        { deep: true }
      )

      const path = ref<SVGClipPathElement | null>(null)

      const drawSVG = () => {
        if (!path.value) return
        const svgElem = document.getElementById(svg.value) as HTMLElement
        const startElem = document.getElementById(id.value) as HTMLElement
        const endElem = document.getElementById(target.value) as HTMLElement

        const startTop = startElem.offsetTop
        const startHeight = startElem.offsetHeight
        const startLeft = startElem.offsetLeft
        const startRight = startElem.offsetWidth

        const endTop = endElem.offsetTop
        const endHeight = endElem.offsetHeight
        const endLeft = endElem.offsetLeft
        const endRight = endElem.offsetWidth

        const posStartY = positionStart.value.y + startTop + startHeight / 2
        const posEndY = positionEnd.value.y + endTop + endHeight / 2
        const posDiffY = posEndY - posStartY
        const posSvgY = posDiffY > 0 ? posStartY : posEndY

        let posStartX = positionStart.value.x + startLeft
        let posEndX = positionEnd.value.x + endLeft
        let posDiffX = posEndX - posStartX
        let posSvgX = posDiffX > 0 ? posStartX : posEndX

        if (
          posDiffX + endRight > 0 &&
          posDiffX + endRight < startRight + endRight
        ) {
          // draw
          posStartX = positionStart.value.x + startRight
          posEndX = positionEnd.value.x + endRight
          posDiffX = posEndX - posStartX
          posDiffX < 0 ? (posSvgX = posEndX) : (posSvgX = posStartX)

          path.value.setAttribute(
            'd',
            `M ${Math.abs(posStartX - posSvgX)} ${
              posDiffY > 0 ? 10 : Math.abs(posDiffY - 10)
            } H ${Math.abs(posDiffX) + 30} V ${
              posDiffY > 0 ? Math.abs(posDiffY) + 10 : 10
            } H ${Math.abs(posEndX - posSvgX)}`
          )
        } else if (posDiffX > 0) {
          posStartX = positionStart.value.x + startRight
          posEndX = endLeft + positionEnd.value.x
          posDiffX = posEndX - posStartX
          posSvgX = posStartX

          path.value.setAttribute(
            'd',
            `M ${Math.abs(posStartX - posSvgX)} ${
              posDiffY > 0 ? 10 : Math.abs(posDiffY - 10)
            } H ${Math.abs(posStartX - posSvgX + posDiffX / 2)} V ${
              posDiffY > 0 ? Math.abs(posDiffY) + 10 : 10
            } H ${Math.abs(posEndX - posSvgX)}`
          )
        } else {
          posStartX = positionStart.value.x + startLeft
          posEndX = endRight + positionEnd.value.x
          posDiffX = posEndX - posStartX
          posSvgX = posEndX
          path.value.setAttribute(
            'd',
            `M ${Math.abs(posStartX - posSvgX)} ${
              posDiffY > 0 ? 10 : Math.abs(posDiffY - 10)
            } H ${Math.abs(posStartX - posSvgX + posDiffX / 2)} V ${
              posDiffY > 0 ? Math.abs(posDiffY) + 10 : 10
            } H ${Math.abs(posEndX - posSvgX)}`
          )
        }

        svgElem.style.left = posSvgX + 'px'
        svgElem.style.top = posSvgY - 10 + 'px'
        svgElem.setAttribute('width', `${Math.abs(posDiffX) + 40}`)
        svgElem.setAttribute('height', `${Math.abs(posDiffY) + 20}`)

        fkPos.value.x = posEndX - posSvgX
        fkPos.value.y = posEndY - posSvgY + 10
      }

      return {
        path,
        fkPos,
      }
    },
  })
</script>

<style></style>
