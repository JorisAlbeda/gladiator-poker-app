<script lang="ts" setup>
const route = useRoute()
const currentRoundId = parseInt(<string>route.params.roundId)

const supaClient = useSupabaseClient()
const battleStatus = useGetRealtimeBattle(currentRoundId)

async function hitPlayer(playerId: number) {
  const response = await supaClient
    .from("player_round")
    .update({ eliminated_at: new Date().toISOString() })
    .eq("player_id", playerId)
    .select()
}
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-lg flex-1">
      <GladiatorCard
        color="primary"
        :title="battleStatus?.roundActive ? 'Battle' : 'Battle over!'"
      >
        <TransitionGroup name="list">
          <div
            v-for="(player, index) in battleStatus?.players"
            :key="player.id"
            class="flex justify-between items-center mb-2 h-10"
          >
            <span>{{ player.name }}</span>
            <div
              v-if="battleStatus?.roundActive"
              class="w-20 flex justify-center"
            >
              <UButton
                v-if="!player.eliminated_at"
                color="warning"
                class="w-full justify-center text-primary text-2xl bg-accent-texture"
                loading-auto
                @click="hitPlayer(player.id)"
                >Hit</UButton
              >
              <span
                v-else
                class="text-primary-dark uppercase font-heading text-2xl"
                >Eliminated</span
              >
            </div>
            <div v-else>
              <span v-if="index < 5">{{ index + 1 }}</span>
              <span v-else>-</span>
            </div>
          </div>
        </TransitionGroup>
      </GladiatorCard>
    </div>
  </div>
</template>
