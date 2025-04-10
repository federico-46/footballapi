"use client";

import { useEffect, useState } from "react";

export default function MatchOdds({ fixtureId }) {
  const [bookmakers, setBookmakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/odds?fixture=${fixtureId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
            },
          }
        );
        const data = await res.json();
        const allBookmakers = data.response?.[0]?.bookmakers || [];
        setBookmakers(allBookmakers);
      } catch (err) {
        console.error("Errore nel recupero delle quote", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, [fixtureId]);

  if (loading)
    return (
      <p className="text-center text-sm text-gray-500">Caricamento quote...</p>
    );

  if (!bookmakers.length)
    return (
      <p className="text-center text-sm text-gray-500">
        Quote non disponibili.
      </p>
    );

  const popularBets = ["Match Winner", "Double Chance", "Both Teams Score"];

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Quote Pre-Match (Comparazione)
      </h3>
      {popularBets.map((betName, index) => {
        const betValues = {};

        bookmakers.forEach((bookmaker) => {
          const bet = bookmaker.bets.find((b) => b.name === betName);
          if (bet) {
            betValues[bookmaker.name] = bet.values;
          }
        });

        const sortedEntries = Object.entries(betValues).sort((a, b) => {
          const avgA =
            a[1].reduce((acc, v) => acc + parseFloat(v.odd || 0), 0) /
            a[1].length;
          const avgB =
            b[1].reduce((acc, v) => acc + parseFloat(v.odd || 0), 0) /
            b[1].length;
          return avgB - avgA;
        });

        const topBookmakers = sortedEntries.slice(0, 5);
        const firstAvailable = topBookmakers[0]?.[1];
        if (!firstAvailable) return null;

        return (
          <div key={index} className="space-y-2">
            <h4 className="font-semibold text-gray-700 border-b pb-1 text-sm">
              {betName}
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="p-2 border">Bookmaker</th>
                    {firstAvailable.map((v, i) => (
                      <th key={i} className="p-2 border text-center">
                        {v.value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topBookmakers.map(([bookmakerName, values], idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 border font-medium text-gray-700">
                        {bookmakerName}
                      </td>
                      {values.map((v, vi) => (
                        <td
                          key={vi}
                          className="p-2 border text-center text-blue-600 font-semibold"
                        >
                          {v.odd}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
