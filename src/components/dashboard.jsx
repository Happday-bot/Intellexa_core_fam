import { useEffect, useState } from "react";
import MediaStatsGraph from "./mediastat.jsx";
import DesignStats from "./designstat.jsx";
import EventStatsGraph from "./eventstat.jsx";
import { getstats, subscribe } from "../data/bootstrapStore.js";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    youtube: 0,
    insta: 0,
    linkedin: 0
  });

  useEffect(() => {
    const update = () => {
      const data = getstats();
      if (data) {
        setCounts({
          total: data.total_events || 0,
          completed: data.completed || 0,
          youtube: data.youtube || 0,
          insta: data.insta || 0,
          linkedin: data.linkedin || 0
        });
      }
    };

    update();
    return subscribe(update); // Subscribe to changes
  }, []);

  const stats = [
    { title: "Total Events", value: counts.total, icon: "🎯", color: "from-blue-500 to-indigo-600" },
    { title: "Completed", value: counts.completed, icon: "✅", color: "from-emerald-500 to-teal-600" },
    { title: "Pending", value: counts.total - counts.completed, icon: "⏳", color: "from-amber-500 to-orange-600" },
    { title: "WhatsApp Members", value: "4171+", icon: "💬", color: "from-green-500 to-emerald-600" },
    { title: "Insta Followers", value: counts.insta, icon: "📸", color: "from-pink-500 to-rose-600" },
    { title: "LinkedIn Followers", value: counts.linkedin, icon: "💼", color: "from-sky-500 to-blue-600" },
    { title: "YouTube Subs", value: counts.youtube, icon: "🎥", color: "from-red-500 to-rose-600" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display">
            Dashboard <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">
            Project and team performance metrics at a glance. Real-time data visualization and growth tracking.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-effect rounded-3xl p-6 shadow-premium border border-white/40 flex items-center space-x-5"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg ring-4 ring-white/30`}>
                {item.icon}
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{item.title}</p>
                <p className="text-2xl font-extrabold text-slate-800 font-display">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8 shadow-premium border border-white/40"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-slate-800 font-display">Event Analytics</h2>
                <p className="text-slate-500 text-sm">Monthly event completion trends</p>
              </div>
            </div>
            <div className="h-[400px]">
              <EventStatsGraph />
            </div>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-3xl p-8 shadow-premium border border-white/40"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-2 font-display">Media Growth</h2>
              <p className="text-slate-500 mb-8 text-sm italic">Multi-platform social performance</p>
              <div className="h-[350px]">
                <MediaStatsGraph />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-effect rounded-3xl p-8 shadow-premium border border-white/40"
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-2 font-display">Design Productivity</h2>
              <p className="text-slate-500 mb-8 text-sm italic">Monthly asset output tracking</p>
              <div className="h-[350px]">
                <DesignStats />
              </div>
            </motion.section>
          </div>
        </div>

        {/* Interests & Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8 shadow-premium border border-white/40"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-display">Domain Interests</h2>
            <p className="text-slate-500 mb-8">Member interest across technological domains</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Quantum", val: "40%", grad: "from-indigo-500 to-indigo-600" },
                { name: "AI & ML", val: "30%", grad: "from-purple-500 to-purple-600" },
                { name: "Web Dev", val: "20%", grad: "from-sky-500 to-blue-600" },
                { name: "Security", val: "10%", grad: "from-rose-500 to-pink-600" },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${item.grad} text-white shadow-lg`}>
                  <p className="text-white/80 text-xs font-bold uppercase">{item.name}</p>
                  <p className="text-3xl font-extrabold mt-1">{item.val}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-8 shadow-premium border border-white/40"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-display">Engagement Forecast</h2>
            <p className="text-slate-500 mb-8">Engagement levels across potential event types</p>
            <div className="space-y-6">
              {[
                { name: "Hackathons", val: 90, color: "bg-indigo-500" },
                { name: "Webinars", val: 75, color: "bg-purple-500" },
                { name: "Workshops", val: 60, color: "bg-rose-500" },
                { name: "Networking", val: 45, color: "bg-sky-500" },
              ].map((e, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-700">{e.name}</span>
                    <span className="text-sm font-extrabold text-slate-400">{e.val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${e.val}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className={`h-full ${e.color} rounded-full shadow-lg`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
