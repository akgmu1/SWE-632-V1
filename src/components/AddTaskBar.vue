<script setup lang="ts">
import { ref } from 'vue'
import { addTodo } from '@/todos'

const emit = defineEmits<{
  (e: 'added'): void
}>()

const taskText = ref('')

function onAdd() {
  const text = taskText.value.trim()
  if (!text) return

  addTodo(text)
  taskText.value = ''
  emit('added')
}
</script>

<template>
  <div class="join w-1/2">
    <input
      v-model="taskText"
      type="text"
      class="input w-full join-item"
      placeholder="Add a new task..."
      @keyup.enter="onAdd"
    />
    <button class="btn join-item" type="button" @click="onAdd">+</button>
  </div>
</template>
