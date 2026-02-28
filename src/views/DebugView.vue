<script setup lang="ts">
import { DEFAULT_CATEGORY } from '@/schemas/category'
import { taskManager, type CreateTask } from '@/schemas/task'

function showToast() {
  const toast = document.getElementById('my-toast')!
  toast.classList.remove('hidden') // Show

  // Hide after 3 seconds (3000ms)
  setTimeout(() => {
    toast.classList.add('hidden')
  }, 3000)
}

function resetTasks() {
  taskManager.reset(true)
  showToast()
}

function addTestTasks() {
  const TASKS: CreateTask[] = [
    {
      title: 'Test 1',
      completed: false,
      category: DEFAULT_CATEGORY,
      dueDate: new Date(),
    },
    {
      title: 'Test 2',
      completed: true,
      category: DEFAULT_CATEGORY,
      dueDate: new Date(),
    },
    {
      title: 'Test 3',
      completed: false,
      category: DEFAULT_CATEGORY,
      dueDate: new Date(),
    },
  ]
  for (const task of TASKS) {
    taskManager.add(task)
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
      <button @click="resetTasks" class="btn btn-primary">Reset tasks</button>
    </div>
    <div>
      <button @click="addTestTasks" class="btn btn-primary">Add test tasks</button>
    </div>
  </div>
  <div id="my-toast" class="toast toast-center toast-middle hidden">
    <div class="alert alert-info">
      <span>Done</span>
    </div>
  </div>
</template>
