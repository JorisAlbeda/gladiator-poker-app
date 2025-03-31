<script lang="ts" setup>
const route = useRoute()
const currentRoundId = parseInt(<string>route.params.roundId)

const battleStatus = useGetRealtimeBattle(currentRoundId)
</script>

<template>
  <div>
    <h1 v-if="battleStatus?.roundActive">Current Battle</h1>
    <h1 v-else>Battle results</h1>
    <ul>
      <TransitionGroup name="list">
        <li
          v-for="(player, index) in battleStatus?.players"
          :key="player.id"
          class="flex justify-between items-center w-sm mb-1"
        >
          <span>{{ player.name }}</span>

          <span
            v-if="battleStatus?.roundActive && !player.eliminated_at"
            class="text-green-500"
            >Alive</span
          >
          <span v-else-if="index < 5" class="font-bold">{{ index + 1 }}</span>
          <span v-else>-</span>
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>
