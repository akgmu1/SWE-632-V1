<script setup lang="ts">
import { ToolTipDirection } from '@/enums'
import { computed, useSlots, watch } from 'vue'

interface Props {
  tip?: string
  direction?: ToolTipDirection
}

const props = withDefaults(defineProps<Props>(), {
  direction: ToolTipDirection.Top,
})

const slots = useSlots()

const hasTipProps = computed(
  () => props.tip !== undefined && props.tip !== null && props.tip.trim().length > 0,
)
const hasTipSlot = computed(() => !!slots.tip)

enum ContentSource {
  Invalid,
  Prop,
  Slot,
}

const contentSource = computed(() => {
  if (hasTipProps.value) {
    return ContentSource.Prop
  } else if (hasTipSlot.value) {
    return ContentSource.Slot
  } else {
    return ContentSource.Invalid
  }
})

// Validation check to make sure not both
watch(
  contentSource,
  (newValue) => {
    if (newValue == ContentSource.Invalid) {
      console.error('[Vue]: Invalid usage: Must provide either the "tip" prop and the "tip" slot')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="tooltip"
    :class="{
      'tooltip-top': props.direction == ToolTipDirection.Top,
      'tooltip-left': props.direction == ToolTipDirection.Left,
    }"
  >
    <div class="tooltip-content">
      <div v-if="contentSource == ContentSource.Prop">
        {{ props.tip }}
      </div>
      <div v-else-if="contentSource == ContentSource.Slot">
        <slot name="tip" />
      </div>
    </div>
    <slot />
  </div>
</template>
