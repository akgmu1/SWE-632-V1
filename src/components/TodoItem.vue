<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Todo } from '@/todos'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { HomeState } from '@/enums'

interface Emits {
  (e: 'toggle', id: number, completed: boolean): void
  (e: 'clicked', id: number): void
}

const emits = defineEmits<Emits>()

interface Props {
  todo: Todo
  homeState: HomeState
}

const props = defineProps<Props>()

const homeStateDelete = computed(() => props.homeState === HomeState.Delete)

function onChange(checked: boolean) {
  if (props.homeState == HomeState.Default) {
    props.todo.completed = checked
    emits('toggle', props.todo.id, props.todo.completed)
  }
}
</script>

<template>
  <div
    class="align-center flex gap-2 rounded p-2 py-1"
    :class="{
      'cursor-pointer hover:bg-error hover:text-error-content hover:shadow-error': homeStateDelete,
    }"
    @click="emits('clicked', props.todo.id)"
  >
    <input
      class="checkbox m-0"
      type="checkbox"
      :checked="props.todo.completed"
      @change="onChange(($event.target as HTMLInputElement).checked)"
    />

    <span :class="{ 'text-base-content/70 line-through': props.todo.completed }">
      Todo: {{ props.todo.description }}
    </span>

    <!-- <div class="tooltip ms-auto">
      <div class="tooltip-content">Settings</div>
      <RouterLink class="link" :to="`/update/${props.todo.id}`">
        <AdjustmentsHorizontalIcon class="size-6" />
      </RouterLink>
    </div> -->
  </div>
</template>
