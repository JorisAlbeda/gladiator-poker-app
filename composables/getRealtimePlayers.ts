import type { RealtimeChannel } from "@supabase/supabase-js"
export const useGetRealtimePlayers = (gameId: number) => {
  const client = useSupabaseClient()

  let realtimeChannel: RealtimeChannel

  // Fetch players and get the refresh method provided by useAsyncData
  const {
    data: players,
    refresh: refreshPlayers,
    error,
  } = useAsyncData("players", async () => {
    const { data } = await client
      .from("players")
      .select("id, name")
      .eq("game_id", gameId)
    return data
  })

  if (!error.value) {
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

    return players
  } else {
    console.error("Error fetching players.", error.value)
  }
}
