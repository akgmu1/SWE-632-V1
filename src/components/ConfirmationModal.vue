<script setup lang="ts">
import { ref, type Ref } from 'vue'
import BaseModal from './BaseModal.vue'

interface Emits {
  (e: 'confirm'): boolean
}

const emits = defineEmits<Emits>()

interface Props {
  title: string
}

const props = defineProps<Props>()

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
  }
  modalRef.value!.close()
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
      <button class="btn btn-error" @click="onClick(true)">Confirm</button>
    </div>
  </BaseModal>
</template>
