"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

const COLORS = ["#3b82f6", "#facc15", "#ef4444"];

const statLabels = {
  form: "Forma",
  att: "Attacco",
  def: "Difesa",
  poisson_distribution: "Distribuzione Poisson",
  h2h: "Scontri diretti",
  goals: "Gol",
};

export default function MatchPredictionCard({ fixtureId }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await fetch(
          `https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "v3.football.api-sports.io",
              "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
            },
          }
        );
        const data = await res.json();

        console.log(data);
        setPrediction(data.response?.[0] || null);
      } catch (error) {
        console.error("Errore nel recupero delle previsioni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [fixtureId]);

  if (loading)
    return (
      <p className="text-center text-sm text-gray-500">
        Caricamento previsioni...
      </p>
    );
  if (!prediction || !prediction.predictions)
    return (
      <p className="bg-white rounded-xl shadow p-4 text-center text-sm text-gray-700">
        Nessuna previsione disponibile.
      </p>
    );

  const { winner, percent, advice, under_over, goals } = prediction.predictions;

  const { comparison, teams } = prediction;

  const chartData = [
    { name: "Casa", value: parseInt(percent.home), fill: COLORS[0] },
    { name: "Pareggio", value: parseInt(percent.draw), fill: COLORS[1] },
    { name: "Trasferta", value: parseInt(percent.away), fill: COLORS[2] },
  ];

  const comparisonKeys = Object.keys(comparison || {}).filter(
    (key) => key !== "total"
  );

  return (
    <div className="space-y-6">
      {/* Vincitore Previsto */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold text-blue-700 mb-1">
          Squadra favorita:
        </h3>
        <p className="text-md font-bold text-gray-800">
          {winner?.name || "N/A"}{" "}
          <span className="text-sm text-gray-500">
            ({winner?.comment || "-"})
          </span>
        </p>
      </div>

      {/* Percentuali con grafico lineare su una riga */}
      <div className="w-full h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="horizontal">
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confronto Statistiche */}
      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <h4 className="text-sm font-bold text-center text-gray-700 mb-3">
          Confronto Squadre
        </h4>
        <div className="grid grid-cols-3 text-sm text-center font-medium text-gray-600">
          <span>{teams.home.name}</span>
          <span>Statistica</span>
          <span>{teams.away.name}</span>
        </div>
        <div className="mt-2 divide-y">
          {comparisonKeys.map((key) => (
            <div
              key={key}
              className="grid grid-cols-3 text-sm text-center py-1 items-center"
            >
              <span className="text-gray-800">{comparison[key].home}</span>
              <span className="text-xs text-gray-500">
                {statLabels[key] || key}
              </span>
              <span className="text-gray-800">{comparison[key].away}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Previsioni */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded p-4 border shadow-sm">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">
            Under/Over Previsto
          </h4>
          <p className="text-md font-bold text-blue-600">{under_over ?? "-"}</p>
        </div>
        <div className="bg-white rounded p-4 border shadow-sm">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">
            Gol previsti
          </h4>
          <p className="text-sm text-gray-700">
            Casa: <span className="font-semibold">{goals.home}</span> <br />
            Trasferta: <span className="font-semibold">{goals.away}</span>
          </p>
        </div>
      </div>

      {/* Consiglio */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
        <h4 className="text-sm text-green-700 font-semibold">Consiglio:</h4>
        <p className="text-md text-gray-700 font-medium">{advice || "N/A"}</p>
      </div>
    </div>
  );
}
