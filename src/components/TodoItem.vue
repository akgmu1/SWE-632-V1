<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Todo } from '@/todos'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { HomeState } from '@/enums'

interface Emits {
  (e: 'toggle', id: number, completed: boolean): void
  (e: 'clicked', id: number, isDeleted: boolean): void
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
</script>


<template>
  <div
    class="align-center flex items-center justify-between gap-3 rounded p-2 py-1"
    :class="{
      'cursor-pointer hover:bg-base-300 hover:shadow':
        (props.isDeleted && homeStateDefault) || (!props.isDeleted && homeStateUpdate),
      'cursor-pointer': !props.isDeleted && !homeStateDefault,
      'hover:bg-error hover:text-error-content hover:shadow hover:shadow-error':
        !props.isDeleted && homeStateDelete,
    }"
    @click="emits('clicked', props.todo.id, props.isDeleted)"
  >
    <!-- left -->
    <div class="flex items-center gap-3 min-w-0">
      <input
        class="checkbox m-0"
        :class="{ 'pointer-events-none': props.isDeleted || (!props.isDeleted && !homeStateDefault) }"
        type="checkbox"
        :checked="props.todo.completed"
        @change="onChange(($event.target as HTMLInputElement).checked)"
      />

      <div class="min-w-0">
        <div class="truncate" :class="{ 'text-base-content/70 line-through': props.todo.completed }">
          Todo: {{ props.todo.description }}
        </div>

        <div v-if="categoryLabel" class="mt-1">
          <span class="badge badge-outline">{{ categoryLabel }}</span>
        </div>
      </div>
    </div>

    <!-- right -->
    <div class="shrink-0">
      <span v-if="dueLabel" class="badge" :class="dueBadgeClass">{{ dueLabel }}</span>
    </div>
  </div>
</template>