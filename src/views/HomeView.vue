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

const homeState: Ref<HomeState> = ref(HomeState.Default)

const todos: Ref<Todo[]> = ref(TodoManager.getTodos())

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

function refreshTodos() {
  todos.value = [...TodoManager.getTodos()]
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
  console.log(id)
}
</script>

<template>
  <main class="container mx-auto py-4">
    <div class="mb-3 text-2xl">To Do List</div>
    <div class="mb-4 flex justify-center">
      <SearchBar v-model="search" />
    </div>
    <div class="mb-4 flex justify-center">
      <AddTaskBar @added="refreshTodos" />
    </div>

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
      <button class="btn btn-circle btn-lg btn-success">
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
  </main>
</template>
