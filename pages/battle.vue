<script lang="ts" setup>
// const players = useGetRealtimePlayers()
const currentRound = 1 //TODO: change to game's current round

const supaClient = useSupabaseClient()
const { data: players } = await supaClient
  .from("players")
  .select("id, name, player_round (eliminated_at)")
  .eq("player_round.round_id", currentRound)

async function hitPlayer(playerId: number) {
  await supaClient
    .from("player_round")
    .update({ eliminated_at: new Date().toISOString() })
    .eq("id", playerId)
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
