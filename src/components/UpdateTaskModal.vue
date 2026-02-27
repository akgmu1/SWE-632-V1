<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'
import { PlusIcon } from '@heroicons/vue/24/solid'
import ConfirmationModal from './ConfirmationModal.vue'
import type { Task } from '@/schemas/task'
import { subtaskManager, type Subtask } from '@/schemas/subtask'

interface Emits {
  (e: 'updateTask', task: Task): void
}

const emits = defineEmits<Emits>()

const task: Ref<Task | undefined> = ref(undefined)
const subtasks: Ref<Subtask[]> = ref([])

const newSubtaskText = ref('')

function addSubtask() {
  if (!task.value) return

  const text = newSubtaskText.value.trim()
  if (!text) return

  subtaskManager.add({
    taskId: task.value.id,
    completed: false,
    text,
  })

  subtasks.value = subtaskManager.filterBy('taskId', task.value.id)

  newSubtaskText.value = ''
}

function toggleSubtask(subtask: Subtask, completed: boolean) {
  if (!task.value) return

  subtaskManager.updateBy('id', subtask.id, {
    completed,
  })
}

function removeSubtask(subtask: Subtask) {
  if (!task.value) return

  subtaskManager.removeBy('id', subtask.id)
}
const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: (t: Task) => {
    task.value = t
    subtasks.value = subtaskManager.filterBy('taskId', task.value.id)
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
  emits('updateTask', {
    ...task.value!,
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
            :placeholder="task?.description"
            @input="checkDescription"
            v-model="description"
          />
        </div>
      </label>
      <div :hidden="!descriptionErrorStr" class="text-error">Error: {{ descriptionErrorStr }}</div>

      <div class="mt-6 text-left">
        <div class="mb-2 font-semibold">Subtasks</div>

        <div v-if="subtasks.length" class="space-y-2">
          <div v-for="s in subtasks" :key="s.id" class="flex items-center gap-2">
            <input
              type="checkbox"
              class="checkbox"
              :checked="s.completed"
              @change="toggleSubtask(s, ($event.target as HTMLInputElement).checked)"
            />

            <div class="flex-1" :class="{ 'line-through opacity-60': s.completed }">
              {{ s.text }}
            </div>

            <button type="button" class="btn btn-ghost btn-xs" @click="removeSubtask(s)">
              Remove
            </button>
          </div>
        </div>

        <div class="mt-3 flex gap-2">
          <input
            v-model="newSubtaskText"
            class="input-bordered input w-full"
            placeholder="Add a subtask..."
            @keydown.enter.prevent="addSubtask"
          />
          <button type="button" class="btn btn-primary" @click="addSubtask">Add</button>
        </div>
      </div>
    </div>

    <template #confirm> Update </template>
  </ConfirmationModal>
</template>
