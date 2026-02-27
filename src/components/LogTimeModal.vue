<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import type { Todo } from '@/todos'
import BaseModal from './BaseModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'

interface Emits {
  (e: 'logTime', todo: Todo): void
}
const emits = defineEmits<Emits>()

const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)
const todo: Ref<Todo | undefined> = ref(undefined)

const minutes = ref<number>(30)

const date = ref<string>(new Date().toISOString().slice(0, 10)) // YYYY-MM-DD

const canSubmit = computed(() => minutes.value > 0 && !!todo.value)

function onConfirm() {
  if (!todo.value || minutes.value <= 0) return

  const updated: Todo = {
    ...todo.value,
    timeEntries: [
      { minutes: minutes.value, date: date.value },
      ...(todo.value.timeEntries ?? []),
    ],
  }

  emits('logTime', updated)

  // reset
  minutes.value = 30
  date.value = new Date().toISOString().slice(0, 10)
  modalRef.value!.close()
}

defineExpose({
  showModal: (t: Todo) => {
    todo.value = t
    modalRef.value!.showModal()
  },
  close: () => modalRef.value!.close(),
})
</script>

<template>
  <ConfirmationModal
    ref="modalRef"
    title="Log Time"
    @confirm="onConfirm"
    :should-close="canSubmit"
    :positive="true"
  >
    <div class="space-y-4">
      <div class="text-sm opacity-70">
        Task: <span class="font-semibold">{{ todo?.description }}</span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label class="form-control w-full">
          <div class="label"><span class="label-text">Minutes</span></div>
          <input v-model.number="minutes" type="number" min="1" class="input input-bordered w-full" />
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Date</span></div>
          <input v-model="date" type="date" class="input input-bordered w-full" />
        </label>
      </div>
    </div>

    <template #confirm> Save </template>
  </ConfirmationModal>
</template>