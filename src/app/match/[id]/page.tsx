import Link from "next/link";
import OverviewComparison from "../../components/OverviewComparison";
import TeamComparisonSummary from "../../components/TeamComparisonSummary";
import HeadToHeadStats from "../../components/H2HStats";
import TopPlayersComparison from "../../components/TopPlayersComparison";
import Lineups from "../../components/Lineups";
import MatchInjuries from "../../components/MatchInjuries";
import TabsMatchSections from "../../components/TabsMatchSections";
import MatchPrediction from "../../components/MatchPrediction";
import MatchStatistics from "../../components/MatchStatistics";
import MatchOdds from "../../components/OddsPreMatch";

export default async function MatchDetail({ params }: any) {
  const { id } = params;

  const [matchRes, eventsRes] = await Promise.all([
    fetch(`https://v3.football.api-sports.io/fixtures?id=${id}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
      },
      cache: "no-store",
    }),
    fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${id}`, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
      },
      cache: "no-store",
    }),
  ]);

  const matchData = await matchRes.json();
  const eventsData = await eventsRes.json();

  const match = matchData.response?.[0];
  const events = eventsData.response || [];

  console.log(events);

  if (!match) {
    return <div className="text-center py-10">Partita non trovata</div>;
  }

  const { teams, goals, fixture, league, score } = match;

  console.log(fixture.status.short);

  const [homeStatsRes, awayStatsRes] = await Promise.all([
    fetch(
      `https://v3.football.api-sports.io/teams/statistics?team=${teams.home.id}&season=${league.season}&league=${league.id}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
        },
        cache: "no-store",
      }
    ),
    fetch(
      `https://v3.football.api-sports.io/teams/statistics?team=${teams.away.id}&season=${league.season}&league=${league.id}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
        },
        cache: "no-store",
      }
    ),
  ]);

  const homeStatsData = await homeStatsRes.json();
  const awayStatsData = await awayStatsRes.json();

  const homeStats = homeStatsData.response;
  const awayStats = awayStatsData.response;

  console.log(awayStats);

  const h2hRes = await fetch(
    `https://v3.football.api-sports.io/fixtures/headtohead?h2h=${teams.home.id}-${teams.away.id}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
      },
      cache: "no-store",
    }
  );

  const h2hData = await h2hRes.json();
  const h2hMatches = h2hData.response || [];

  const formatTime = (iso: string | number | Date) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedEvents = [...events].sort(
    (a, b) => b.time.elapsed - a.time.elapsed
  );

  const firstHalfEvents = sortedEvents.filter((e) => e.time.elapsed <= 45);
  const secondHalfEvents = sortedEvents.filter((e) => e.time.elapsed > 45);

  const renderTimeline = (filteredEvents: any[]) => (
    <div className="flex flex-col gap-2">
      {filteredEvents.map((event, index) => {
        const isHomeTeam = event.team.id === teams.home.id;
        const isOwnGoal = event.detail === "Own Goal";

        const getIcon = () => {
          if (event.detail?.includes("Own Goal")) return "🔴⚽";
          if (event.detail?.includes("Missed Penalty")) return "🔴🥅";
          if (event.detail?.includes("Penalty")) return "🥅";
          if (event.comments?.includes("Var") || event.type === "Var")
            return <span className="text-blue-500 border">VAR</span>;
          if (event.type === "Goal") return "⚽";
          if (event.type === "Card")
            return event.detail.includes("Red") ? "🔴" : "🟡";
          if (event.type === "subst" || event.type === "subst") return "🔁";
          return "";
        };

        return (
          <div
            key={index}
            className={`flex ${isHomeTeam ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm  max-w-[70%] ${
                isHomeTeam ? "" : "flex-row-reverse text-right"
              }`}
            >
              <span className="text-gray-500 font-medium">
                {event.time.elapsed}'
                {event.time.extra ? "+" + event.time.extra : ""}
              </span>
              <span>{getIcon()}</span>
              {event.type === "Goal" ? (
                isHomeTeam ? (
                  <span className="text-medium text-black">
                    {event.player.name}
                    <span className="ms-1 text-sx text-gray-500">
                      {event.detail.includes("Missed Penalty")
                        ? ""
                        : event.assist.name}
                    </span>
                  </span>
                ) : (
                  <span className="text-sx text-gray-500">
                    {event.detail.includes("Missed Penalty")
                      ? ""
                      : event.assist?.name}
                    <span className="ms-1 text-medium text-black">
                      {event.player.name}
                    </span>
                  </span>
                )
              ) : event.type === "subst" ? (
                isHomeTeam ? (
                  <span className="text-medium text-black">
                    {event.assist.name}
                    <span className="ms-1 text-sx text-gray-500">
                      {event.player.name}
                    </span>
                  </span>
                ) : (
                  <span className="text-sx text-gray-500">
                    {event.player?.name}
                    <span className="ms-1 text-medium text-black">
                      {event.assist.name}
                    </span>
                  </span>
                )
              ) : event.comments?.includes("Var") || event.type === "Var" ? (
                isHomeTeam ? (
                  <span className="font-medium text-black">
                    {event.player.name}
                    <span className="ms-1 text-sx text-gray-500">
                      {event.detail || ""}
                    </span>
                  </span>
                ) : (
                  <span className="font-medium text-black">
                    <span className="me-1 text-sx text-gray-500">
                      {event.detail || ""}
                    </span>
                    {event.player.name}
                  </span>
                )
              ) : (
                <span className="font-medium text-black">
                  {event.player.name}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const isLive = ["1H", "2H", "ET", "P", "LIVE"].includes(fixture.status.short);
  const notStarted = ["NS"].includes(fixture.status.short);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 text-center">
        <Link
          href="/scoreboard"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold mb-3 py-2 px-4 rounded"
        >
          Home
        </Link>
        <p className="text-xs text-gray-500">
          {league.name} - {fixture.status.long}
        </p>
        <h1 className="text-xl font-bold text-white-800">
          {teams.home.name} vs {teams.away.name}
        </h1>
        <p className="text-sm text-gray-500">
          {new Date(fixture.date).toLocaleDateString()} -{" "}
          {formatTime(fixture.date)}
        </p>
      </div>

      <div className="bg-white rounded-t shadow p-4 mb-0 ">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-1">
            <img
              src={teams.home.logo}
              alt={teams.home.name}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm text-gray-700 text-center w-24 truncate">
              {teams.home.name}
            </span>
          </div>

          <div className="text-center">
            <p className="text-3xl font-extrabold text-gray-800">
              {isLive
                ? `${goals.home ?? 0} - ${goals.away ?? 0}`
                : `${score.fulltime.home ?? 0} - ${score.fulltime.away ?? 0}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">{fixture.status.long}</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <img
              src={teams.away.logo}
              alt={teams.away.name}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm text-gray-700 text-center w-24 truncate">
              {teams.away.name}
            </span>
          </div>
        </div>
        {/* Goal Summary */}
        {events.some(
          (e: { type: string; detail: string }) =>
            e.type === "Goal" &&
            (e.detail === "Normal Goal" || e.detail === "Penalty")
        ) && (
          <div className="mt-4 border-t pt-3">
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
              <div className="text-left space-y-1">
                {[...events]
                  .filter(
                    (e) =>
                      e.type === "Goal" &&
                      (e.detail === "Normal Goal" ||
                        e.detail === "Penalty" ||
                        e.detail === "Own Goal") &&
                      e.team.id === teams.home.id
                  )
                  .sort(
                    (a, b) =>
                      b.time.elapsed +
                      (b.time.extra || 0) -
                      (a.time.elapsed + (a.time.extra || 0))
                  )
                  .map((e, i) => (
                    <p key={i}>
                      {e.player.name} {e.time.elapsed}'
                      {e.time.extra ? `+${e.time.extra}` : ""}{" "}
                      {e.detail === "Penalty"
                        ? "(Rig.)"
                        : e.detail === "Own Goal"
                        ? "(AG)"
                        : ""}
                    </p>
                  ))}
              </div>
              <h4 className="text-md font-semibold text-center text-gray-500">
                ⚽
              </h4>
              <div className="text-right space-y-1">
                {[...events]
                  .filter(
                    (e) =>
                      e.type === "Goal" &&
                      (e.detail === "Normal Goal" ||
                        e.detail === "Penalty" ||
                        e.detail === "Own Goal") &&
                      e.team.id === teams.away.id
                  )
                  .sort(
                    (a, b) =>
                      b.time.elapsed +
                      (b.time.extra || 0) -
                      (a.time.elapsed + (a.time.extra || 0))
                  )
                  .map((e, i) => (
                    <p key={i}>
                      {e.player.name} {e.time.elapsed}'
                      {e.time.extra ? `+${e.time.extra}` : ""}{" "}
                      {e.detail === "Penalty"
                        ? "(Rig.)"
                        : e.detail === "Own Goal"
                        ? "(AG)"
                        : ""}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <TabsMatchSections
        notStarted={notStarted}
        details={
          <>
            <div className="bg-white rounded-xl shadow p-4 mb-3 text-center text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src={league.logo}
                  alt={league.name}
                  className="w-6 h-6 object-contain"
                  loading="lazy"
                />
                <span className="font-semibold text-base text-gray-700">
                  {league.name}
                </span>
              </div>
              <p>{match.league.round}</p>
              <p>
                {new Date(fixture.date).toLocaleDateString()} -{" "}
                {new Date(fixture.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-black font-semibold">
                {fixture.venue?.name}, {fixture.venue?.city}
              </p>
            </div>
            {fixture.status.short === "NS" && (
              <>
                <OverviewComparison
                  homeStats={homeStats}
                  awayStats={awayStats}
                />
                <TeamComparisonSummary
                  homeId={teams.home.id}
                  awayId={teams.away.id}
                  leagueId={league.id}
                  season={league.season}
                />
                <HeadToHeadStats matches={h2hMatches} />
                <TopPlayersComparison
                  homeId={teams.home.id}
                  awayId={teams.away.id}
                  leagueId={league.id}
                  season={league.season}
                />
              </>
            )}
            {events.length > 0 && (
              <div className="bg-white rounded-xl shadow p-4 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-center text-gray-600 mb-2">
                    2° Tempo
                  </h3>
                  {renderTimeline(secondHalfEvents)}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-center text-gray-600 mb-2">
                    1° Tempo
                  </h3>
                  {renderTimeline(firstHalfEvents)}
                </div>
              </div>
            )}
          </>
        }
        odds={<MatchOdds fixtureId={fixture.id} />}
        lineups={<Lineups fixtureId={fixture.id} />}
        stats={<MatchStatistics fixtureId={fixture.id} />}
        prediction={<MatchPrediction fixtureId={fixture.id} />}
        injuries={<MatchInjuries fixtureId={fixture.id} />}
      />
    </div>
  );
}
