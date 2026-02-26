<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Todo } from '@/todos'
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { HomeState } from '@/enums'

interface Emits {
  (e: 'clicked', id: number): void
}

const emits = defineEmits<Emits>()

interface Props {
  todo: Todo
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="align-center flex cursor-pointer gap-2 rounded p-2 py-1 hover:bg-base-300"
    @click="emits('clicked', props.todo.id)"
  >
    <input
      class="checkbox m-0 cursor-pointer"
      type="checkbox"
      disabled
      :checked="props.todo.completed"
    />

    <span :class="{ 'text-base-content/70 line-through': props.todo.completed }">
      Todo: {{ props.todo.description }}
    </span>
  </div>
</template>
