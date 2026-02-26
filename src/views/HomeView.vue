<script setup lang="ts">
import AddTaskBar from '@/components/AddTaskBar.vue'
import TodoItem from '@/components/TodoItem.vue'
import SearchBar from '@/components/SearchBar.vue'

import { computed, ref, type Ref } from 'vue'
import { TodoManager, type Todo } from '@/todos'
import { HomeState } from '@/enums'
import {
  AdjustmentsVerticalIcon,
  Bars3Icon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/solid'
import TodoDeletedItem from '@/components/TodoDeletedItem.vue'

const addModal: Ref<HTMLDialogElement | null> = ref(null)
const addInput: Ref<HTMLInputElement | null> = ref(null)

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

function todoClicked(id: number) {
  switch (homeState.value) {
    case HomeState.Delete: {
      homeState.value = HomeState.Default
      TodoManager.removeTodo(id)
      refreshTodos()
      break
    }
  }
}

function recentlyDeletedTodoClicked(id: number) {
  TodoManager.revertRecentlyDeletedTodo(id)
  refreshTodos()
}

const taskText = ref('')

function onAdd() {
  const text = taskText.value.trim()
  if (!text) return

  TodoManager.createTodo({
    description: text,
    completed: false,
  })
  taskText.value = ''
  refreshTodos()
  addModal.value!.close()
}

function addButton() {
  addModal.value!.showModal()
  addInput.value!.focus()
}

function clearRecentlyDeletedTodos() {
  TodoManager.clearRecentlyDeletedTodos()
  refreshTodos()
}
</script>

<template>
  <main class="container mx-auto py-4">
    <div class="mb-3 text-2xl">To Do List</div>
    <div class="mb-4 flex justify-center">
      <SearchBar v-model="search" />
    </div>
    <!-- <div class="mb-4 flex justify-center">
      <AddTaskBar @added="refreshTodos" />
    </div> -->

    <div class="text-xl">Active</div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in activeTodos"
        :key="todo.id"
        :todo="todo"
        :home-state="homeState"
        @toggle="toggleTodo"
        @clicked="todoClicked"
      />
    </div>

    <div class="mt-10 text-xl">Completed</div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoItem
        v-for="todo in completedTodos"
        :key="todo.id"
        :todo="todo"
        :home-state="homeState"
        @toggle="toggleTodo"
        @clicked="todoClicked"
      />
    </div>

    <div class="mt-10 flex justify-between">
      <!-- TODO: mt-3 may not be correct here... -->
      <div class="text-xl" :class="{ 'mt-3': deletedTodos.length > 0 }">Recently Deleted</div>
      <button
        v-if="deletedTodos.length > 0"
        class="btn btn-accent"
        @click="clearRecentlyDeletedTodos"
      >
        Clear
      </button>
    </div>
    <hr class="my-2" />
    <div class="flex flex-col gap-2">
      <TodoDeletedItem
        v-for="todo in filteredDeletedTodos"
        :key="todo.id"
        :todo="todo"
        :home-state="homeState"
        @clicked="recentlyDeletedTodoClicked"
      />
    </div>

    <div v-if="homeState == HomeState.Default" class="fab fixed right-6 bottom-6 z-50 fab-flower">
      <!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
      <div tabindex="0" role="button" class="btn btn-circle btn-lg btn-primary">
        <Bars3Icon class="size-6" />
      </div>

      <!-- Main Action button replaces the original button when FAB is open -->
      <div class="fab-close btn btn-circle btn-soft btn-lg btn-error">
        <XMarkIcon class="size-6" />
      </div>

      <!-- buttons that show up when FAB is open -->
      <button class="btn btn-circle btn-lg btn-success" @click="addButton">
        <PlusIcon class="size-6" />
      </button>
      <button class="btn btn-circle btn-lg">
        <AdjustmentsVerticalIcon class="size-6" />
      </button>
      <button class="btn btn-circle btn-lg btn-error" @click="homeState = HomeState.Delete">
        <TrashIcon class="size-6" />
      </button>
    </div>
    <div v-else>
      <div
        class="btn fixed right-6 bottom-6 z-50 btn-circle btn-lg btn-error"
        @click="homeState = HomeState.Default"
      >
        <XMarkIcon class="size-6" />
      </div>
    </div>

    <!-- TODO: Abstract this into generic modal component -->
    <dialog ref="addModal" class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
            <XMarkIcon class="size-6" />
          </button>
        </form>
        <h3 class="text-lg font-bold">Add Task</h3>
        <p class="py-4">Press ESC key or click outside to close</p>

        <div class="join w-full">
          <input
            ref="addInput"
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
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </main>
</template>
