<script setup lang="ts">
import TodoItem from '@/components/TodoItem.vue'
import { getTodos, type Todo } from '@/todos'
import { computed, ref, type Ref } from 'vue'

const todos: Ref<Todo[]> = ref(getTodos())
const activeTodos = computed(() => todos.value.filter((t) => !t.completed))
const completedTodos = computed(() => todos.value.filter((t) => t.completed))

function toggleTodo(id: number, completed: boolean) {
  const t = todos.value.find((x) => x.id === id)
  if (t) t.completed = completed
}

</script>

<template>
<main class="container py-3">
  <h3 class="mb-2">Todos</h3>
  <hr class="my-2" />

  <h5 class="mt-3">Active</h5>
  <TodoItem v-for="todo in activeTodos" :key="todo.id" :todo="todo" @toggle="toggleTodo" />

  <hr class="my-3" />

  <h5>Completed</h5>
<TodoItem v-for="todo in completedTodos" :key="todo.id" :todo="todo" @toggle="toggleTodo" />
</main>
</template>
