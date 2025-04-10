"use client";

import { useEffect, useState } from "react";

export default function MatchInjuries({ fixtureId }) {
  const [injuries, setInjuries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInjuries() {
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/injuries?fixture=${fixtureId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
            },
            cache: "no-store",
          }
        );
        const data = await res.json();
        setInjuries(data.response || []);
      } catch (error) {
        console.error("Errore nel recupero infortuni:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInjuries();
  }, [fixtureId]);

  if (loading) return null;
  if (injuries.length === 0)
    return (
      <div className="bg-white rounded-xl shadow p-4 text-center text-sm text-gray-700">
        <p>Infortuni non disponibili</p>
      </div>
    );

  const groupedByTeam = injuries.reduce((acc, injury) => {
    if (!acc[injury.team.name])
      acc[injury.team.name] = { logo: injury.team.logo, players: [] };
    acc[injury.team.name].players.push(injury);
    return acc;
  }, {});

  const teams = Object.keys(groupedByTeam);

  if (teams.length === 0)
    return (
      <div className="bg-white rounded-xl shadow p-4  text-sm text-gray-700">
        <p>Infortuni non disponibili</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow p-4  text-sm text-gray-700">
      <h2 className="text-lg font-bold mb-3  text-red-600">Infortuni</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((teamName, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center  gap-2 mb-4">
              <img
                src={groupedByTeam[teamName].logo}
                alt={teamName}
                className="w-6 h-6 object-contain"
                loading="lazy"
              />
              <h3 className="text-md font-semibold text-gray-600">
                {teamName}
              </h3>
            </div>
            <ul className="space-y-3">
              {groupedByTeam[teamName].players.map((injury, i) => (
                <li key={i} className="flex items-center  gap-3">
                  <img
                    src={injury.player.photo}
                    alt={injury.player.name}
                    className="w-8 h-8 object-cover rounded-full"
                    loading="lazy"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">
                      {injury.player.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {injury.player.reason}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
