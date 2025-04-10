export default async function TopPlayersComparison({
  homeId,
  awayId,
  leagueId,
  season,
}) {
  const headers = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
    },
    cache: "no-store",
  };

  const fetchPlayerStats = async (teamId) => {
    const res = await fetch(
      `https://v3.football.api-sports.io/players?team=${teamId}&season=${season}&league=${leagueId}`,
      headers
    );
    const data = await res.json();
    const players = data.response || [];

    const topBy = (accessor) => {
      let topPlayer = null;
      let maxValue = -Infinity;

      for (const p of players) {
        const stat = accessor(p);
        if (stat > maxValue) {
          maxValue = stat;
          topPlayer = p;
        }
      }

      return {
        name: topPlayer?.player?.name,
        value: maxValue !== -Infinity ? maxValue : null,
        photo: topPlayer?.player?.photo,
      };
    };

    return {
      goals: topBy((p) => p.statistics[0]?.goals.total || 0),
      assists: topBy((p) => p.statistics[0]?.goals.assists || 0),
      dribbles: topBy((p) => p.statistics[0]?.dribbles.success || 0),
    };
  };

  const [homePlayers, awayPlayers] = await Promise.all([
    fetchPlayerStats(homeId),
    fetchPlayerStats(awayId),
  ]);

  const categories = ["goals", "assists", "dribbles"];

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-0">
      <h2 className="text-sm font-semibold text-gray-800 mb-4  pb-2 text-center">
        Top Player a Confronto
      </h2>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 text-center font-medium">
        <span>Casa</span>
        <span></span>
        <span>Trasferta</span>
      </div>

      {categories.map((stat, i) => (
        <div
          key={i}
          className="grid grid-cols-3 gap-4 items-center py-2 text-sm"
        >
          <div className="flex flex-col items-center">
            <img
              src={homePlayers[stat]?.photo}
              alt="home player"
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-xs mt-1 text-center text-gray-500 truncate w-20">
              {homePlayers[stat]?.name || "-"}
            </span>
            <span className="text-xs text-gray-500">
              {homePlayers[stat]?.value ?? "-"}
            </span>
          </div>

          <span className="text-center capitalize text-gray-500">{stat}</span>

          <div className="flex flex-col items-center">
            <img
              src={awayPlayers[stat]?.photo}
              alt="away player"
              className="w-10 h-10 rounded-full object-cover"
              loading="lazy"
            />
            <span className="text-xs mt-1 text-center text-gray-500 truncate w-20">
              {awayPlayers[stat]?.name || "-"}
            </span>
            <span className="text-xs text-gray-500">
              {awayPlayers[stat]?.value ?? "-"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
