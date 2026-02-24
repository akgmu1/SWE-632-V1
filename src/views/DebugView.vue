<script setup lang="ts">
import { TodoManager, type CreateTodo } from '@/todos'

function showToast() {
  const toast = document.getElementById('my-toast')!
  toast.classList.remove('hidden') // Show

  // Hide after 3 seconds (3000ms)
  setTimeout(() => {
    toast.classList.add('hidden')
  }, 3000)
}

function resetTodos() {
  TodoManager.reset()
  showToast()
}

function addTestTodos() {
  const TODOS: CreateTodo[] = [
    {
      description: 'Test 1',
      completed: false,
    },
    {
      description: 'Test 2',
      completed: true,
    },
    {
      description: 'Test 3',
      completed: false,
    },
  ]
  for (const todo of TODOS) {
    TodoManager.createTodo(todo)
  }
  showToast()
}
</script>

<template>
  <div class="container mx-auto flex flex-col gap-2 pt-4">
    <div>
      <RouterLink to="/" class="btn btn-primary">Go Back Home</RouterLink>
    </div>
    <div>
      <button @click="resetTodos" class="btn btn-primary">Reset todos</button>
    </div>
    <div>
      <button @click="addTestTodos" class="btn btn-primary">Add test todos</button>
    </div>
  </div>
  <div id="my-toast" class="toast toast-center toast-middle hidden">
    <div class="alert alert-info">
      <span>Done</span>
    </div>
  </div>
</template>
