<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Todo } from '@/todos'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/solid'

const emit = defineEmits<{
  (e: 'toggle', id: number, completed: boolean): void
}>()

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

function onChange(checked: boolean) {
  props.todo.completed = checked
  emit('toggle', props.todo.id, props.todo.completed)
}
</script>

<template>
  <div class="align-center flex gap-2 py-1">
    <input
      class="checkbox m-0"
      type="checkbox"
      :checked="props.todo.completed"
      @change="onChange(($event.target as HTMLInputElement).checked)"
    />

    <span :class="{ 'text-base-content/70 line-through': props.todo.completed }">
      Todo: {{ props.todo.description }}
    </span>

    <div class="tooltip ms-auto">
      <div class="tooltip-content">Settings</div>
      <RouterLink class="link" :to="`/update/${props.todo.id}`">
        <AdjustmentsHorizontalIcon class="size-6" />
      </RouterLink>
    </div>
  </div>
</template>
