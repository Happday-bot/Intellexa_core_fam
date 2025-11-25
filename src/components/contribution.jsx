import { useState,useEffect } from "react";
import { baseurl } from "../data/url";

export default function Contributions() {
  const [teams,setTeams] = useState([])

  useEffect(() => {
  fetch(`${baseurl}/teams/stats`)
    .then(res => res.json())
    .then(data => setTeams(data));
}, []);

  return (
    <div>
        <div id="contribution" className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Team Contributions Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teams.map((team, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Team Header */}
              <div
                className={`bg-gradient-to-r ${team.color} rounded-t-2xl p-5 text-white flex justify-between items-center`}
              >
                <h2 className="text-xl font-semibold">{team.name}</h2>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {team.totalEvents} Events
                </span>
              </div>

              {/* Member Contributions */}
              <div className="p-6">
                <p className="text-gray-600 font-medium mb-4">Member Contributions:</p>
                <ul className="space-y-4">
                  {team.members.map((m, idx) => {
                    const percent = Math.round((m.events / team.totalEvents) * 100);
                    return (
                      <li key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-gray-700">{m.name}</span>
                          <span className="text-indigo-600 font-bold">{m.events}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${team.color} rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
