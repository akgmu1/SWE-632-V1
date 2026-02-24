<script setup lang="ts">
import router from '@/router'
import { getTodo, todoExists, type Todo } from '@/todos'
import { computed, onMounted, ref, type Ref } from 'vue'

interface Props {
  todoId: number
}

const props = defineProps<Props>()

if (!Number.isInteger(props.todoId)) {
  router.push('/')
}

if (!todoExists(props.todoId)) {
  router.push('/')
}

const todo: Todo = getTodo(props.todoId)!

const description: Ref<string> = ref(todo.description)
const description_error_str: Ref<string> = ref('')
const has_description_error = computed(() => description_error_str.value.length !== 0)

async function checkDescription() {
  description_error_str.value = ''

  if (description.value.length === 0) {
    description_error_str.value = 'Description can not be empty'
    return
  }
}

onMounted(() => {
  checkDescription()
})

async function onUpdate() {
  checkDescription()
  if (has_description_error.value) {
    return
  }

  todo.description = description.value
  await router.push('/')
}
</script>

<template>
  <main>
    <div class="container mx-auto pt-4 text-center">
      <label class="input">
        <span class="label">Description</span>
        <div class="flex justify-center">
          <input
            class="w-50"
            :class="{ 'input-error': description_error_str }"
            :placeholder="todo.description"
            @input="checkDescription"
            @keyup.enter="onUpdate"
            v-model="description"
          />
        </div>
      </label>
      <div :hidden="!description_error_str" class="text-error">
        Error: {{ description_error_str }}
      </div>
      <div class="flex justify-center py-3">
        <RouterLink to="/" class="btn btn-outline"> Cancel </RouterLink>
        <button @click="onUpdate" class="btn btn-success mx-3">Update</button>
        <RouterLink :to="`/delete/${props.todoId}`" class="btn btn-error"> Delete </RouterLink>
      </div>
    </div>
  </main>
</template>
