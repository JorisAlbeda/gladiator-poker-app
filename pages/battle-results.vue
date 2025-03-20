<script lang="ts" setup>
const currentRoundId = 1 //TODO: change to game's current round

const players = useGetRealtimeBattle(currentRoundId)
</script>

<template>
  <div>
    <h1>Battle results</h1>
    <ul>
      <TransitionGroup name="list">
        <li
          v-for="(player, index) in players"
          :key="player.id"
          class="flex justify-between items-center w-sm mb-1"
        >
          <span>{{ player.name }}</span>
          <span v-if="!player.eliminated_at" class="text-green-500">Alive</span>
          <span v-else-if="index < 5" class="font-bold">{{ index + 1 }}</span>
          <span v-else>-</span>
        </li>
      </TransitionGroup>
    </ul>
  </div>
</template>
