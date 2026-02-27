<script setup lang="ts">
import { BugAntIcon } from '@heroicons/vue/24/outline'
import { RouterLink, RouterView } from 'vue-router'

const IS_DEV = import.meta.env.DEV
</script>
<template>
  <RouterView />
  <div v-if="IS_DEV" class="fixed top-6 left-6 z-50">
    <RouterLink to="/debug" class="fixed bottom-6 left-6 z-50">
      <BugAntIcon class="size-6" />
    </RouterLink>
  </div>
</template>
