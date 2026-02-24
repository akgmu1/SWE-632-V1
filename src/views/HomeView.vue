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
  <main class="container mx-auto py-4">
    <div class="mb-3 text-2xl">To Do List</div>
    <div class="flex justify-center mb-4">
      <SearchBar v-model="search" />
    </div>
    <div class="flex justify-center mb-4">
      <AddTaskBar @added="refreshTodos" />
    </div>

    <div class="text-xl">Active</div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem v-for="todo in activeTodos" :key="todo.id" :todo="todo" @toggle="toggleTodo" />
    </div>


    <div class="text-xl mt-10">Completed</div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem v-for="todo in completedTodos" :key="todo.id" :todo="todo" @toggle="toggleTodo" />
    </div>
  </main>
</template>
