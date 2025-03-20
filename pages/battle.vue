<script lang="ts" setup>
// const players = useGetRealtimePlayers()
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
  <div>
    <UCard v-for="player in players" :key="player.id">
      <div class="flex justify-between">
        <span>{{ player.name }}</span>
        <UButton
          v-if="!player.player_round[0].eliminated_at"
          color="error"
          @click="hitPlayer(player.id)"
          >Hit</UButton
        >
        <span v-else class="text-error-100">Uitgeschakeld</span>
      </div>
    </UCard>
  </div>
</template>
