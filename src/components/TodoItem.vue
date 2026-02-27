<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Todo } from '@/todos'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { HomeState } from '@/enums'

interface Emits {
  (e: 'toggle', id: number, completed: boolean): void
  (e: 'clicked', id: number, isDeleted: boolean): void
  (e: 'logTimeClicked', todo: Todo): void
}

const emits = defineEmits<Emits>()

interface Props {
  todo: Todo
  isDeleted: boolean
  homeState: HomeState
}

const props = defineProps<Props>()

const homeStateDefault = computed(() => props.homeState === HomeState.Default)
const homeStateDelete = computed(() => props.homeState === HomeState.Delete)
const homeStateUpdate = computed(() => props.homeState === HomeState.Update)


const categoryLabel = computed(() => props.todo.category?.trim() ?? '')

const dueLabel = computed(() => {
  const d = props.todo.dueDate
  if (!d) return ''

  // works best if dueDate is "YYYY-MM-DD" (from <input type="date">)
  const date = new Date(d + 'T00:00:00')
  if (Number.isNaN(date.getTime())) return d

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffMs = date.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due in 1 day'
  if (diffDays > 1) return `Due in ${diffDays} days`
  if (diffDays === -1) return 'Overdue by 1 day'
  return `Overdue by ${Math.abs(diffDays)} days`
})

const dueBadgeClass = computed(() => {
  if (!dueLabel.value) return ''
  if (dueLabel.value.startsWith('Overdue')) return 'badge-error'
  if (dueLabel.value === 'Due today') return 'badge-warning'
  return 'badge-ghost'
})

function onChange(checked: boolean) {
  if (props.homeState == HomeState.Default && !props.isDeleted) {
    props.todo.completed = checked
    emits('toggle', props.todo.id, props.todo.completed)
  }
}
function dueDiffDays(d?: string): number | null {
  if (!d) return null
  const date = new Date(d + 'T00:00:00')
  if (Number.isNaN(date.getTime())) return null

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffMs = date.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}
const dueClass = computed(() => {
  const diff = dueDiffDays(props.todo.dueDate)
  if (diff === null) return 'badge-ghost'
  if (diff < 0) return 'badge-error'
  if (diff === 0) return 'badge-warning'
  if (diff <= 7) return 'badge-info'
  return 'badge-ghost'
})
const totalMinutes = computed(() =>
  (props.todo.timeEntries ?? []).reduce((sum, e) => sum + e.minutes, 0),
)

const totalHoursLabel = computed(() => {
  if (!totalMinutes.value) return ''
  return `${(totalMinutes.value / 60).toFixed(1)}h`
})
</script>


<template>
  <div
    class="align-center flex items-center justify-between gap-3 rounded p-2 py-1"
    :class="{
      'cursor-pointer hover:bg-base-300 hover:shadow':
        (props.isDeleted && homeStateDefault) || (!props.isDeleted && homeStateUpdate),
      'cursor-pointer': !props.isDeleted && homeStateDefault,  // keep default clickable if you want
      'hover:bg-error hover:text-error-content hover:shadow hover:shadow-error':
        !props.isDeleted && homeStateDelete,
    }"
    @click="emits('clicked', props.todo.id, props.isDeleted)"
  >
    <!-- left -->
    <div class="flex min-w-0 items-center gap-3">
      <input
        class="checkbox m-0"
        :class="{ 'pointer-events-none': props.isDeleted || (!props.isDeleted && !homeStateDefault) }"
        type="checkbox"
        :checked="props.todo.completed"
        @change="onChange(($event.target as HTMLInputElement).checked)"
      />

      <!-- category color dot -->
      <div
        v-if="props.todo.categoryColor"
        class="h-4 w-4 shrink-0 rounded border"
        :style="{ backgroundColor: props.todo.categoryColor }"
      />

      <div class="min-w-0">
        <div class="truncate" :class="{ 'text-base-content/70 line-through': props.todo.completed }">
          Todo: {{ props.todo.description }}
          
        </div>

        <!-- second row: category + hours -->
        <div class="mt-1 flex flex-wrap items-center gap-2">
          <span v-if="categoryLabel" class="badge badge-outline">{{ categoryLabel }}</span>
          <span v-if="totalHoursLabel" class="badge badge-neutral">{{ totalHoursLabel }} worked</span>
            <button
  class="btn btn-ghost btn-xs"
  @click.stop="emits('logTimeClicked', props.todo)"
>
  Log time
</button>
        </div>
      </div>
    </div>

    <!-- right -->
    <div class="shrink-0">
      <span v-if="dueLabel" class="badge" :class="dueBadgeClass">{{ dueLabel }}</span>
    </div>
  </div>

</template>