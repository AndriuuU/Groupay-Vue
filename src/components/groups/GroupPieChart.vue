<template>
  <div class="group-pie-chart">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  categoryData: {
    type: Array,
    required: true
  }
})

const rootStyles = getComputedStyle(document.documentElement)

const palette = [
  rootStyles.getPropertyValue('--primary-color').trim(),
  rootStyles.getPropertyValue('--primary-dark').trim(),
  rootStyles.getPropertyValue('--primary-light').trim(),
  rootStyles.getPropertyValue('--success-color').trim(),
  rootStyles.getPropertyValue('--error-color').trim(),
  rootStyles.getPropertyValue('--warning-color').trim(),
  rootStyles.getPropertyValue('--secondary-color').trim()
]

const chartData = computed(() => ({
  labels: props.categoryData.map(c => c.category),
  datasets: [
    {
      data: props.categoryData.map(c => c.value),
      backgroundColor: palette,
      borderColor: 'var(--white)',
      borderWidth: 2
    }
  ]
}))

const chartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
}
</script>

<style scoped>
.group-pie-chart {
  width: 100%;
  max-width: 350px;
  min-height: 300px;
  margin: 0 auto;
}
</style>
