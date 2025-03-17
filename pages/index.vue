<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js"

const client = useSupabaseClient()

let realtimeChannel: RealtimeChannel

// Fetch players and get the refresh method provided by useAsyncData
const { data: players, refresh: refreshPlayers } = await useAsyncData(
  "players",
  async () => {
    const { data } = await client.from("players").select("id, name")
    return data
  }
)

// Once page is mounted, listen to changes on the `players` table and refresh players when receiving event
onMounted(() => {
  // Real time listener for new workouts
  realtimeChannel = client
    .channel("public:players")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players" },
      () => refreshPlayers()
    )

  realtimeChannel.subscribe()
})

// Don't forget to unsubscribe when user left the page
onUnmounted(() => {
  client.removeChannel(realtimeChannel)
})

const toast = useToast()

async function deletePlayer(playerId: number) {
  console.log(`Deleting player ${playerId}`)
  const response = await client.from("players").delete().eq("id", playerId)
  if (response.error) {
    toast.add({
      title: "Oh noes!",
      description: `Error deleting player: ${response.error.message}`,
      color: "error",
    })
  }
}
</script>

<template>
  <div>
    <h1 class="text-4xl mb-8">Players</h1>
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
