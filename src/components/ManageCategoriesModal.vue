<script setup lang="ts">
import { randomColor } from '@/helper'
import {
  categoryManager,
  DEFAULT_CATEGORY,
  PERM_CATEGORIES,
  type Category,
} from '@/schemas/category'
import { taskManager } from '@/schemas/task'
import { PencilIcon } from '@heroicons/vue/24/outline'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { computed, ref, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'
import CategoryColor from './CategoryColor.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import ToolTip from './ToolTip.vue'

interface Emits {
  (e: 'updateCategory', category: Category): void
  (e: 'deleteCategory', category: Category): void
}

function deleteCategory() {
  if (selectedCategory.value === null) {
    return
  }

  emits('deleteCategory', selectedCategory.value)
  categories.value = categoryManager.all()
  if (categories.value.length === PERM_CATEGORIES.length) {
    modalRef.value!.close()
  }
}

function updateCategory() {
  if (selectedCategory.value === null) {
    return
  }

  emits('updateCategory', {
    ...selectedCategory.value,
    name: name.value,
    color: color.value,
  })
  categories.value = categoryManager.all()
}

const emits = defineEmits<Emits>()

const categories: Ref<Category[]> = ref([])
const selectedCategory: Ref<Category | null> = ref(null)
const selectedCategoryTasks = computed(() => {
  return taskManager.filterBy('category', selectedCategory.value?.id ?? DEFAULT_CATEGORY)
})

const defaultCategory = computed(() => categoryManager.findBy('id', DEFAULT_CATEGORY))

const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: () => {
    categories.value = categoryManager.all()
    modalRef.value!.showModal()
  },
  close: () => modalRef.value!.close(),
})

const deleteModalRef: Ref<InstanceType<typeof ConfirmationModal> | null> = ref(null)
const updateModalRef: Ref<InstanceType<typeof ConfirmationModal> | null> = ref(null)
const name = ref('')
const color = ref('')

const canConfirm = computed(() => name.value.trim().length > 0)
</script>

<template>
  <BaseModal ref="modalRef" title="Manage Categories">
    <div class="flex flex-col gap-2">
      <div v-for="c in categories" :key="c.id">
        <div v-if="!PERM_CATEGORIES.some((x) => x === c.id)" class="flex justify-between">
          <div class="flex gap-2 align-middle">
            <CategoryColor :category="c" />
            <div>
              {{ c.name }}
            </div>
            <ToolTip tip="Update">
              <button
                class="btn btn-primary btn-xs"
                @click="
                  () => {
                    selectedCategory = c
                    name = c.name
                    color = c.color
                    updateModalRef?.showModal()
                  }
                "
              >
                <PencilIcon class="size-4" />
              </button>
            </ToolTip>
          </div>
          <ToolTip tip="Delete">
            <button
              class="btn btn-error btn-xs"
              @click="
                () => {
                  selectedCategory = c
                  deleteModalRef?.showModal()
                }
              "
            >
              <TrashIcon class="size-4" />
            </button>
          </ToolTip>
        </div>
      </div>
    </div>

    <ConfirmationModal
      ref="updateModalRef"
      title="Update Category"
      @confirm="updateCategory"
      :should-close="canConfirm"
      :positive="true"
    >
      <label class="w-full input">
        <span class="label">Name</span>
        <div class="flex justify-center">
          <input :placeholder="selectedCategory?.name" v-model="name" />
        </div>
      </label>
      <div class="pt-2 flex gap-3">
        <div>Click to the color to change it</div>
        <div>
          <ToolTip tip="Change Color">
            <button
              @click="
                () => {
                  color = randomColor()
                }
              "
              class="cursor-pointer"
            >
              <CategoryColor :color="color" :size="6" />
            </button>
          </ToolTip>
        </div>
      </div>

      <template #confirm> Update </template>
    </ConfirmationModal>

    <!-- Delete Category -->
    <ConfirmationModal ref="deleteModalRef" title="Delete Category" @confirm="deleteCategory">
      <div>Are you sure you want to delete category?</div>
      <div class="pt-4 text-center font-bold">"{{ selectedCategory?.name }}"</div>
      <div class="pt-6">
        It is currently used by
        <span class="font-bold">{{ selectedCategoryTasks.length }}</span>
        {{ selectedCategoryTasks.length == 1 ? 'task' : 'tasks' }}. Doing so will make them go back
        to the <CategoryColor :category="defaultCategory" :size="4" /> default category.
      </div>

      <template #confirm> Delete </template>
    </ConfirmationModal>
  </BaseModal>
</template>
