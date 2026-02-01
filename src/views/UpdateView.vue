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
    <div class="container pt-4 text-center">
      <label for="floatingInputValue" class="form-label">Update Description</label>
      <div class="d-flex justify-content-center">
        <input
          id="floatingInputValue"
          class="form-control w-50"
          :class="{ 'is-invalid': description_error_str }"
          :placeholder="todo.description"
          @input="checkDescription"
          @keyup.enter="onUpdate"
          v-model="description"
        />
      </div>
      <div :hidden="!description_error_str" class="text-danger">
        Error: {{ description_error_str }}
      </div>
      <div class="d-flex justify-content-center py-3">
        <RouterLink to="/" class="btn btn-outline-secondary"> Cancel </RouterLink>
        <button @click="onUpdate" class="btn btn-success mx-3">Update</button>
        <RouterLink :to="`/delete/${props.todoId}`" class="btn btn-danger"> Delete </RouterLink>
      </div>
    </div>
  </main>
</template>
