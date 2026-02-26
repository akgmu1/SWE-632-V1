<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { ref, type Ref } from 'vue'

interface Props {
  title: string
}

const props = defineProps<Props>()

const dialogRef: Ref<HTMLDialogElement | null> = ref(null)

defineExpose({
  showModal: () => {
    dialogRef.value!.showModal()
  },
  close: () => {
    dialogRef.value!.close()
  },
})
</script>

<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
          <XMarkIcon class="size-6" />
        </button>
      </form>
      <h3 class="mb-3 text-lg font-bold">{{ props.title }}</h3>
      <slot />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
