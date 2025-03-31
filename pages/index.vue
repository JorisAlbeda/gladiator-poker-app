<script lang="ts" setup>
const isLoading = ref(false)
const recentGameId = null

function loadGame() {
  isLoading.value = true
}
</script>

<template>
  <div>
    <h1>Gladiator Poker</h1>
    <GameLinks v-if="isLoading" />
    <div v-else class="flex flex-col gap-4 justify-center">
      <UButton variant="ghost" class="w-4 justify-center" v-if="recentGameId"
        >Continue</UButton
      >
      <UButton variant="ghost" class="justify-center">New Game</UButton>
      <UButton variant="ghost" class="justify-center" @click="loadGame"
        >Load Game</UButton
      >
    </div>
  </div>
</template>
