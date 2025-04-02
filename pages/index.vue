<script lang="ts" setup>
const isLoading = ref(false)
const recentGameId = null

function loadGame() {
  isLoading.value = true
}

definePageMeta({
  layout: "landing",
})
</script>

<template>
  <div class="">
    <h1 class="mt-70 font-title text-primary text-7xl text-center text-outline">
      Gladiator Poker
    </h1>
    <NuxtImg src="/AceSamurai.jpeg" class="main-image" />
    <div class="mt-10">
      <GameLinks v-if="isLoading" />
      <div v-else class="flex flex-col gap-4 justify-center">
        <UButton
          v-if="recentGameId"
          variant="ghost"
          class="justify-center text-6xl underline"
          >Continue</UButton
        >
        <UButton variant="ghost" class="justify-center text-4xl underline"
          >New Game</UButton
        >
        <UButton
          variant="ghost"
          class="justify-center text-4xl underline"
          @click="loadGame"
          >Load Game</UButton
        >
      </div>
    </div>
  </div>
</template>
