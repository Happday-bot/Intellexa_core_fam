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
import { Loader2, Upload, FileText, Image, CheckCircle, ExternalLink, Calendar, User, Save } from "lucide-react";
import { getDesignStats, getEvents, refetchEvents } from "../data/bootstrapStore";
import { useAuth } from "./auth/authcontext";
import { baseurl } from "../data/url";
import { motion, AnimatePresence } from "framer-motion";

const DesignTeamDashboard = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ posters: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [savingIds, setSavingIds] = useState([]);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  // Fetch Stats and Events
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const update = () => {
      const stats = getDesignStats();
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

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (id, field, file) => {
    if (!(file instanceof File)) return;
    try {
      const base64String = await fileToBase64(file);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, [field]: base64String } : e))
      );
    } catch (err) {
      console.error("File conversion failed", err);
    }
  };

  const handleSubmitEvent = async (id) => {
    const eventToUpdate = events.find((e) => e._id === id);
    if (!eventToUpdate) return;

    setSavingIds((prev) => [...prev, id]);

    try {
      const updatedPayload = {
        ...eventToUpdate,
        progressIndex: 3,
      };

      const res = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) throw new Error("Failed to update event");

      const result = await res.json();
      setEvents((prev) => prev.map((e) => (e._id === id ? result.data : e)));
    } finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
      refetchEvents();
    }
  };

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
            Design Team Dashboard
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

        {/* Poster Count Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 border border-white/40 shadow-premium mb-12"
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
            <h2 className="text-2xl font-bold text-slate-800 font-display">
              Monthly Poster Count Overview
            </h2>
          </div>

          <div className="h-[400px]">
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

        {/* Creative Workflows Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-1.5 h-8 bg-fuchsia-500 rounded-full" />
              <h2 className="text-3xl font-bold text-slate-800 font-display">Creative Workflows</h2>
            </div>
            {loadingEvents && <Loader2 className="animate-spin text-slate-400" size={24} />}
          </div>

          <div className="grid grid-cols-1 gap-10">
            {events.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-effect rounded-[3rem] p-10 border border-white/40 shadow-premium flex flex-col xl:flex-row gap-12 group"
              >
                {/* Event Details & Resources */}
                <div className="xl:w-2/5 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-800 leading-tight group-hover:text-fuchsia-600 transition-colors">{event.eventName}</h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center px-4 py-1.5 bg-fuchsia-50 text-fuchsia-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-fuchsia-100">
                        <User size={14} className="mr-2" /> {event.organiser}
                      </span>
                      <span className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100">
                        <Calendar size={14} className="mr-2" /> {event.eventDate}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Proposal", icon: <FileText size={18} />, link: event.proposal },
                      { label: "Marketing", icon: <ExternalLink size={18} />, link: event.marketingFile },
                      { label: "Form", icon: <CheckCircle size={18} />, link: event.formLink },
                      { label: "Meet", icon: <Image size={18} />, link: event.meetLink },
                    ].map((resource) => {
                      const hasLink = !!resource.link;
                      return (
                        <a
                          key={resource.label}
                          href={hasLink ? resource.link : "#"}
                          target={hasLink ? "_blank" : undefined}
                          rel="noreferrer"
                          className={`flex items-center justify-center space-x-2 p-4 rounded-3xl transition-all border font-black text-sm ${hasLink
                            ? "bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 text-indigo-600"
                            : "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"
                            }`}
                        >
                          {resource.icon}
                          <span>{resource.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Assets Management */}
                <div className="flex-1 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {["banner", "posterWhatsapp", "posterInsta"].map((field) => (
                      <div key={field} className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block text-center">
                          {field === "banner" ? "Main Banner" : field === "posterWhatsapp" ? "WhatsApp Poster" : "IG Poster"}
                        </label>
                        <div className="relative aspect-[4/5] sm:aspect-square bg-slate-50 rounded-[2rem] overflow-hidden border border-slate-100 shadow-inner group/asset">
                          {event[field] ? (
                            <img src={event[field]} alt={field} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-8 text-center">
                              <Image size={32} className="text-slate-200" />
                            </div>
                          )}
                          <label className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center opacity-0 group-hover/asset:opacity-100 transition-opacity cursor-pointer p-4 text-center">
                            <Upload className="text-white mb-2" size={24} />
                            <span className="text-white text-xs font-black uppercase tracking-widest leading-relaxed">Change Asset</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(event._id, field, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSubmitEvent(event._id)}
                      disabled={savingIds.includes(event._id)}
                      className={`flex items-center space-x-3 px-10 py-4 rounded-[2rem] font-black tracking-widest uppercase text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] ${savingIds.includes(event._id)
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "premium-gradient text-white shadow-fuchsia-100"
                        }`}
                    >
                      {savingIds.includes(event._id) ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Finalizing...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>Push Design Updates</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DesignTeamDashboard;
