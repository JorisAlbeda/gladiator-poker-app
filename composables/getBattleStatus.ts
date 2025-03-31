export const useGetBattleStatus = (currentRoundId: number) => {
  const supaClient = useSupabaseClient()

  // Fetch players and get the refresh method provided by useAsyncData
  const { data: battleStatus, refresh: refreshStatus } = useAsyncData(
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

  return {
    battleStatus,
    refreshStatus,
  }
}
