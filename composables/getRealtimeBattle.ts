import type { RealtimeChannel } from "@supabase/supabase-js"
export const useGetRealtimeBattle = (currentRoundId: number) => {
  const supaClient = useSupabaseClient()
  const { battleStatus, refreshStatus } = useGetBattleStatus(currentRoundId)

  let realtimeChannel: RealtimeChannel

  // Once page is mounted, listen to changes on the `players` table and refresh players when receiving event
  onMounted(() => {
    // Real time listener for player updates
    realtimeChannel = supaClient
      .channel("public:battle")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => refreshStatus()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_round" },
        () => refreshStatus()
      )

    realtimeChannel.subscribe()
  })

  // Don't forget to unsubscribe when user left the page
  onUnmounted(() => {
    supaClient.removeChannel(realtimeChannel)
  })

  return battleStatus
}
