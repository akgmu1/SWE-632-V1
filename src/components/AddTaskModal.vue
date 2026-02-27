<script setup lang="ts">
import { DataManager } from '@/data'
import { dateToYYYYMMDD } from '@/helper'
import {
  categoryManager,
  DEFAULT_CATEGORY,
  META_ADD_NEW_CATEGORY,
  type Category,
} from '@/schemas/category'
import type { CreateTask } from '@/schemas/task'
import { computed, ref, type Ref } from 'vue'
import z from 'zod'
import ConfirmationModal from './ConfirmationModal.vue'

interface Emits {
  (e: 'addTask', task: CreateTask): void
}
const emits = defineEmits<Emits>()

const inputRef: Ref<HTMLInputElement | null> = ref(null)

const title = ref('')
const dueDate = ref(new Date())
const rememberOptions = ref(true)

const rememberedOptionsSchema = z.object({
  dueDate: z.coerce.date(),
  category: z.number(),
})

const rememberedOptions = new DataManager(rememberedOptionsSchema, 'add-task-remembered-options')

const categories = ref<Category[]>(categoryManager.all())
const selectedCategory = ref<number>(0)
const newCategoryName = ref('')

function loadRememberedOptions() {
  const x = rememberedOptions.load()
  if (x === undefined) {
    return
  }
  dueDate.value = x.dueDate
  selectedCategory.value = x.category
}

function saveRememberedOptions() {
  if (!rememberOptions.value) return
  rememberedOptions.save({
    dueDate: dueDate.value,
    category: selectedCategory.value, // TODO: Make sure not save META add
  })
}

const modalRef: Ref<InstanceType<typeof ConfirmationModal> | null> = ref(null)

defineExpose({
  showModal: () => {
    categories.value = categoryManager.all()
    selectedCategory.value = DEFAULT_CATEGORY
    newCategoryName.value = ''

    loadRememberedOptions()

    modalRef.value!.showModal()
    setTimeout(() => inputRef.value?.focus(), 0)
  },
  close: () => modalRef.value!.close(),
})

const isAddingNewCategory = computed(() => selectedCategory.value === META_ADD_NEW_CATEGORY)

function onCategoryChange(val: number) {
  selectedCategory.value = val
  console.log(selectedCategory.value, META_ADD_NEW_CATEGORY)
  if (val !== META_ADD_NEW_CATEGORY) {
    newCategoryName.value = ''
  }
}

const canConfirm = computed(() => {
  if (!title.value.trim()) return false
  if (isAddingNewCategory.value) {
    return newCategoryName.value.trim().length > 0
  }
  return true
})

function onConfirm() {
  if (!canConfirm.value) return

  let finalCategory: number = DEFAULT_CATEGORY

  if (isAddingNewCategory.value) {
    const newName = newCategoryName.value.trim()
    const exists = categoryManager.findBy('name', newName)
    if (!exists) {
      finalCategory = categoryManager.add({
        name: newName,
        color: '#FF0000', // TODO: RNG then Pick?
      })
    }
    selectedCategory.value = finalCategory
  } else {
    finalCategory = selectedCategory.value
  }

  const text = title.value.trim()

  emits('addTask', {
    description: text,
    completed: false,
    dueDate: dueDate.value,
    category: finalCategory,
  })

  saveRememberedOptions()

  title.value = ''

  if (!rememberOptions.value) {
    dueDate.value = new Date()
    selectedCategory.value = DEFAULT_CATEGORY
  }

  newCategoryName.value = ''
}
</script>

<template>
  <ConfirmationModal
    ref="modalRef"
    title="Create Task"
    @confirm="onConfirm"
    :should-close="canConfirm"
    :positive="true"
  >
    <div class="w-full">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4 sm:flex-row">
          <input
            ref="inputRef"
            v-model="title"
            type="text"
            placeholder="Title"
            class="input-bordered input w-full"
            @keyup.enter="onConfirm"
          />

          <input
            type="date"
            :value="dateToYYYYMMDD(dueDate)"
            @input="dueDate = ($event.target as HTMLInputElement).valueAsDate ?? new Date()"
            class="input-bordered input w-full"
          />
        </div>

        <div class="flex items-center gap-3">
          <div class="h-6 w-6 rounded border bg-sky-400"></div>

          <select
            class="select-bordered select w-full"
            :value="selectedCategory"
            @change="onCategoryChange(Number(($event.target as HTMLSelectElement).value))"
          >
            <option value="" disabled>Selected Category (optional)</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">
              <div v-if="c.id === META_ADD_NEW_CATEGORY">+ Add new category…</div>
              <div v-else>{{ c.name }}</div>
            </option>
          </select>
        </div>
        <div v-if="isAddingNewCategory" class="flex items-center gap-3">
          <div class="h-6 w-6 rounded border bg-amber-400"></div>
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="New category name"
            class="input-bordered input w-full"
            @keyup.enter="onConfirm"
          />
        </div>

        <!-- Remember Options -->
        <label class="flex cursor-pointer items-center gap-2">
          <input type="checkbox" class="checkbox" v-model="rememberOptions" />
          <span>Remember Options</span>
        </label>
      </div>
    </div>

    <template #confirm>Create</template>
  </ConfirmationModal>
</template>
