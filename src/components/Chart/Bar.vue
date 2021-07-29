<template>
  <div class="w-full h-full p-8">
    <BarChart
      style="width: 100%; height: 100%"
      :options="options"
      :chartData="data"
    />
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
    CategoryScale,
    LinearScale,
    Title,
  } from 'chart.js'

  Chart.register(
    BarController,
    BarElement,
    Tooltip,
    CategoryScale,
    LinearScale,
    Title
  )

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
        maintainAspectRatio: false,
        devicePixelRatio: 2,
        plugins: {
          legend: {
            display: modelValue.value.customize.legendDisplay,
            position: modelValue.value.customize.legendPosition,
          },
          title: {
            display: true,
            padding: {
              top: 0,
              bottom: 20,
            },
            color: '#b4b4b4',
            font: {
              size: modelValue.value.customize.titleSize,
            },
            text: modelValue.value.customize.titleText,
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#b4b4b4',
              font: {
                size: 16,
              },
            },
          },
          y: {
            ticks: {
              color: '#b4b4b4',
              font: {
                size: 14,
              },
              precision: 0,
            },
          },
        },
      }))

      const data = computed<ChartData<'bar'>>(() => ({
        labels: modelValue.value.config.xLabel,
        datasets: [
          {
            data: modelValue.value.config.data,
            borderWidth: 1,
            borderColor: [modelValue.value.customize.borderColor],
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
