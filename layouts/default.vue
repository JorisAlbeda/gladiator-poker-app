<script setup>
import { useOnline } from "@vueuse/core"

const isOnline = useOnline()
</script>

<template>
  <UApp>
    <UContainer class="py-8 bg-bg-dark">
      <UAlert
        v-if="!isOnline"
        color="error"
        title="You are offline!"
        description="Please check your internet connection."
      />
      <slot />
    </UContainer>
  </UApp>
</template>
