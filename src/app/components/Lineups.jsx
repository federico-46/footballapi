export default async function Lineups({ fixtureId }) {
  const headers = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key": "f4b3de62301622dfd39a455859d03ff8",
    },
    cache: "no-store",
  };

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures/lineups?fixture=${fixtureId}`,
    headers
  );

  const data = await res.json();
  const lineups = data.response || [];

  console.log(lineups);

  if (lineups.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-4 text-center text-sm text-gray-700">
        Formazioni non ancora disponibili.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 ">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 pb-2 text-center">
        Formazioni Ufficiali
      </h2>
      <div className="grid grid-cols-2 gap-6">
        {lineups.map((team, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-center items-center gap-2">
              <img
                src={team.team.logo}
                alt={team.team.name}
                className="w-5 h-5 object-contain"
              />
              <h3 className="text-sm  font-bold text-gray-700">
                {team.team.name} ({team.formation})
              </h3>
            </div>
            <ul className="text-sm text-center text-gray-700 pl-2">
              {team.startXI?.map((p, i) => (
                <li key={i} className="flex items-center justify-center gap-1">
                  <span className="font-semibold text-gray-800">
                    #{p.player.number}
                  </span>
                  <span>{p.player.name}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Allenatore: <strong>{team.coach.name}</strong>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
