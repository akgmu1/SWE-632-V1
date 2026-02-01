<script setup lang="ts">
import router from '@/router';
import { getTodo, todoExists, type Todo } from '@/todos';

interface Props {
    todoId: number;
}

const props = defineProps<Props>();

if (!Number.isInteger(props.todoId)) {
    router.push("/");
}

if (!todoExists(props.todoId)) {
    router.push("/");
}

const todo: Todo = getTodo(props.todoId)!;

async function onYes() {
    await router.push("/");
}

</script>

<template>
  <main class="container py-4 text-center">
    <p class="mb-2">
      Are you sure you want to delete this todo?
    </p>

    <p class="fw-semibold mb-3">
      "{{ todo.description }}"
    </p>

    <div class="d-flex justify-content-center gap-3">
      <RouterLink to="/" class="btn btn-outline-secondary">
        No
      </RouterLink>

      <button @click="onYes" class="btn btn-danger">
        Yes
      </button>
    </div>

    <p class="text-muted mt-3 small">
      Prototype only – delete is not permanent.
    </p>
  </main>
</template>
