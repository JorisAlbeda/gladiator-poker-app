<script lang="ts" setup>
const supaClient = useSupabaseClient()

const { data: games } = await supaClient
  .from("games")
  .select(
    "id, name, current_round_id, players(count), ...rounds!games_current_round_id_fkey(number)"
  )
</script>

<template>
  <div class="flex flex-col gap-4">
    <UButton
      v-for="game in games"
      :key="game.id"
      variant="ghost"
      class="justify-center"
      :to="{ name: 'game-id', params: { id: game.id } }"
      >{{ game.name }} - {{ game.players[0].count }} players - Round
      {{ game.number }}</UButton
    >
  </div>
</template>
