<template>
  <div>
    <BarChart :options="options" :chartData="data" />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, toRefs } from 'vue'
  import { BarChart } from 'vue-chart-3'
  import {
    Chart,
    Tooltip,
    ChartData,
    ChartOptions,
    BarElement,
    BarController,
  } from 'chart.js'

  Chart.register(BarController, BarElement, Tooltip)

  export default defineComponent({
    props: {
      modelValue: {
        type: Object,
        required: true,
      },
    },
    components: {
      BarChart,
    },
    setup(prop) {
      const { modelValue } = toRefs(prop)

      const options = computed<ChartOptions<'bar'>>(() => ({
        responsive: true,
        plugins: {
          legend: {
            display: modelValue.value.customize.legendDisplay,
            position: modelValue.value.customize.legendPosition,
          },
          title: {
            display: true,
            text: modelValue.value.customize.titleText,
          },
        },
      }))

      const data = computed<ChartData<'bar'>>(() => ({
        labels: modelValue.value.config.xLabel,
        datasets: [
          {
            data: modelValue.value.config.data,
          },
        ],
      }))

      return {
        options,
        data,
      }
    },
  })
</script>
