<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const model = defineModel<string>()

function onInput(e: Event) {
  model.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <label class="input w-1/2">
    <MagnifyingGlassIcon class="h-[1em] opacity-50" />
    <input type="search" placeholder="Search tasks..." :value="model" @input="onInput" />
  </label>
</template>
