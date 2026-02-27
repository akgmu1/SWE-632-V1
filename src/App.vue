<script setup lang="ts">
import { BugAntIcon } from '@heroicons/vue/24/outline'
import { RouterLink, RouterView } from 'vue-router'
import ToolTip from './components/ToolTip.vue'

const IS_DEV = import.meta.env.DEV
</script>
<template>
  <RouterView />
  <div v-if="IS_DEV" class="fixed bottom-6 left-6 z-50">
    <ToolTip tip="Debug">
      <RouterLink to="/debug" class="btn btn-circle btn-accent">
        <BugAntIcon class="size-6" />
      </RouterLink>
    </ToolTip>
  </div>
</template>
