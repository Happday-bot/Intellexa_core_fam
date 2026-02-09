import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDesignStats } from "../data/bootstrapStore";
import { getCred } from "./auth/auth";
import { baseurl } from "../data/url";
import { motion } from "framer-motion";

const DesignTeamDashboard = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ posters: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  // ✅ Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = getDesignStats();
        setData(result.stats);

        const monthExists = result.stats?.some(
          (entry) => entry.month === currentMonth && entry.year === currentYear
        );
        setShowForm(!monthExists);
      } catch (err) {

      }
    };
    fetchStats();
  }, [currentMonth, currentYear]);

  const handleChangeStats = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Submit Poster Data (unchanged)
  const handleSubmitStats = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.posters) {
      setIsSubmitting(false);
      return;
    }

    const newEntry = {
      month: currentMonth,
      year: currentYear,
      posters: parseInt(formData.posters),
    };

    try {
      const res = await fetch(`${baseurl}/stats/design/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!res.ok) throw new Error("Failed to submit design data");

      const response = await res.json();
      setData(response.updated_data.stat);
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = getCred();

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 font-display">
            Design Team <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Welcome Back, {user.name} 👋</p>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-3xl p-8 max-w-xl mx-auto border border-white/40 shadow-premium mb-12"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 font-display">
              Update Monthly Output <span className="text-indigo-500">({currentMonth})</span>
            </h2>
            <form onSubmit={handleSubmitStats} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  Posters Created
                </label>
                <input
                  type="number"
                  name="posters"
                  value={formData.posters}
                  onChange={handleChangeStats}
                  className="w-full bg-white/50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                  placeholder="Enter number of posters"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${isSubmitting
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "premium-gradient text-white hover:scale-[1.02] active:scale-[0.98] shadow-indigo-200"
                  }`}
              >
                {isSubmitting ? "Syncing..." : "Submit Stat"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Graph remains unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 border border-white/40 shadow-premium"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
            <h2 className="text-2xl font-bold text-slate-800 font-display">
              Monthly Poster Count Overview
            </h2>
          </div>

          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey={(entry) => `${entry.month.slice(0, 3)} '${entry.year.toString().slice(-2)}`}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                <Line
                  type="monotone"
                  dataKey="posters"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  dot={{ r: 6, fill: "#8b5cf6", strokeWidth: 3, stroke: "#fff" }}
                  activeDot={{ r: 10, fill: "#7c3aed" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DesignTeamDashboard;
