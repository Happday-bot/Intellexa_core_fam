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
    <>
      <div className="min-h-screen bg-gray-50 px-16 pt-14">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎨 Design Team Dashboard
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {user.name} 👋</h2>

        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto border border-gray-200 mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Update Monthly Poster Stats ({currentMonth})
            </h2>
            <form onSubmit={handleSubmitStats} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Poster Count
                </label>
                <input
                  type="number"
                  name="posters"
                  value={formData.posters}
                  onChange={handleChangeStats}
                  className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-2 rounded-lg transition ${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
              >
                {isSubmitting ? "Saving..." : "Submit Data"}
              </button>
            </form>
          </div>
        )}

        {/* Graph remains unchanged */}
        <div className="bg-white shadow-2xl rounded-2xl p-6 border border-gray-100 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-700 flex items-center gap-2">
              📊 Monthly Poster Count Overview
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
              <XAxis
                dataKey={(entry) =>
                  `${entry.month.slice(0, 3)} '${entry.year.toString().slice(-2)}`
                }
                tick={{ fontSize: 12, fill: "#4b5563" }}
              />
              <YAxis tick={{ fill: "#4b5563" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  padding: "8px",
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="posters"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#6366F1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  );
};

export default DesignTeamDashboard;
