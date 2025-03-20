import type { RealtimeChannel } from "@supabase/supabase-js"
export const useGetRealtimeBattle = (currentRoundId: number) => {
  const supaClient = useSupabaseClient()

  let realtimeChannel: RealtimeChannel

  // Fetch players and get the refresh method provided by useAsyncData
  const { data: players, refresh: refreshPlayers } = useAsyncData(
    "players",
    async () => {
      const { data: players } = await supaClient
        .from("players")
        .select("id, name, player_round (eliminated_at)")
        .eq("player_round.round_id", currentRoundId)
      return players
    }
  )

  // Once page is mounted, listen to changes on the `players` table and refresh players when receiving event
  onMounted(() => {
    // Real time listener for new workouts
    realtimeChannel = supaClient
      .channel("public:battle")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => refreshPlayers()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_round" },
        () => refreshPlayers()
      )

    realtimeChannel.subscribe()
  })

  // Don't forget to unsubscribe when user left the page
  onUnmounted(() => {
    supaClient.removeChannel(realtimeChannel)
  })

  return players
}
