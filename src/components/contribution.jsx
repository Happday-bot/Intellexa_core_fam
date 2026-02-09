import { useState, useEffect } from "react";
import { baseurl } from "../data/url";
import { motion } from "framer-motion";

export default function Contributions() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch(`${baseurl}/teams/stats`)
      .then((res) => res.json())
      .then((data) => setTeams(data));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display">
            Team <span className="text-gradient">Contributions</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Recognizing the efforts and impact of every team member towards our collective goals.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {teams.map((team, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-effect rounded-3xl shadow-premium border border-white/40 overflow-hidden"
            >
              {/* Team Header */}
              <div
                className={`bg-gradient-to-r ${team.color} p-6 text-white flex justify-between items-center shadow-lg`}
              >
                <h2 className="text-2xl font-bold font-display">{team.name}</h2>
                <span className="text-sm font-bold bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/20">
                  {team.totalEvents} Events
                </span>
              </div>

              {/* Member Contributions */}
              <div className="p-8">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-6">Member Impacts</p>
                <ul className="space-y-6">
                  {team.members.map((m, idx) => {
                    const percent = Math.round((m.events / team.totalEvents) * 100);
                    return (
                      <li key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="font-extrabold text-slate-700">{m.name}</span>
                          <span className="text-indigo-600 font-black">{m.events}</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner ring-1 ring-slate-200">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percent}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={`h-full bg-gradient-to-r ${team.color} rounded-full shadow-lg`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
