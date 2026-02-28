<script setup lang="ts">
import { dateToYYYYMMDD, randomColor } from '@/helper'
import {
  categoryManager,
  DEFAULT_CATEGORY,
  META_ADD_NEW_CATEGORY,
  type Category,
} from '@/schemas/category'
import { subtaskManager, type Subtask } from '@/schemas/subtask'
import type { Task } from '@/schemas/task'
import { computed, onMounted, ref, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'
import CategoryColor from './CategoryColor.vue'
import ConfirmationModal from './ConfirmationModal.vue'

interface Emits {
  (e: 'updateTask', task: Task, subtask: boolean): void
}

const emits = defineEmits<Emits>()

const task: Ref<Task | undefined> = ref(undefined)
const subtasks: Ref<Subtask[]> = ref([])

const dueDate = ref(new Date())

const categories: Ref<Category[]> = ref(categoryManager.all())
const selectedCategory = ref<number>(0)
const newCategoryName = ref('')
const newCategoryColor = ref(randomColor())
const currentCategory = computed(() => {
  return categoryManager.findBy('id', selectedCategory.value)!
})

const isAddingNewCategory = computed(() => selectedCategory.value === META_ADD_NEW_CATEGORY)

function onCategoryChange(val: number) {
  selectedCategory.value = val
  if (val !== META_ADD_NEW_CATEGORY) {
    newCategoryName.value = ''
    newCategoryColor.value = randomColor()
  }
}

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

  emits('updateTask', task.value, true)

  newSubtaskText.value = ''
}

function toggleSubtask(subtask: Subtask, completed: boolean) {
  if (!task.value) return

  subtaskManager.updateBy('id', subtask.id, {
    completed,
  })

  emits('updateTask', task.value, true)
}

function removeSubtask(subtask: Subtask) {
  if (!task.value) return

  subtaskManager.removeBy('id', subtask.id)

  subtasks.value = subtaskManager.filterBy('taskId', task.value.id)

  emits('updateTask', task.value, true)
}
const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: (t: Task) => {
    categories.value = categoryManager.all()
    task.value = t
    subtasks.value = subtaskManager.filterBy('taskId', task.value.id)
    dueDate.value = t.dueDate
    title.value = t.title.trim()
    checkTitle()
    newCategoryName.value = ''
    newCategoryColor.value = randomColor()
    modalRef.value!.showModal()
  },
  close: () => {
    modalRef.value!.close()
  },
})

const title: Ref<string> = ref('')
const titleErrorStr: Ref<string> = ref('')
const hadError = computed(() => titleErrorStr.value)

async function checkTitle() {
  titleErrorStr.value = ''

  const trimmed = title.value.trim()
  if (trimmed.length === 0) {
    titleErrorStr.value = 'Title can not be empty'
    return
  }
}

onMounted(() => {
  checkTitle()
})

const canConfirm = computed(() => {
  if (hadError.value) return false
  if (!title.value.trim()) return false
  if (isAddingNewCategory.value) {
    return newCategoryName.value.trim().length > 0
  }
  return true
})

function onConfirm(): void {
  if (!canConfirm.value) return

  let finalCategory: number = DEFAULT_CATEGORY

  if (isAddingNewCategory.value) {
    const newName = newCategoryName.value.trim()
    const exists = categoryManager.findBy('name', newName)
    if (!exists) {
      finalCategory = categoryManager.add({
        name: newName,
        color: newCategoryColor.value,
      })
    }
    selectedCategory.value = finalCategory
  } else {
    finalCategory = selectedCategory.value
  }

  emits(
    'updateTask',
    {
      ...task.value!,
      title: title.value,
      category: finalCategory,
      dueDate: dueDate.value,
    },
    true,
  )

  newCategoryName.value = ''
  newCategoryColor.value = randomColor()
}
</script>

<template>
  <ConfirmationModal
    ref="modalRef"
    title="Update Task"
    @confirm="onConfirm"
    :should-close="canConfirm"
    :positive="true"
  >
    <div class="container mx-auto pt-4 text-center">
      <div class="flex flex-col gap-4 sm:flex-row">
        <!-- Title -->
        <label class="w-full input">
          <span class="label">Title</span>
          <div class="flex justify-center">
            <input
              :class="{ 'input-error': titleErrorStr }"
              :placeholder="task?.title"
              @input="checkTitle"
              v-model="title"
            />
          </div>
        </label>

        <!-- Date -->
        <input
          type="date"
          :value="dateToYYYYMMDD(dueDate)"
          @input="dueDate = ($event.target as HTMLInputElement).valueAsDate ?? new Date()"
          class="input-bordered input w-full"
        />
      </div>
      <div :hidden="!titleErrorStr" class="text-error">Error: {{ titleErrorStr }}</div>

      <div class="mx-auto flex items-center gap-3 mt-6">
        <CategoryColor :category="currentCategory" />

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
      <div v-if="isAddingNewCategory" class="flex items-center gap-3 mt-6">
        <CategoryColor :color="newCategoryColor" />
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="New category name"
          class="input-bordered input w-full"
          @keyup.enter="onConfirm"
        />
      </div>

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
