<script setup lang="ts">
import { dateToYYYYMMDD, dateTrim } from '@/helper'
import { categoryManager, type Category } from '@/schemas/category'
import { taskManager, type Task } from '@/schemas/task'
import { timeEntryManager } from '@/schemas/timeEntry'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type ChartData,
  type TooltipCallbacks,
} from 'chart.js'
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import BaseModal from './BaseModal.vue'

const selectedDate: Ref<Date> = ref(dateTrim(new Date()))
const timeEntries = ref(
  timeEntryManager.filterBy((x) => {
    return dateToYYYYMMDD(x.date) === dateToYYYYMMDD(selectedDate.value)
  }),
)

const associatedTask = computed(() => {
  let result = new Map<number, Task>()
  for (const entry of timeEntries.value) {
    result.set(entry.id, taskManager.findBy('id', entry.taskId)!)
  }
  return result
})

const associatedCategories = computed(() => {
  let result = new Map<number, Category>()
  for (const [entry, task] of associatedTask.value) {
    result.set(entry, categoryManager.findBy('id', task.category)!)
  }
  return result
})

const totalMinutesPerCategory = computed(() => {
  let result = new Map<number, number>()

  for (const entry of timeEntries.value) {
    let category = associatedCategories.value.get(entry.id)!
    result.set(category.id, (result.get(category.id) ?? 0) + entry.minutes)
  }

  return result
})

const totalMinutes = computed(() => timeEntries.value.reduce((sum, e) => sum + e.minutes, 0))

const totalHoursLabel = computed(() => {
  if (!totalMinutes.value) return ''
  return `${(totalMinutes.value / 60).toFixed(1)}h`
})

const chartData: ComputedRef<ChartData<'doughnut'>> = computed(() => {
  return {
    labels: Array.from(totalMinutesPerCategory.value.keys()).map(
      (e) => categoryManager.findBy('id', e)!.name,
    ),
    datasets: [
      {
        label: 'My First Dataset',
        data: Array.from(totalMinutesPerCategory.value.values()),
        backgroundColor: Array.from(totalMinutesPerCategory.value.keys()).map(
          (e) => categoryManager.findBy('id', e)!.color,
        ),
        hoverOffset: 4,
      },
    ],
  }
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      onClick: () => {},
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed !== null) {
            label += context.parsed + ' minutes'
          }
          return label
        },
      } as TooltipCallbacks<'doughnut'>,
    },
  },
})

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: () => {
    timeEntries.value = timeEntryManager.filterBy((x) => {
      return dateToYYYYMMDD(x.date) === dateToYYYYMMDD(selectedDate.value)
    })

    modalRef.value!.showModal()
  },
  close: () => modalRef.value!.close(),
})
</script>

<template>
  <BaseModal ref="modalRef" title="Statistics">
    <div class="flex">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div v-for="e in timeEntries" :key="e.id" class="flex">
      <div></div>
    </div>
  </BaseModal>
</template>
