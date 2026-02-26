<script setup lang="ts">
import { ref, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'

interface Emits {
  (e: 'confirm'): void
}

const emits = defineEmits<Emits>()

interface Props {
  title: string
  shouldClose?: boolean
  positive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  shouldClose: true,
})

const modalRef: Ref<InstanceType<typeof BaseModal> | null> = ref(null)

defineExpose({
  showModal: () => {
    modalRef.value!.showModal()
  },
  close: () => {
    modalRef.value!.close()
  },
})

function onClick(confirm: boolean) {
  if (confirm) {
    emits('confirm')
    if (props.shouldClose) {
      modalRef.value!.close()
    }
  } else {
    modalRef.value!.close()
  }
}
</script>

<template>
  <BaseModal ref="modalRef" :title="props.title">
    <div class="pb-7">
      <slot />
    </div>
    <div class="flex justify-center">
      <button class="btn btn-outline" @click="onClick(false)">Cancel</button>
      <div class="px-4"></div>
      <button
        class="btn"
        :class="{ 'btn-success': props.positive, 'btn-error': !props.positive }"
        @click="onClick(true)"
      >
        <slot name="confirm"> Confirm </slot>
      </button>
    </div>
  </BaseModal>
</template>
