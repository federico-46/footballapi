"use client";

import { useEffect, useState } from "react";

export default function LeagueStandingsModal({
  leagueName,
  leagueId,
  trigger,
}) {
  const [open, setOpen] = useState(false);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && standings.length === 0) {
      setLoading(true);
      fetch(
        `https://v3.football.api-sports.io/standings?league=${leagueId}&season=2024`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "v3.football.api-sports.io",
            "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const raw = data.response?.[0]?.league?.standings;
          const result = Array.isArray(raw?.[0])
            ? raw[0]
            : Array.isArray(raw)
            ? raw
            : [];
          setStandings(result);
        })
        .catch((err) => {
          console.error("Errore fetch standings:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open]);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">
                Classifica {leagueName}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {loading ? (
              <p className="text-center text-gray-700 py-4">Caricamento...</p>
            ) : standings.length === 0 ? (
              <p className="text-center text-gray-700 py-4">
                Classifica non disponibile per questa competizione.
              </p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-100 text-gray-600">
                  <tr>
                    <th className="px-2 py-1">#</th>
                    <th className="px-2 py-1">Squadra</th>
                    <th className="px-2 py-1">Pt</th>
                    <th className="px-2 py-1">G</th>
                    <th className="px-2 py-1">GF</th>
                    <th className="px-2 py-1">GS</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team) => (
                    <tr key={team.team.id} className="border-b text-black">
                      <td className="px-2 py-1 font-medium">{team.rank}</td>
                      <td className="px-2 py-1 flex items-center gap-2">
                        <img
                          src={team.team.logo}
                          alt=""
                          className="w-5 h-5 object-contain"
                        />
                        {team.team.name}
                      </td>
                      <td className="px-2 py-1">{team.points}</td>
                      <td className="px-2 py-1">{team.all.played}</td>
                      <td className="px-2 py-1">{team.all.goals.for}</td>
                      <td className="px-2 py-1">{team.all.goals.against}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}
