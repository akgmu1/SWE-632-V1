<script setup lang="ts">
const model = defineModel<string>()

function onInput(e: Event) {
  model.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <input
    class="input w-1/2 text-center"
    type="text"
    placeholder="Search tasks..."
    :value="model"
    @input="onInput"
  />
</template>
