<script lang="ts" setup>
const currentRoundId = 1 //TODO: change to game's current round

const supaClient = useSupabaseClient()
const players = useGetRealtimeBattle(currentRoundId)

async function hitPlayer(playerId: number) {
  const response = await supaClient
    .from("player_round")
    .update({ eliminated_at: new Date().toISOString() })
    .eq("player_id", playerId)
    .select()
  console.log(response)
}
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-lg flex-1">
      <h1>Battle</h1>
      <TransitionGroup name="list">
        <UCard v-for="player in players" :key="player.id">
          <div class="flex justify-between">
            <span>{{ player.name }}</span>
            <UButton
              v-if="!player.eliminated_at"
              color="error"
              loading-auto
              @click="hitPlayer(player.id)"
              >Hit</UButton
            >
            <span v-else class="text-error-100">Uitgeschakeld</span>
          </div>
        </UCard>
      </TransitionGroup>
    </div>
  </div>
</template>
