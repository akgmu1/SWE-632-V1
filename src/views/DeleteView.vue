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
    <main>
        <div>
            Are sure you want to delete this todo?
        </div>
        <RouterLink to="/">
            No
        </RouterLink>
        <br>
        <button @click="onYes" class="btn btn-link p-0">
            Yes
        </button>
    </main>
</template>
