"use client";

import { useEffect, useState } from "react";

export default function MatchStatistics({ fixtureId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/fixtures/statistics?fixture=${fixtureId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
            },
          }
        );
        const data = await res.json();
        setStats(data.response || []);
      } catch (err) {
        console.error("Errore nel recupero delle statistiche", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [fixtureId]);

  if (loading) {
    return (
      <p className="text-center text-sm text-gray-500">
        Caricamento statistiche...
      </p>
    );
  }

  if (!stats.length || stats.length < 2) {
    return (
      <p className="bg-white rounded-xl shadow p-4 text-center text-sm text-gray-700">
        Statistiche non disponibili.
      </p>
    );
  }

  const teamA = stats[0];
  const teamB = stats[1];

  const formatValue = (value) => {
    if (value === null || value === undefined) return 0;
    return typeof value === "string" && value.includes("%")
      ? parseInt(value.replace("%", ""))
      : parseInt(value);
  };

  const mergedStats = teamA.statistics.map((stat, index) => {
    const homeVal = formatValue(stat.value);
    const awayVal = formatValue(teamB.statistics[index]?.value);
    const total = homeVal + awayVal || 1;
    return {
      type: stat.type,
      home: homeVal,
      away: awayVal,
      homePerc: Math.round((homeVal / total) * 100),
      awayPerc: Math.round((awayVal / total) * 100),
    };
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-bold text-gray-800 text-center">
        Statistiche Partita
      </h3>

      {mergedStats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-sm font-medium text-gray-800">
            <span>
              {stat.home}
              {stat.type.includes("%") ? "%" : ""}
            </span>
            <span className="text-center w-40 text-xs text-gray-600 font-semibold">
              {stat.type}
            </span>
            <span>
              {stat.away}
              {stat.type.includes("%") ? "%" : ""}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${stat.homePerc}%` }}
            ></div>
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${stat.awayPerc}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
