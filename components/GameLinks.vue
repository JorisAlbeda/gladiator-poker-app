<script lang="ts" setup>
const supaClient = useSupabaseClient()

const { data: games } = await supaClient
  .from("games")
  .select("id, name, current_round_id")
</script>

<template>
  <div>
    <NuxtLink v-for="game in games" :key="game.id" :to="`/game/${game.id}/`">{{
      game.name
    }}</NuxtLink>
  </div>
</template>
