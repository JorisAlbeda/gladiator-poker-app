<script lang="ts" setup>
const players = useGetRealtimePlayers()
</script>

<template>
  <div>
    <UCard v-for="player in players" :key="player.id">
      <div class="flex justify-between">
        <span>{{ player.name }}</span>
        <UButton>Hit</UButton>
      </div>
    </UCard>
  </div>
</template>
