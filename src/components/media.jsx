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
import { ArrowUp, ArrowDown, ArrowLeftRight, Link, Save, Loader2, Calendar, User, Info } from "lucide-react";
import { getMediaStats, getEvents, refetchEvents, refetchStats, subscribe } from "../data/bootstrapStore";
import { baseurl } from "../data/url";
import { motion, AnimatePresence } from "framer-motion";

const MediaTeamDashboard = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ instagram: "", linkedin: "", youtube: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [savingIds, setSavingIds] = useState([]);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const update = () => {
      const stats = getMediaStats();
      if (stats?.stats) {
        setData(stats.stats);
        const monthExists = stats.stats.some(
          (entry) => entry.month === currentMonth && entry.year === currentYear
        );
        setShowForm(!monthExists);
      }
      setEvents(getEvents() || []);
    };
    update();
    return subscribe(update);
  }, [currentMonth, currentYear]);

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
      const response = await fetch(`${baseurl}/stats/media/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
        credentials: "include"
      });
      if (!response.ok) throw new Error("Failed to submit stat");

      const result = await response.json();
      setData(result.updated_data.stat);
      setShowForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeEvent = (id, field, value) => {
    setEvents((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmitEvent = async (e, id) => {
    e.preventDefault();
    const eventToUpdate = events.find((e) => e._id === id);
    if (!eventToUpdate) return;

    const editableFields = ["preInstagram", "preLinkedin", "preYoutube", "postInstagram", "postLinkedin", "postYoutube"];
    const payload = {};
    editableFields.forEach((field) => {
      payload[field] = eventToUpdate[field] ?? "";
    });

    payload.progressIndex = 5;

    setSavingIds((prev) => [...prev, id]);
    try {
      const response = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        setEvents((prev) => prev.map((e) => (e._id === id ? result.data : e)));
        await refetchEvents();
        await refetchStats(); // SYNC MAIN DASHBOARD
      } else {
        throw new Error("Failed to update event");
      }
    } finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
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
    if (trend === "up") return <ArrowUp className="inline text-emerald-500 ml-2" size={24} strokeWidth={3} />;
    if (trend === "down") return <ArrowDown className="inline text-rose-500 ml-2" size={24} strokeWidth={3} />;
    return <ArrowLeftRight className="inline text-slate-400 ml-2" size={24} strokeWidth={3} />;
  };

  const instagramTrend = getTrend(latest.instagram, previous.instagram);
  const linkedinTrend = getTrend(latest.linkedin, previous.linkedin);
  const youtubeTrend = getTrend(latest.youtube, previous.youtube);
  const { auth: user } = useAuth();

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 font-display text-gradient">
            Media Team Dashboard
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
              Update Monthly Stats <span className="text-indigo-500">({currentMonth})</span>
            </h2>
            <form onSubmit={handleSubmitStats} className="space-y-6">
              {["instagram", "linkedin", "youtube"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                    {field}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChangeStats}
                    className="w-full bg-white/50 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold text-slate-700"
                    placeholder={`Enter ${field} count`}
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${isSubmitting
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "premium-gradient text-white hover:scale-[1.02] active:scale-[0.98] shadow-indigo-200"
                  }`}
              >
                {isSubmitting ? "Syncing..." : "Submit Monthly Data"}
              </button>
            </form>
          </motion.div>
        )}

        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Instagram Followers", value: latest.instagram, trend: instagramTrend, color: "from-pink-500 to-rose-500", icon: "📸" },
                { title: "LinkedIn Followers", value: latest.linkedin, trend: linkedinTrend, color: "from-blue-500 to-indigo-600", icon: "💼" },
                { title: "YouTube Subscribers", value: latest.youtube, trend: youtubeTrend, color: "from-red-500 to-rose-600", icon: "🎥" },
              ].map((stat) => (
                <motion.div
                  key={stat.title}
                  whileHover={{ y: -5 }}
                  className="glass-effect rounded-3xl p-8 shadow-premium border border-white/40 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`} />
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{stat.title}</p>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-4xl font-black text-slate-800 font-display tracking-tight">{stat.value}</p>
                    {renderArrow(stat.trend)}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-3xl p-8 border border-white/40 shadow-premium"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                <h2 className="text-2xl font-bold text-slate-800 font-display">
                  Monthly Growth Overview
                </h2>
              </div>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
                    <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={4} dot={{ r: 6, fill: "#E1306C", strokeWidth: 3, stroke: "#fff" }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="linkedin" stroke="#0077B5" strokeWidth={4} dot={{ r: 6, fill: "#0077B5", strokeWidth: 3, stroke: "#fff" }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={4} dot={{ r: 6, fill: "#FF0000", strokeWidth: 3, stroke: "#fff" }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Event Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-1.5 h-8 bg-rose-500 rounded-full" />
                  <h2 className="text-3xl font-bold text-slate-800 font-display">Live Event Track</h2>
                </div>
                {loadingEvents && <Loader2 className="animate-spin text-slate-400" size={24} />}
              </div>

              <div className="grid grid-cols-1 gap-8">
                {events.map((event, idx) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-effect rounded-[2.5rem] p-8 border border-white/40 shadow-premium overflow-hidden group"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Event Info */}
                      <div className="lg:w-1/3 space-y-4">
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 shadow-inner group-hover:shadow-indigo-100 transition-all">
                          {event.posterWhatsapp ? (
                            <img src={event.posterWhatsapp} alt={event.eventName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3">
                                <Info className="text-slate-300" size={24} />
                              </div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">Asset Pending Design Approval</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-slate-800 leading-tight">{event.eventName}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-wider">
                              <User size={12} className="mr-1.5" /> {event.organiser}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-wider">
                              <Calendar size={12} className="mr-1.5" /> {event.eventDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Links Form */}
                      <form onSubmit={(e) => handleSubmitEvent(e, event._id)} className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                          {["preInstagram", "postInstagram", "preLinkedin", "postLinkedin", "preYoutube", "postYoutube"].map((field) => (
                            <div key={field} className="space-y-2">
                              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                                <Link size={12} className="mr-2" />
                                {field.includes("pre") ? "Pre-Release" : "Post-Event"} {field.replace(/pre|post/, "")}
                              </label>
                              <input
                                type="url"
                                value={event[field] || ""}
                                onChange={(e) => handleChangeEvent(event._id, field, e.target.value)}
                                className="w-full bg-white/40 border border-slate-200 px-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none font-semibold text-slate-700 placeholder:text-slate-300"
                                placeholder="Paste link here..."
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={savingIds.includes(event._id)}
                            className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-black transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${savingIds.includes(event._id)
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                              : "premium-gradient text-white shadow-indigo-100"
                              }`}
                          >
                            {savingIds.includes(event._id) ? (
                              <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <Save size={20} />
                                <span>Update Event Track</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MediaTeamDashboard;
