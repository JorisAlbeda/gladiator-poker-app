<script lang="ts" setup>
const currentRoundId = 1 //TODO: change to game's current round

const supaClient = useSupabaseClient()
const battleStatus = useGetRealtimeBattle(currentRoundId)

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
      <h1 v-if="battleStatus?.roundActive">Battle</h1>
      <h1 v-else>Battle Over!</h1>
      <TransitionGroup name="list">
        <UCard
          v-for="(player, index) in battleStatus?.players"
          :key="player.id"
        >
          <div class="flex justify-between">
            <span>{{ player.name }}</span>
            <div v-if="battleStatus?.roundActive">
              <UButton
                v-if="!player.eliminated_at"
                color="error"
                loading-auto
                @click="hitPlayer(player.id)"
                >Hit</UButton
              >
              <span v-else class="text-error-200">Uitgeschakeld</span>
            </div>
            <div v-else>{{ index + 1 }}</div>
          </div>
        </UCard>
      </TransitionGroup>
    </div>
  </div>
</template>
