<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  
    <input
      class="form-control w-50 text-center"
      type="text"
      placeholder="Search tasks..."
      :value="props.modelValue"
      @input="onInput"
    />

</template>
