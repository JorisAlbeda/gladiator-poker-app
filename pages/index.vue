<script setup lang="ts">
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
