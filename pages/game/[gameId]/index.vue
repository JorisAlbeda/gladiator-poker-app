<script setup lang="ts">
import type { TablesInsert } from "~/types/database.types"

const route = useRoute()
const client = useSupabaseClient()
const gameId = parseInt(<string>route.params.gameId)
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

async function getCurrentRoundNumber() {
  const { data: currentRound } = await client
    .from("games")
    .select("...rounds!games_current_round_id_fkey(id, number), id")
    .eq("id", gameId)
    .single()
  let roundNumber
  if (currentRound && currentRound.number) {
    roundNumber = currentRound.number
  } else {
    roundNumber = 0
  }
  return roundNumber
}

async function getNewRoundNumber() {
  return (await getCurrentRoundNumber()) + 1
}

async function startNewRound() {
  let newRoundNumber = await getNewRoundNumber()

  const { data: newRound } = await client
    .from("rounds")
    .insert({ game_id: gameId, number: newRoundNumber })
    .select()
    .single()
  if (newRound && newRound.id) {
    const currentRoundId = newRound.id
    await client
      .from("games")
      .update({ current_round_id: currentRoundId })
      .eq("id", gameId)
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
    await toBattle(currentRoundId)
  } else {
    console.error("Couldn't create a new round. Help!")
  }
}

async function spectate() {
  let roundNumber = await getCurrentRoundNumber()
  if (roundNumber > 0) {
    await navigateTo({
      name: "game-gameId-round-roundNumber-battle-results",
      params: { roundNumber: roundNumber, gameId: gameId },
    })
  }
}

async function toBattle(roundId: number) {
  await navigateTo({
    name: "game-gameId-round-roundId-battle",
    params: { roundId: roundId, gameId: gameId },
  })
}
</script>

<template>
  <div v-if="game && game.id">
    <div class="flex justify-center bg-brown text-primary-dark">
      <h1>{{ game.name }}</h1>
    </div>

    <GladiatorCard title="Players" color="secondary">
      <TransitionGroup name="list" tag="ul">
        <li
          v-for="player in players"
          :key="player.id"
          class="flex justify-between items-center mb-1"
        >
          <span>{{ player.name }}</span>
          <UButton
            icon="material-symbols:close"
            size="xl"
            class="bg-primary text-body"
            loading-auto
            @click="deletePlayer(player.id)"
          />
        </li>
      </TransitionGroup>
      <PlayerRow :game-id="gameId" />
    </GladiatorCard>
    <GladiatorCard title="New Round" color="primary">
      <UButton
        size="xl"
        color="warning"
        class="w-full justify-center text-primary text-2xl bg-accent-texture"
        loading-auto
        @click="startNewRound"
        >To Battle!</UButton
      >
      <UButton
        size="xl"
        color="warning"
        class="w-full justify-center text-2xl bg-white mt-3"
        loading-auto
        @click="spectate"
        >Spectate</UButton
      >
    </GladiatorCard>
  </div>
  <div v-else>
    <h1>Game not found!</h1>
    <UButton to="/">Homepage</UButton>
  </div>
</template>
