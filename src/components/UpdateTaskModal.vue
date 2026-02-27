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
  const newSubtaskText = ref('')

function addSubtask() {
  if (!todo.value) return

  const text = newSubtaskText.value.trim()
  if (!text) return

  todo.value.subtasks = [
    ...(todo.value.subtasks ?? []),
    {
      id: crypto.randomUUID(),
      text,
      completed: false,
    },
  ]

  newSubtaskText.value = ''
}

function toggleSubtask(id: string, completed: boolean) {
  if (!todo.value) return

  todo.value.subtasks = (todo.value.subtasks ?? []).map(s =>
    s.id === id ? { ...s, completed } : s
  )
}

function removeSubtask(id: string) {
  if (!todo.value) return

  todo.value.subtasks = (todo.value.subtasks ?? []).filter(
    s => s.id !== id
  )
}
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
      
      <!-- Description -->
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
      <div :hidden="!descriptionErrorStr" class="text-error">
        Error: {{ descriptionErrorStr }}
      </div>

      <div class="mt-6 text-left">
        <div class="font-semibold mb-2">Subtasks</div>

        <div v-if="(todo?.subtasks ?? []).length" class="space-y-2">
          <div
            v-for="s in (todo?.subtasks ?? [])"
            :key="s.id"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              class="checkbox"
              :checked="s.completed"
              @change="toggleSubtask(s.id, ($event.target as HTMLInputElement).checked)"
            />

            <div class="flex-1" :class="{ 'line-through opacity-60': s.completed }">
              {{ s.text }}
            </div>

            <button
              type="button"
              class="btn btn-ghost btn-xs"
              @click="removeSubtask(s.id)"
            >
              Remove
            </button>
          </div>
        </div>

        <div class="flex gap-2 mt-3">
          <input
            v-model="newSubtaskText"
            class="input input-bordered w-full"
            placeholder="Add a subtask..."
            @keydown.enter.prevent="addSubtask"
          />
          <button
            type="button"
            class="btn btn-primary"
            @click="addSubtask"
          >
            Add
          </button>
        </div>
      </div>

    </div>

    <template #confirm> Update </template>
  </ConfirmationModal>
</template>
