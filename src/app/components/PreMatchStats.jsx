export default function PreMatchStats({ homeStats, awayStats }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 border-b pb-2">
        Statistiche Pre-Partita
      </h2>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 text-center">
        <div>
          <p className="font-bold mb-1">
            {homeStats.goals.against.average.total}
          </p>
          <p className="text-xs text-gray-500">Media goal fatti</p>
        </div>
        <div>
          <p className="font-bold mb-1">vs</p>
          <p className="text-xs text-gray-400">Confronto</p>
        </div>
        <div>
          <p className="font-bold mb-1">
            {awayStats.goals.against.average.total}
          </p>
          <p className="text-xs text-gray-500">Media goal fatti</p>
        </div>

        <div>
          <p className="font-bold mb-1">{homeStats.clean_sheet.total}</p>
          <p className="text-xs text-gray-500">Clean sheets</p>
        </div>
        <div></div>
        <div>
          <p className="font-bold mb-1">{awayStats.clean_sheet.total}</p>
          <p className="text-xs text-gray-500">Clean sheets</p>
        </div>

        <div>
          <p className="font-bold mb-1">{homeStats.failed_to_score.total}</p>
          <p className="text-xs text-gray-500">Partite senza segnare</p>
        </div>
        <div></div>
        <div>
          <p className="font-bold mb-1">{awayStats.failed_to_score.total}</p>
          <p className="text-xs text-gray-500">Partite senza segnare</p>
        </div>
      </div>
    </div>
  );
}
