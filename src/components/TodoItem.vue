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

function onChange(checked: boolean) {
  if (props.homeState == HomeState.Default && !props.isDeleted) {
    props.todo.completed = checked
    emits('toggle', props.todo.id, props.todo.completed)
  }
}
</script>

<template>
  <div
    class="align-center flex gap-2 rounded p-2 py-1"
    :class="{
      'cursor-pointer hover:bg-base-300 hover:shadow':
        (props.isDeleted && homeStateDefault) || (!props.isDeleted && homeStateUpdate),
      'cursor-pointer': !props.isDeleted && !homeStateDefault,
      'hover:bg-error hover:text-error-content hover:shadow hover:shadow-error':
        !props.isDeleted && homeStateDelete,
    }"
    @click="emits('clicked', props.todo.id, props.isDeleted)"
  >
    <input
      class="checkbox m-0"
      :class="{ 'pointer-events-none': props.isDeleted || (!props.isDeleted && !homeStateDefault) }"
      type="checkbox"
      :checked="props.todo.completed"
      @change="onChange(($event.target as HTMLInputElement).checked)"
    />

    <span :class="{ 'text-base-content/70 line-through': props.todo.completed }">
      Todo: {{ props.todo.description }}
    </span>
  </div>
</template>
