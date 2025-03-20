<script setup lang="ts">
import type { TablesInsert } from "~/types/database.types"
const client = useSupabaseClient()

const players = useGetRealtimePlayers()

const toast = useToast()

async function deletePlayer(playerId: number) {
  const response = await client.from("players").delete().eq("id", playerId)
  if (response.error) {
    toast.add({
      title: "Oh noes!",
      description: `Error deleting player: ${response.error.message}`,
      color: "error",
    })
  }
}

async function startNewRound() {
  const currentRoundId = 1 //TODO: get currentRound from current game and increment
  const playerRoundList: TablesInsert<"player_round">[] = []
  players.value?.forEach((player) => {
    playerRoundList.push({
      round_id: currentRoundId,
      player_id: player.id,
      eliminated_at: null,
    })
  })
  await client.from("player_round").insert(playerRoundList)
  navigateTo("/battle")
}
</script>

<template>
  <div>
    <div class="flex">
      <h1 class="text-4xl mb-2">Players</h1>
    </div>
    <UButton
      icon="i-heroicons-plus"
      size="sm"
      color="primary"
      class="mb-4"
      @click="startNewRound"
      >New Round</UButton
    >
    <ul>
      <li
        v-for="player in players"
        :key="player.id"
        class="flex justify-between items-center w-sm mb-1"
      >
        <span>{{ player.name }}</span>
        <UButton
          icon="i-heroicons-trash"
          color="error"
          loading-auto
          @click="deletePlayer(player.id)"
        />
      </li>
    </ul>
    <PlayerRow />
  </div>
</template>
