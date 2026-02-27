<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import type { Task } from '@/schemas/task'
import type { CreateTimeEntry, TimeEntry } from '@/schemas/timeEntry'
import { dateToYYYYMMDD } from '@/helper'

interface Emits {
  (e: 'logTime', entry: CreateTimeEntry): void
}
const emits = defineEmits<Emits>()

const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)
const task: Ref<Task | undefined> = ref(undefined)

const minutes = ref<number>(30)

const selectedDate = ref<Date>(new Date())

const canSubmit = computed(() => minutes.value > 0 && !!task.value)

function onConfirm() {
  if (!task.value || minutes.value <= 0) return

  emits('logTime', {
    taskId: task.value.id,
    date: selectedDate.value,
    minutes: minutes.value,
    note: '',
  })

  // reset
  minutes.value = 30
  selectedDate.value = new Date()
  modalRef.value!.close()
}

defineExpose({
  showModal: (t: Task) => {
    task.value = t
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
        Task: <span class="font-semibold">{{ task?.description }}</span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <label class="form-control w-full">
          <div class="label"><span class="label-text">Minutes</span></div>
          <input
            v-model.number="minutes"
            type="number"
            min="1"
            class="input-bordered input w-full"
          />
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text">Date</span></div>
          <input
            type="date"
            :value="dateToYYYYMMDD(selectedDate)"
            @input="selectedDate = ($event.target as HTMLInputElement).valueAsDate ?? new Date()"
            class="input-bordered input w-full"
          />
        </label>
      </div>
    </div>

    <template #confirm> Save </template>
  </ConfirmationModal>
</template>
