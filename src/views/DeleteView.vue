<script setup lang="ts">
import router from '@/router'
import { TodoManager, type Todo } from '@/todos'

interface Props {
  todoId: number
}

const props = defineProps<Props>()

if (!Number.isInteger(props.todoId)) {
  router.push('/')
}

if (!TodoManager.todoExists(props.todoId)) {
  router.push('/')
}

const todo: Todo = TodoManager.getTodo(props.todoId)!

async function onYes() {
  TodoManager.removeTodo(props.todoId)
  await router.push('/')
}
</script>

<template>
  <main class="container mx-auto py-4 text-center">
    <p class="mb-2">Are you sure you want to delete this todo?</p>

    <p class="mb-3 font-semibold">"{{ todo.description }}"</p>

    <div class="flex justify-center gap-3">
      <RouterLink to="/" class="btn btn-outline"> No </RouterLink>

      <button @click="onYes" class="btn btn-error">Yes</button>
    </div>
  </main>
</template>
