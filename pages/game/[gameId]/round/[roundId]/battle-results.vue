<script lang="ts" setup>
const route = useRoute()
const currentRoundId = parseInt(<string>route.params.roundId)

const battleStatus = useGetRealtimeBattle(currentRoundId)
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-lg flex-1">
      <GladiatorCard
        color="secondary"
        :title="battleStatus?.roundActive ? 'Current Battle' : 'Battle results'"
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
      </GladiatorCard>
    </div>
  </div>
</template>
