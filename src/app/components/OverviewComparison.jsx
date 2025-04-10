export default function OverviewComparison({ homeStats, awayStats }) {
  const { fixtures: hF, goals: hG } = homeStats;
  const { fixtures: aF, goals: aG } = awayStats;

  const rows = [
    {
      label: "Partite Giocate",
      home: hF.played.total,
      away: aF.played.total,
    },
    {
      label: "Vittorie",
      home: hF.wins.total,
      away: aF.wins.total,
    },
    {
      label: "Pareggi",
      home: hF.draws.total,
      away: aF.draws.total,
    },
    {
      label: "Sconfitte",
      home: hF.loses.total,
      away: aF.loses.total,
    },
    {
      label: "Media Gol Fatti",
      home: hG.for.average.total,
      away: aG.for.average.total,
    },
    {
      label: "Media Gol Subiti",
      home: hG.against.average.total,
      away: aG.against.average.total,
    },
    {
      label: "Clean Sheet",
      home: homeStats.clean_sheet.total,
      away: awayStats.clean_sheet.total,
    },
    {
      label: "Partite senza segnare",
      home: homeStats.failed_to_score.total,
      away: awayStats.failed_to_score.total,
    },
    {
      label: "Rigori Segnati",
      home: homeStats.penalty.scored.total,
      away: awayStats.penalty.scored.total,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-4  pb-2 text-center">
        Statistiche a confronto
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700 text-center">
          <thead>
            <tr>
              <th className="w-1/3 text-left">Casa</th>
              <th className="w-1/3 text-center"></th>
              <th className=" w-1/3 text-right">Trasferta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2 text-left font-medium">{row.home}</td>
                <td className="py-2 text-gray-500">{row.label}</td>
                <td className="py-2 text-right font-medium">{row.away}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
