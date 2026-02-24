<script setup lang="ts">
import router from '@/router'
import { getTodo, removeTodo, todoExists, type Todo } from '@/todos'

interface Props {
  todoId: number
}

const props = defineProps<Props>()

if (!Number.isInteger(props.todoId)) {
  router.push('/')
}

if (!todoExists(props.todoId)) {
  router.push('/')
}

const todo: Todo = getTodo(props.todoId)!

async function onYes() {
  removeTodo(props.todoId)
  await router.push('/')
}
</script>

<template>
  <main class="container mx-auto py-4 text-center">
    <p class="mb-2">Are you sure you want to delete this todo?</p>

    <p class="font-semibold mb-3">"{{ todo.description }}"</p>

    <div class="flex justify-center gap-3">
      <RouterLink to="/" class="btn btn-outline"> No </RouterLink>

      <button @click="onYes" class="btn btn-error">Yes</button>
    </div>
  </main>
</template>
