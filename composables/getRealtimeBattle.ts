import type { RealtimeChannel } from "@supabase/supabase-js"
export const useGetRealtimeBattle = (currentRoundId: number) => {
  const supaClient = useSupabaseClient()

  let realtimeChannel: RealtimeChannel

  // Fetch players and get the refresh method provided by useAsyncData
  const { data: players, refresh: refreshPlayers } = useAsyncData(
    "battle",
    async () => {
      const { data: players } = await supaClient
        .from("player_round")
        .select("...players(id, name), eliminated_at")
        .eq("round_id", currentRoundId)
        .order("eliminated_at", {
          ascending: false,
          nullsFirst: true,
        })
      const activePlayers = players?.filter((player) => !player.eliminated_at)
      const roundActive = activePlayers && activePlayers.length > 1
      return {
        roundActive,
        players,
      }
    }
  )

  // Once page is mounted, listen to changes on the `players` table and refresh players when receiving event
  onMounted(() => {
    // Real time listener for player updates
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
