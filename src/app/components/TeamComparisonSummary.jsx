import LeagueStandingsModal from "../components/LeagueStandingsModal";

export default async function TeamComparisonSummary({
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

  const [homeRes, awayRes, standingsRes] = await Promise.all([
    fetch(
      `https://v3.football.api-sports.io/teams/statistics?team=${homeId}&season=${season}&league=${leagueId}`,
      headers
    ),
    fetch(
      `https://v3.football.api-sports.io/teams/statistics?team=${awayId}&season=${season}&league=${leagueId}`,
      headers
    ),
    fetch(
      `https://v3.football.api-sports.io/standings?season=${season}&league=${leagueId}`,
      headers
    ),
  ]);

  const homeData = await homeRes.json();
  const awayData = await awayRes.json();
  const standingsData = await standingsRes.json();

  const homeStats = homeData.response;
  const awayStats = awayData.response;
  const table = standingsData.response?.[0]?.league?.standings?.[0] || [];

  const getStandingInfo = (teamId) => {
    const team = table.find((t) => t.team.id === teamId);
    return {
      rank: team?.rank ?? "-",
      points: team?.points ?? "-",
      form: team?.form ?? "-----",
    };
  };

  const homeStanding = getStandingInfo(homeStats.team.id);
  const awayStanding = getStandingInfo(awayStats.team.id);

  const renderForm = (form) => {
    return form
      .slice(-5)
      .split("")
      .map((char, i) => {
        let color = "bg-gray-300";
        if (char === "W") color = "bg-green-500";
        if (char === "D") color = "bg-gray-400";
        if (char === "L") color = "bg-red-500";
        return (
          <div
            key={i}
            className={`w-6 h-6 rounded-sm text-xs text-white font-bold flex items-center justify-center ${color}`}
          >
            {char}
          </div>
        );
      });
  };

  const teams = [
    {
      logo: homeStats.team.logo,
      rank: homeStanding.rank,
      points: homeStanding.points,
      form: homeStanding.form,
    },
    {
      logo: awayStats.team.logo,
      rank: awayStanding.rank,
      points: awayStanding.points,
      form: awayStanding.form,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <div className="grid grid-cols-4 gap-2 text-sm text-gray-700 font-medium items-center border-b pb-2 mb-2">
        <span>#</span>
        <span>Squadra</span>
        <span className="text-right me-5">Ultimi</span>
        <span className="text-right">PTS</span>
      </div>

      {teams.map((team, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-2 items-center py-2 last:border-b-0"
        >
          <span className="text-gray-500 font-bold">{team.rank}</span>
          <img
            src={team.logo}
            alt="logo"
            className="w-6 h-6 object-contain"
            loading="lazy"
          />
          <div className="flex gap-1 justify-center">
            {renderForm(team.form)}
          </div>
          <span className=" text-gray-500 text-right font-bold">
            {team.points}
          </span>
        </div>
      ))}

      <div className="pt-4 text-center">
        <LeagueStandingsModal
          leagueName={standingsData.response[0].league.name}
          leagueId={leagueId}
          trigger={
            <span className="text-blue-600 font-semibold hover:underline text-sm cursor-pointer">
              Classifica pre-partita ➜
            </span>
          }
        />
      </div>
    </div>
  );
}
