<script setup lang="ts">
import TodoItem from '@/components/TodoItem.vue'
import SearchBar from '@/components/SearchBar.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref, type Ref } from 'vue'
import { TodoManager, type CreateTodo, type Todo } from '@/todos'
import { HomeState, ToolTipDirection } from '@/enums'
import {
  AdjustmentsVerticalIcon,
  Bars3Icon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'
import AddTaskModal from '@/components/AddTaskModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import UpdateTaskModal from '@/components/UpdateTaskModal.vue'
import ToolTip from '@/components/ToolTip.vue'
import LogTimeModal from '@/components/LogTimeModal.vue'

const logTimeModalRef: Ref<InstanceType<typeof LogTimeModal> | null> = ref(null)

function openLogTime(todo: Todo) {
  logTimeModalRef.value!.showModal(todo)
}

function logTime(updatedTodo: Todo) {
  TodoManager.updateTodo(updatedTodo)
  refreshTodos()
}
const homeState: Ref<HomeState> = ref(HomeState.Default)

const todos: Ref<Todo[]> = ref(TodoManager.getTodos())
const deletedTodos: Ref<Todo[]> = ref(TodoManager.getRecentlyDeletedTodos())

const q = computed(() => search.value.trim().toLowerCase())
const search = ref('')

const activeTodos = computed(() =>
  todos.value.filter(
    (t) => !t.completed && (!q.value || t.description.toLowerCase().includes(q.value)),
  ),
)

const completedTodos = computed(() =>
  todos.value.filter(
    (t) => t.completed && (!q.value || t.description.toLowerCase().includes(q.value)),
  ),
)

const filteredDeletedTodos = computed(() =>
  deletedTodos.value.filter((t) => !q.value || t.description.toLowerCase().includes(q.value)),
)

function refreshTodos() {
  todos.value = [...TodoManager.getTodos()]
  deletedTodos.value = [...TodoManager.getRecentlyDeletedTodos()]
}

function toggleTodo(id: number, completed: boolean) {
  const t = todos.value.find((x) => x.id === id)
  if (t) {
    t.completed = completed
    TodoManager.updateTodo({
      ...TodoManager.getTodo(id)!,
      completed,
    })
  }
}

const selectedTodo: Ref<Todo | undefined> = ref(undefined)

const confirmDeleteModalRef: Ref<InstanceType<typeof ConfirmationModal> | null> = ref(null)
function confirmDelete() {
  TodoManager.removeTodo(selectedTodo.value!.id)
  refreshTodos()
}

const confirmRecoverModalRef: Ref<InstanceType<typeof ConfirmationModal> | null> = ref(null)
function confirmRecover() {
  TodoManager.revertRecentlyDeletedTodo(selectedTodo.value!.id)
  refreshTodos()
}

const updateModalRef: Ref<InstanceType<typeof UpdateTaskModal> | null> = ref(null)
function updateTodo(todo: Todo) {
  TodoManager.updateTodo(todo)
  refreshTodos()
}

function todoClicked(id: number, isDeleted: boolean) {
  if (isDeleted) {
    switch (homeState.value) {
      case HomeState.Default: {
        selectedTodo.value = TodoManager.getRecentlyDeletedTodo(id)
        if (selectedTodo.value !== undefined) {
          confirmRecoverModalRef.value!.showModal()
        }
        break
      }
    }
  } else {
    switch (homeState.value) {
      case HomeState.Update: {
        homeState.value = HomeState.Default
        selectedTodo.value = TodoManager.getTodo(id)
        if (selectedTodo.value !== undefined) {
          updateModalRef.value!.showModal(selectedTodo.value)
        }
        break
      }
      case HomeState.Delete: {
        homeState.value = HomeState.Default
        selectedTodo.value = TodoManager.getTodo(id)
        if (selectedTodo.value !== undefined) {
          confirmDeleteModalRef.value!.showModal()
        }
        break
      }
    }
  }
}

const addTaskModalRef: Ref<InstanceType<typeof AddTaskModal> | null> = ref(null)

function addTodo(todo: CreateTodo) {
  TodoManager.createTodo(todo)
  refreshTodos()
}

function addButton() {
  addTaskModalRef.value!.showModal()
}

const confirmClearRecentlyDeleteModalRef: Ref<InstanceType<typeof ConfirmationModal> | null> =
  ref(null)
function clearRecentlyDeletedTodos() {
  TodoManager.clearRecentlyDeletedTodos()
  refreshTodos()
}
</script>

<template>
  <main class="container mx-auto py-4">
  <div class="mb-4 flex items-center justify-between">
  <div class="text-2xl font-semibold">To Do List</div>

  <div v-if="homeState == HomeState.Default" class="flex items-center gap-2">
    <button class="btn btn-circle btn-success" @click="addButton">
      <PlusIcon class="size-6" />
    </button>

    <button class="btn btn-circle" @click="homeState = HomeState.Update">
     <PencilSquareIcon class="size-6" />
    </button>

    <button class="btn btn-circle btn-error" @click="homeState = HomeState.Delete">
      <TrashIcon class="size-6" />
    </button>
  </div>

  <div v-else>
    <button class="btn btn-circle btn-error" @click="homeState = HomeState.Default">
      <XMarkIcon class="size-6" />
    </button>
  </div>
</div>
    <div class="mb-4 flex justify-center">
      <SearchBar v-model="search" />
    </div>
   

    <!-- List of todos working on -->
    <div class="text-xl">Active</div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in activeTodos"
        :key="todo.id"
        :todo="todo"
        :home-state="homeState"
        :is-deleted="false"
        @toggle="toggleTodo"
        @clicked="todoClicked"
        @logTimeClicked="openLogTime"
      />
    </div>

    <!-- List of completed todos -->
    <div class="mt-10 text-xl">Completed</div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in completedTodos"
        :key="todo.id"
        :todo="todo"
        :home-state="homeState"
        :is-deleted="false"
        @toggle="toggleTodo"
        @clicked="todoClicked"
      />
    </div>

    <!-- List of recently deleted todos -->
    <div class="mt-10 flex justify-between">
      <!-- TODO: mt-3 may not be correct here... -->
      <div class="text-xl" :class="{ 'mt-3': deletedTodos.length > 0 }">Recently Deleted</div>
      <button
        v-if="deletedTodos.length > 0"
        class="btn btn-accent"
        @click="confirmClearRecentlyDeleteModalRef!.showModal"
      >
        Clear
      </button>
    </div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in filteredDeletedTodos"
        :key="todo.id"
        :todo="todo"
        :home-state="homeState"
        :is-deleted="true"
        @clicked="todoClicked"
      />
    </div>

  

    <!-- Add a todo -->
    <AddTaskModal ref="addTaskModalRef" @add-todo="addTodo" />

    <!-- Update a todo -->
    <UpdateTaskModal ref="updateModalRef" @updateTodo="updateTodo" />

    <!-- Confirming to clear all recently deleted todos -->
    <ConfirmationModal
      ref="confirmClearRecentlyDeleteModalRef"
      title="Clear Recently Deleted"
      @confirm="clearRecentlyDeletedTodos"
    >
      Are you sure you want to clear the
      <span class="font-bold">{{ deletedTodos.length }}</span> recently deleted
      {{ deletedTodos.length == 1 ? 'todo' : 'todos' }}?
    </ConfirmationModal>

    <!-- Confirming to delete a todo -->
    <ConfirmationModal ref="confirmDeleteModalRef" title="Delete Todo" @confirm="confirmDelete">
      Are you sure you want to delete todo?
      <div class="pt-2 text-center font-bold">"{{ selectedTodo?.description }}"</div>
      <template #confirm> Delete </template>
    </ConfirmationModal>

    <!-- Confirming to recover a todo -->
    <ConfirmationModal ref="confirmRecoverModalRef" title="Recover Todo" @confirm="confirmRecover">
      Are you sure you want to recover todo?
      <div class="pt-2 text-center font-bold">"{{ selectedTodo?.description }}"</div>
      <template #confirm> Recover </template>
    </ConfirmationModal>
    <LogTimeModal ref="logTimeModalRef" @log-time="logTime" />
  </main>
</template>
