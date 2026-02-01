<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Todo } from '@/todos'

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
  <div class="d-flex align-items-center gap-2 py-1">
    <input
      class="form-check-input m-0"
      type="checkbox"
      :checked="props.todo.completed"
      @change="onChange(($event.target as HTMLInputElement).checked)"
    />

    <span :class="{ 'text-decoration-line-through text-secondary': props.todo.completed }">
      Todo: {{ props.todo.description }}
    </span>

    <RouterLink class="ms-auto" :to="`/update/${props.todo.id}`">Update</RouterLink>
  </div>
</template>
