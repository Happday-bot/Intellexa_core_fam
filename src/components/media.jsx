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
import { ArrowUp, ArrowDown, ArrowLeftRight } from "lucide-react";
import { getMediaStats } from "../data/bootstrapStore";
import { getCred } from "./auth/auth";
import { baseurl } from "../data/url";

const MediaTeamDashboard = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ instagram: "", linkedin: "", youtube: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  // Fetch stats (unchanged)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = getMediaStats();
        setData(result.stats);

        const monthExists = result.stats?.some(
          (entry) => entry.month === currentMonth && entry.year === currentYear
        );
        setShowForm(!monthExists);
      } catch (err) {
      }
    };
    fetchStats();
  }, []);

  const handleChangeStats = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitStats = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!formData.instagram || !formData.linkedin || !formData.youtube) {
      setIsSubmitting(false);
      return;
    }

    const newEntry = {
      month: currentMonth,
      year: currentYear,
      instagram: parseInt(formData.instagram),
      linkedin: parseInt(formData.linkedin),
      youtube: parseInt(formData.youtube),
    };

    try {
      const res = await fetch(`${baseurl}/stats/media/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error("Failed to submit stat");

      const response = await res.json();
      setData(response.updated_data.stat);
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const latest = data[data.length - 1] || {};
  const previous = data[data.length - 2] || {};

  const getTrend = (current, previous) => {
    if (!previous) return "neutral";
    if (current > previous) return "up";
    if (current < previous) return "down";
    return "neutral";
  };

  const renderArrow = (trend) => {
    if (trend === "up") return <ArrowUp className="inline text-black-600 ml-2" size={50} strokeWidth={3} />;
    if (trend === "down") return <ArrowDown className="inline text-black-600 ml-2" size={50} strokeWidth={3} />;
    return <ArrowLeftRight className="inline text-black-500 ml-2" size={50} strokeWidth={3} />;
  };

  const instagramTrend = getTrend(latest.instagram, previous.instagram);
  const linkedinTrend = getTrend(latest.linkedin, previous.linkedin);
  const youtubeTrend = getTrend(latest.youtube, previous.youtube);
  const user = getCred();

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📊 Media Team Dashboard
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {user.name} 👋</h2>

        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Update Monthly Social Media Stats ({currentMonth})
            </h2>
            <form onSubmit={handleSubmitStats} className="space-y-4">
              {["instagram", "linkedin", "youtube"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChangeStats}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                    required
                  />
                </div>
              ))}
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

        {/* Stats & Chart (unchanged) */}
        {!showForm && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { title: "Instagram Followers", value: latest.instagram, trend: instagramTrend, color: "from-pink-400 to-pink-600", iconColor: "#eeff00ff" },
                { title: "LinkedIn Followers", value: latest.linkedin, trend: linkedinTrend, color: "from-blue-400 to-blue-600", iconColor: "#0A66C2" },
                { title: "YouTube Subscribers", value: latest.youtube, trend: youtubeTrend, color: "from-red-400 to-red-600", iconColor: "#FF0000" },
              ].map((stat) => (
                <div
                  key={stat.title}
                  className={`bg-gradient-to-r ${stat.color} text-white shadow-lg rounded-2xl p-6 flex flex-col justify-between`}
                >
                  <h3 className="text-sm md:text-base font-semibold">{stat.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                    <span>{renderArrow(stat.trend)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Growth Chart */}
            <div className="bg-white shadow-2xl rounded-2xl p-6 border border-gray-100 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
                  📈 Monthly Growth Overview
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey={(entry) =>
                      `${entry.month.slice(0, 3)} '${entry.year.toString().slice(-2)}`
                    }
                    tick={{ fontSize: 12, fill: "#4b5563" }}
                  />
                  <YAxis tick={{ fill: "#4b5563" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #d1d5db" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="linkedin" stroke="#0A66C2" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>

        )}

      </div>
    </>
  );
};

export default MediaTeamDashboard;
