import LeagueStandingsModal from "../components/LeagueStandingsModal";
import DateSelector from "../components/DateSelector";

import Link from "next/link";

export default async function Scoreboard({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const selectedDate =
    searchParams?.date || new Date().toISOString().split("T")[0];
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${selectedDate}&season=2024&timezone=Europe%2FLondon`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
      },
      cache: "no-store", // <- così fai fetch sempre aggiornata
    }
  );

  const data = await res.json();

  const groupedByCountry = data.response.reduce((acc: any, match: any) => {
    const country = match.league.country;
    const league = match.league.name;
    if (!acc[country]) acc[country] = {};
    if (!acc[country][league]) acc[country][league] = [];
    acc[country][league].push(match);
    return acc;
  }, {});

  const formatTime = (iso: any) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">
          ⚽ Live Football Scoreboard
        </h1>
        <DateSelector />
      </div>

      <div className="h-[700px] overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col gap-2">
          {Object.entries(groupedByCountry).map(([country, leagues]) => {
            const sampleMatch = Object.values(leagues)[0][0];
            return (
              <div key={country} className="bg-white rounded-xl p-4 shadow-sm">
                <input
                  type="checkbox"
                  id={`toggle-${country}`}
                  className="peer hidden"
                />
                <label
                  htmlFor={`toggle-${country}`}
                  className="cursor-pointer text-left w-full text-2xl font-bold text-blue-700 mb-0 block flex items-center gap-2"
                >
                  <span className="text-sm peer-checked:hidden">▶</span>
                  <span className="hidden peer-checked:inline">▼</span>
                  <img
                    src={sampleMatch.league.flag}
                    alt="flag"
                    className="w-6 h-4 object-contain rounded-sm"
                    loading="lazy"
                  />
                  {country}
                </label>
                <div className="hidden peer-checked:flex flex-col gap-6">
                  {Object.entries(leagues).map(([leagueName, matches]) => {
                    const leagueId = matches[0].league.id;

                    return (
                      <div key={leagueName} className="mb-2">
                        <div className="flex items-center justify-between my-3 pl-2 border-l-4 border-blue-500">
                          <div className="flex items-center gap-2">
                            <img
                              src={matches[0].league.logo}
                              alt="league logo"
                              className="w-5 h-5 object-contain"
                              loading="lazy"
                            />
                            <h3 className="text-lg font-semibold text-gray-600">
                              {leagueName}
                            </h3>
                          </div>
                          <LeagueStandingsModal
                            leagueName={leagueName}
                            leagueId={leagueId}
                            trigger={
                              <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer">
                                Classifica
                              </span>
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          {matches.map((match) => {
                            const status = match.fixture.status.short;
                            const isNotStarted = status === "NS";
                            return (
                              <Link href={`/match/${match.fixture.id}`}>
                                <div
                                  key={match.fixture.id}
                                  className="bg-white border border-gray-200 rounded-xl p-2 shadow flex justify-between items-center hover:shadow-md transition"
                                >
                                  <div className="text-left max-w-[70%]">
                                    <p className="font-semibold text-base text-gray-800 flex items-center gap-2 flex-wrap">
                                      <span className="flex items-center gap-2">
                                        <img
                                          className="w-6 h-6 object-contain"
                                          src={match.teams.home.logo}
                                          alt=""
                                          loading="lazy"
                                        />
                                        {match.teams.home.name}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        vs
                                      </span>
                                      <span className="flex items-center gap-2">
                                        {match.teams.away.name}
                                        <img
                                          className="w-6 h-6 object-contain"
                                          src={match.teams.away.logo}
                                          alt=""
                                          loading="lazy"
                                        />
                                      </span>
                                    </p>
                                  </div>
                                  <div className="text-right text-gray-700">
                                    {isNotStarted ? (
                                      <p className="text-base font-semibold text-gray-500">
                                        {formatTime(match.fixture.date)}
                                      </p>
                                    ) : (
                                      <p className="text-2xl font-bold">
                                        {match.score.fulltime.home ?? "0"} -{" "}
                                        {match.score.fulltime.away ?? "0"}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                      {match.fixture.status.long}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
