<script setup>
import { useOnline } from "@vueuse/core"

useHead({ title: "Gladiator Poker" })

const isOnline = useOnline()
</script>

<template>
  <UApp>
    <UContainer class="py-8">
      <UAlert
        v-if="!isOnline"
        color="error"
        title="You are offline!"
        description="Please check your internet connection."
      />
      <NuxtPage />
    </UContainer>
  </UApp>
</template>
