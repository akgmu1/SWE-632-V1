<script setup lang="ts">
import { getTodo, getTodos, type Todo } from '@/todos'

interface Props {
  todoId: number
}

const props = defineProps<Props>()
const todo: Todo = getTodo(props.todoId) ?? { id: -1, description: 'Missing' }
</script>

<template>
  <div>
    Todo: {{ todo.description }}
    <RouterLink :to="`/update/${todo.id}`"> Update </RouterLink>
  </div>
</template>
