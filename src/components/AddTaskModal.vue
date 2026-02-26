<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'
import type { CreateTodo } from '@/todos'
import { PlusIcon } from '@heroicons/vue/24/solid'
import ConfirmationModal from './ConfirmationModal.vue'

interface Emits {
  (e: 'addTodo', todo: CreateTodo): void
}

const emits = defineEmits<Emits>()

const inputRef: Ref<HTMLInputElement | null> = ref(null)
const taskText = ref('')

function onConfirm(): void {
  const text = taskText.value.trim()
  if (!text) return

  emits('addTodo', {
    description: text,
    completed: false,
  })

  taskText.value = ''
}

function onAdd() {
  const text = taskText.value.trim()
  if (!text) return

  emits('addTodo', {
    description: text,
    completed: false,
  })

  taskText.value = ''
  modalRef.value!.close()
}

const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: () => {
    modalRef.value!.showModal()
    inputRef.value!.focus()
  },
  close: () => {
    modalRef.value!.close()
  },
})
</script>

<template>
  <ConfirmationModal
    ref="modalRef"
    title="Add Task"
    @confirm="onConfirm"
    :should-close="taskText.trim().length > 0"
    :positive="true"
  >
    <div class="join w-full">
      <input
        ref="inputRef"
        v-model="taskText"
        type="text"
        class="input join-item w-full"
        placeholder="Add a new task..."
        @keyup.enter="onAdd"
      />
      <button class="btn join-item" type="button" @click="onAdd">
        <PlusIcon class="size-4" />
      </button>
    </div>
    <template #confirm> Add </template>
  </ConfirmationModal>
</template>
