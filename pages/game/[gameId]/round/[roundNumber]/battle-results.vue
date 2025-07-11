<script lang="ts" setup>
const route = useRoute()
const client = useSupabaseClient()
const currentRoundNumber = parseInt(<string>route.params.roundNumber)
const currentGameId = parseInt(<string>route.params.gameId)

const { data: currentRound } = await client
  .from("rounds")
  .select("id")
  .eq("game_id", currentGameId)
  .eq("number", currentRoundNumber)
  .single()

let battleStatus

if (currentRound) {
  const currentRoundId = currentRound.id
  battleStatus = useGetRealtimeBattle(currentRoundId)
} else {
  await navigateTo({
    name: "game-gameId",
    params: { gameId: currentGameId },
  })
}

async function toRound(roundNumber: number) {
  await navigateTo({
    name: "game-gameId-round-roundNumber-battle-results",
    params: { roundNumber: roundNumber, gameId: currentGameId },
  })
}

async function nextRound() {
  toRound(currentRoundNumber + 1)
}

async function previousRound() {
  toRound(currentRoundNumber - 1)
}
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-lg flex-1">
      <GladiatorCard
        v-if="currentRound && battleStatus"
        color="secondary"
        :title="
          battleStatus?.roundActive
            ? `Round ${currentRoundNumber}`
            : `Round ${currentRoundNumber} results`
        "
      >
        <ul>
          <TransitionGroup name="list">
            <li
              v-for="(player, index) in battleStatus?.players"
              :key="player.id"
              class="flex justify-between items-center mb-2 h-10"
            >
              <span>{{ player.name }}</span>
              <div
                class="w-20 flex justify-center uppercase font-heading text-2xl"
              >
                <span v-if="battleStatus?.roundActive && !player.eliminated_at"
                  >Alive</span
                >

                <span v-else-if="index < 5" class="text-yellow-500">{{
                  index + 1
                }}</span>
                <span v-else class="text-primary-dark">-</span>
              </div>
            </li>
          </TransitionGroup>
        </ul>
        <div class="mt-6 flex gap-4 justify-between">
          <UButton
            size="xl"
            color="warning"
            class="w-full justify-center text-2xl bg-white"
            loading-auto
            @click="previousRound"
            >Previous round</UButton
          >
          <UButton
            size="xl"
            class="w-full justify-center text-primary text-2xl bg-accent-texture"
            loading-auto
            @click="nextRound"
            >Next round</UButton
          >
        </div>
        <div class="text-center mt-4">
          <NuxtLink
            :to="{ name: 'game-gameId', params: { gameId: currentGameId } }"
            class="text-accent text-2xl"
            >Return</NuxtLink
          >
        </div>
      </GladiatorCard>
    </div>
  </div>
</template>
