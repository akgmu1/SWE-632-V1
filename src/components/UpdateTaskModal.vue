<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'
import type { CreateTodo, Todo } from '@/todos'
import { PlusIcon } from '@heroicons/vue/24/solid'
import ConfirmationModal from './ConfirmationModal.vue'

interface Emits {
  (e: 'updateTodo', todo: Todo): void
}

const emits = defineEmits<Emits>()

const todo: Ref<Todo | undefined> = ref(undefined)
const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: (t: Todo) => {
    todo.value = t
    description.value = t.description.trim()
    checkDescription()
    modalRef.value!.showModal()
  },
  close: () => {
    modalRef.value!.close()
  },
})

const description: Ref<string> = ref('')
const descriptionErrorStr: Ref<string> = ref('')
const hadError = computed(() => descriptionErrorStr.value)

async function checkDescription() {
  descriptionErrorStr.value = ''

  const trimmed = description.value.trim()
  if (trimmed.length === 0) {
    descriptionErrorStr.value = 'Description can not be empty'
    return
  }
}

onMounted(() => {
  checkDescription()
})

function onConfirm(): void {
  description.value = description.value.trim()
  checkDescription()
  if (descriptionErrorStr.value) {
    return
  }
  emits('updateTodo', {
    ...todo.value!,
    description: description.value,
  })
}
</script>

<template>
  <ConfirmationModal
    ref="modalRef"
    title="Update Task"
    @confirm="onConfirm"
    :should-close="!hadError"
    :positive="true"
  >
    <div class="container mx-auto pt-4 text-center">
      <label class="input">
        <span class="label">Description</span>
        <div class="flex justify-center">
          <input
            :class="{ 'input-error': descriptionErrorStr }"
            :placeholder="todo?.description"
            @input="checkDescription"
            v-model="description"
          />
        </div>
      </label>
      <div :hidden="!descriptionErrorStr" class="text-error">Error: {{ descriptionErrorStr }}</div>
    </div>
    <template #confirm> Update </template>
  </ConfirmationModal>
</template>
