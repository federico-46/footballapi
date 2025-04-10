export default function HeadToHeadStats({ matches }) {
  const sortedMatches = [...matches].sort(
    (a, b) => new Date(b.fixture.date) - new Date(a.fixture.date)
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 pb-2 text-center">
        H2H
      </h2>
      <div className="space-y-4 text-sm text-gray-700">
        {sortedMatches.length === 0 ? (
          <p className="text-center text-gray-400">Nessun match disponibile</p>
        ) : (
          sortedMatches.slice(0, 5).map((match, i) => (
            <div key={i} className="flex flex-col pb-1 gap-1">
              <p className="text-xs text-gray-400 text-center">
                {new Date(match.fixture.date).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <img
                  src={match.teams.home.logo}
                  alt={match.teams.home.name}
                  loading="lazy"
                  className="w-6 h-6 object-contain"
                />
                <span className="w-1/3 text-center text-gray-800 font-semibold">
                  {match.score.fulltime.home} - {match.score.fulltime.away}
                </span>
                <img
                  src={match.teams.away.logo}
                  alt={match.teams.away.name}
                  loading="lazy"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
