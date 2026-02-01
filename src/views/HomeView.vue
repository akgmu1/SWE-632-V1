<script setup lang="ts">
import AddTaskBar from '@/components/AddTaskBar.vue'
import TodoItem from '@/components/TodoItem.vue'
import SearchBar from '@/components/SearchBar.vue'

import { getTodos, type Todo } from '@/todos'
import { computed, ref, type Ref } from 'vue'

const todos: Ref<Todo[]> = ref(getTodos())

const q = computed(() => search.value.trim().toLowerCase())
const search = ref('')

const activeTodos = computed(() =>
  todos.value.filter(
    (t) => !t.completed && (!q.value || t.description.toLowerCase().includes(q.value)),
  ),
)

const completedTodos = computed(() =>
  todos.value.filter(
    (t) => t.completed && (!q.value || t.description.toLowerCase().includes(q.value)),
  ),
)

function refreshTodos() {
  todos.value = [...getTodos()]
}

function toggleTodo(id: number, completed: boolean) {
  const t = todos.value.find((x) => x.id === id)
  if (t) t.completed = completed
}
</script>

<template>
  <main class="container py-4">
    <div class="mb-3">
      <h1 class="h3 mb-1">To Do List</h1>
    </div>
    <div class="d-flex justify-content-center mb-4">
      <SearchBar v-model="search" />
    </div>
    <div class="d-flex justify-content-center mb-4">
      <AddTaskBar @added="refreshTodos" />
    </div>

    <h5 class="mt-3">Active</h5>
    <div class="vstack gap-2">
      <TodoItem v-for="todo in activeTodos" :key="todo.id" :todo="todo" @toggle="toggleTodo" />
    </div>

    <hr class="my-4" />

    <h5>Completed</h5>
    <div class="vstack gap-2">
      <TodoItem v-for="todo in completedTodos" :key="todo.id" :todo="todo" @toggle="toggleTodo" />
    </div>
  </main>
</template>
