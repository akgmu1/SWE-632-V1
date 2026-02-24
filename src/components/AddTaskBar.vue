<script setup lang="ts">
import { TodoManager } from '@/todos'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'added'): void
}>()

const taskText = ref('')

function onAdd() {
  const text = taskText.value.trim()
  if (!text) return

  TodoManager.createTodo({
    description: text,
    completed: false,
  })
  taskText.value = ''
  emit('added')
}
</script>

<template>
  <div class="join w-1/2">
    <input
      v-model="taskText"
      type="text"
      class="input join-item w-full"
      placeholder="Add a new task..."
      @keyup.enter="onAdd"
    />
    <button class="btn join-item" type="button" @click="onAdd">+</button>
  </div>
</template>
