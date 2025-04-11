import LeagueStandingsModal from "../components/LeagueStandingsModal";
import DateSelector from "../components/DateSelector";
import Link from "next/link";
import Image from "next/image";

interface Match {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    flag: string;
    logo: string;
  };
  teams: {
    home: {
      name: string;
      logo: string;
    };
    away: {
      name: string;
      logo: string;
    };
  };
  score: {
    fulltime: {
      home: number | null;
      away: number | null;
    };
  };
}

interface Props {
  searchParams?: Record<string, string | string[] | undefined>;
}

/**
 * Raggruppa le partite per nazione e lega.
 */
const groupMatchesByCountry = (matches: Match[]) => {
  return matches.reduce(
    (acc: Record<string, Record<string, Match[]>>, match: Match) => {
      const { country, name: leagueName } = match.league;
      if (!acc[country]) acc[country] = {};
      if (!acc[country][leagueName]) acc[country][leagueName] = [];
      acc[country][leagueName].push(match);
      return acc;
    },
    {}
  );
};

/**
 * Formatta l'orario da una stringa ISO.
 */
const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default async function Scoreboard({ searchParams }: Props) {
  // Seleziona la data: usa quella passata via query o la data corrente.
  const resolvedSearchParams = await searchParams;
  const selectedDate =
    typeof resolvedSearchParams?.date === "string"
      ? resolvedSearchParams.date
      : new Date().toISOString().split("T")[0];

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${selectedDate}&season=2024&timezone=Europe%2FRome`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v3.football.api-sports.io",
          "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8", // API key da variabile d'ambiente
        },
        cache: "no-store", // Fetch sempre aggiornato
      }
    );

    if (!res.ok) {
      throw new Error("Errore nella risposta della rete");
    }

    const data = await res.json();
    const groupedByCountry = groupMatchesByCountry(data.response);

    // Ordina alfabeticamente i gruppi per nazione
    const sortedCountries = Object.entries(groupedByCountry).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

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
            {sortedCountries.map(([country, leagues]) => {
              // Prendi un match di esempio per mostrare la bandiera
              const sampleMatch = Object.values(leagues)[0][0];
              // Ordina alfabeticamente le leghe all'interno del gruppo
              const sortedLeagues = Object.entries(leagues).sort((a, b) =>
                a[0].localeCompare(b[0])
              );
              return (
                <div
                  key={country}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <input
                    type="checkbox"
                    id={`toggle-${country}`}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={`toggle-${country}`}
                    className="cursor-pointer text-left w-full text-2xl font-bold text-blue-700 flex items-center gap-2 mb-0 block"
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
                    {sortedLeagues.map(([leagueName, matches]) => {
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
                                <Link
                                  href={`/match/${match.fixture.id}`}
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
  } catch (error) {
    console.error("Errore fetch:", error);
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-red-600">
          Si è verificato un errore durante il caricamento dei dati.
        </p>
      </div>
    );
  }
}
