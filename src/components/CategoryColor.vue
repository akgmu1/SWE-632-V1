<script setup lang="ts">
import { DEFAULT_CATEGORY, META_ADD_NEW_CATEGORY, type Category } from '@/schemas/category'
import { computed } from 'vue'

interface Props {
  category?: Category
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 6,
})

const cssVars = computed(() => {
  return {
    '--category-background': props.category?.color ?? props.color ?? '#f00',
    '--category-size': props.size,
  }
})
</script>

<template>
  <div
    :style="cssVars"
    class="rounded inline-block border shrink-0 w-[--spacing(var(--category-size))] h-[--spacing(var(--category-size))] bg-(--category-background)"
    :class="{
      // TODO: Scale with the size, stuck at current size, so stripes may not be good
      'bg-[repeating-linear-gradient(45deg,var(--color-olive-950)_0_3px,var(--color-zinc-500)_3px_6px)]':
        props.category?.id === DEFAULT_CATEGORY && props.size === 4,
      'bg-[repeating-linear-gradient(45deg,var(--color-olive-950)_0_6px,var(--color-zinc-500)_6px_12px)]':
        props.category?.id === DEFAULT_CATEGORY && props.size !== 4,
      'bg-[repeating-linear-gradient(45deg,var(--color-olive-950)_0_6px,var(--color-amber-400)_6px_12px)]':
        props.category?.id === META_ADD_NEW_CATEGORY,
    }"
  ></div>
</template>
