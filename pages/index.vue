<script lang="ts" setup>
const isLoading = ref(false)
const recentGameId = null

async function newGame() {
  const supaClient = useSupabaseClient()

  const { data: game } = await supaClient
    .from("games")
    .insert({ name: "Ulenpas" })
    .select()
    .single()

  if (game) {
    await navigateTo({ name: "game-gameId", params: { gameId: game.id } })
  }
}

function loadGame() {
  isLoading.value = true
}

definePageMeta({
  layout: "landing",
})
</script>

<template>
  <div class="flex flex-col h-screen bg-bg-light">
    <NuxtImg src="/AceSamurai.jpeg" class="main-image h-full" />
    <h1
      class="absolute top-70 font-title text-primary text-7xl text-center text-outline"
    >
      Gladiator Poker
    </h1>
    <div class="bg-bg-light py-6">
      <GameLinks v-if="isLoading" />
      <div v-else class="flex flex-col gap-4 justify-center">
        <UButton
          v-if="recentGameId"
          variant="ghost"
          class="justify-center text-6xl underline"
          >Continue</UButton
        >
        <UButton
          variant="ghost"
          class="justify-center text-4xl underline"
          @click="newGame"
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
