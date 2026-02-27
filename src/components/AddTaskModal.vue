<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import type { CreateTodo } from '@/todos'
import ConfirmationModal from './ConfirmationModal.vue'

interface Emits {
  (e: 'addTodo', todo: CreateTodo): void
}
const emits = defineEmits<Emits>()

const inputRef: Ref<HTMLInputElement | null> = ref(null)

const title = ref('')
const dueDate = ref('') 
const rememberOptions = ref(true)


type CategoryOption = { name: string }
const CATEGORIES_KEY = 'todo-categories'
const CREATE_OPTIONS_KEY = 'todo-create-options'
const ADD_NEW_VALUE = '__ADD_NEW__'

const categories = ref<CategoryOption[]>([])
const selectedCategory = ref<string>('') 
const newCategoryName = ref('')

function loadCategories() {

  const defaults: CategoryOption[] = [
    { name: 'Work' },
    { name: 'Personal' },
    { name: 'School' },
    { name: 'Home' },
    { name: 'Fitness' },
    { name: 'Other' },
  ]

  try {
    const raw = localStorage.getItem(CATEGORIES_KEY)
    if (!raw) {
      categories.value = defaults
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaults))
      return
    }

    const parsed = JSON.parse(raw) as CategoryOption[]
    categories.value = Array.isArray(parsed) && parsed.length ? parsed : defaults
  } catch {
    categories.value = defaults
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaults))
  }
}

function saveCategories() {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories.value))
}

function loadRememberedOptions() {
  try {
    const raw = localStorage.getItem(CREATE_OPTIONS_KEY)
    if (!raw) return
    const obj = JSON.parse(raw) as { dueDate?: string; category?: string }

    if (obj.dueDate) dueDate.value = obj.dueDate
    if (obj.category) selectedCategory.value = obj.category
  } catch {
   
  }
}

function saveRememberedOptions() {
  if (!rememberOptions.value) return
  localStorage.setItem(
    CREATE_OPTIONS_KEY,
    JSON.stringify({
      dueDate: dueDate.value || undefined,
      category:
        selectedCategory.value && selectedCategory.value !== ADD_NEW_VALUE
          ? selectedCategory.value
          : undefined,
    }),
  )
}

const modalRef: Ref<InstanceType<typeof ConfirmationModal> | null> = ref(null)

defineExpose({
  showModal: () => {
    loadCategories()
    loadRememberedOptions()

    
    newCategoryName.value = ''
    if (!selectedCategory.value) selectedCategory.value = '' //reset placeholder

    modalRef.value!.showModal()
    setTimeout(() => inputRef.value?.focus(), 0)
  },
  close: () => modalRef.value!.close(),
})


const isAddingNewCategory = computed(() => selectedCategory.value === ADD_NEW_VALUE)

function onCategoryChange(val: string) {
  selectedCategory.value = val
  if (val !== ADD_NEW_VALUE) {
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

  let finalCategory: string | undefined = undefined

  if (isAddingNewCategory.value) {
    const newName = newCategoryName.value.trim()
    const exists = categories.value.some((c) => c.name.toLowerCase() === newName.toLowerCase())
    if (!exists) {
      categories.value.push({ name: newName })
      saveCategories()
    }
    finalCategory = newName
    selectedCategory.value = newName
  } else if (selectedCategory.value) {
    finalCategory = selectedCategory.value
  }

  const text = title.value.trim()

  emits('addTodo', {
    description: text,
    completed: false,
    dueDate: dueDate.value || undefined,
    category: finalCategory,
  })

  saveRememberedOptions()

  title.value = ''
  if (!rememberOptions.value) {
    dueDate.value = ''
    selectedCategory.value = ''
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
        <div class="flex flex-col sm:flex-row gap-4">
          <input
            ref="inputRef"
            v-model="title"
            type="text"
            placeholder="Title"
            class="input input-bordered w-full"
            @keyup.enter="onConfirm"
          />

          <input
            v-model="dueDate"
            type="date"
            class="input input-bordered w-full"
          />
        </div>

        <div class="flex items-center gap-3">
          <div class="w-6 h-6 rounded border bg-sky-400"></div>

          <select
            class="select select-bordered w-full"
            :value="selectedCategory"
            @change="onCategoryChange(($event.target as HTMLSelectElement).value)"
          >
            <option value="" disabled>Selected Category (optional)</option>
            <option v-for="c in categories" :key="c.name" :value="c.name">
              {{ c.name }}
            </option>
            <option :value="ADD_NEW_VALUE">+ Add new category…</option>
          </select>
        </div>
        <div v-if="isAddingNewCategory" class="flex items-center gap-3">
          <div class="w-6 h-6 rounded border bg-amber-400"></div>
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="New category name"
            class="input input-bordered w-full"
            @keyup.enter="onConfirm"
          />
        </div>

        <!-- Remember Options -->
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="checkbox" v-model="rememberOptions" />
          <span>Remember Options</span>
        </label>

      </div>
    </div>

    <template #confirm>Create</template>
  </ConfirmationModal>
</template>