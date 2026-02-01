<script setup lang="ts">
import TodoItem from '@/components/TodoItem.vue'
import { getTodos, type Todo } from '@/todos'
import { ref, type Ref } from 'vue'

const todos: Ref<Todo[]> = ref(getTodos())
</script>

<template>
  <main>
    Todos:
    <hr class="my-2" />
    <TodoItem v-for="todo in todos" :key="todo.id" :todo-id="todo.id" />
  </main>
</template>
