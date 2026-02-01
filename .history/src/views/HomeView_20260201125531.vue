<script setup lang="ts">
import TodoItem from '@/components/TodoItem.vue';
import { getTodos, type Todo } from '@/todos';
import { ref, type Ref } from 'vue';

const todos: Ref<Todo[]> = ref(getTodos());

</script>

<template>
<main class="container py-4">
    <div class="mb-3">
      <h1 class="h3 mb-1">Task Manager</h1>
    </div>

    <!-- Use Case 5: Search -->

<div class="d-flex justify-content-center mb-4">
  <input
    type="text"
    class="form-control w-50 text-center"
    placeholder="Search tasks..."
  />
</div>


    <!-- Use Case 1: Add-->
    <div class="card mb-4">
      <div class="card-body">
        <label class="form-label fw-semibold">Add a new task</label>
        <input
          type="text"
          class="form-control"
          placeholder="Enter a new task"
        />
        <div class="form-text">Prototype: add task is not implemented yet.</div>
      </div>
    </div>

    <!-- Existing list -->
    <div class="d-flex align-items-center justify-content-between mb-2">
      <h2 class="h5 mb-0">Todos</h2>
      <span class="badge text-bg-secondary">{{ todos.length }}</span>
    </div>

    <div class="vstack gap-2">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo-id="todo.id" />
    </div>
  </main>
</template>
