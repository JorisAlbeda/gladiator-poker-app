<script setup lang="ts">
import type { TablesInsert } from "~/types/database.types"

const route = useRoute()
const client = useSupabaseClient()
const gameId = parseInt(<string>route.params.id)
const players = useGetRealtimePlayers(gameId)
const toast = useToast()

const { data } = await client
  .from("games")
  .select("id, name")
  .eq("id", gameId)
  .single()
const game = data

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
  if (players)
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
  <div v-if="game && game.id">
    <div class="flex">
      <h1>{{ game.name }}</h1>
    </div>
    <UButton
      icon="i-heroicons-plus"
      size="sm"
      color="primary"
      class="mb-4"
      @click="startNewRound"
      >New Round</UButton
    >
    <TransitionGroup name="list" tag="ul">
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
    </TransitionGroup>
    <PlayerRow :game-id="gameId" />
  </div>
  <div v-else>
    <h1>Game not found!</h1>
    <UButton to="/">Homepage</UButton>
  </div>
</template>
