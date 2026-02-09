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
import { getDesignStats, getEvents, refetchEvents } from "../data/bootstrapStore";
import { getCred } from "./auth/auth";
import { baseurl } from "../data/url";

const DesignTeamDashboard = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ posters: "" });
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [savingIds, setSavingIds] = useState([]);
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

  // ✅ Fetch Events (simplified)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const user_info = getCred();
        if (!user_info) {
          return;
        }
        const data = await getEvents();
        const pastLimit = new Date();
        pastLimit.setMonth(pastLimit.getMonth() - 6); // 6 months ago

        // Filter events that are too far in the past
        const recentEvents = data.events.filter(
          (event) => new Date(event.eventDate) >= pastLimit
        );

        // Then sort descending by eventDate
        const sortedEvents = recentEvents.sort(
          (a, b) => new Date(b.eventDate) - new Date(a.eventDate)
        );


        setEvents(sortedEvents);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

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

  // ✅ Event Handling (simplified)
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleChange = async (id, field, file) => {
    if (!(file instanceof File)) return;
    const base64String = await fileToBase64(file);

    setEvents((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: base64String } : e))
    );
  };

  const handleSubmitEvent = async (id) => {
    const eventToUpdate = events.find((e) => e._id === id);
    if (!eventToUpdate) return;

    setSavingIds((prev) => [...prev, id]);

    try {

      const updatedPayload = {
      ...eventToUpdate,
      progressIndex: 3, // <–– new field injected into the update lifecycle
    };

      const res = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      if (!res.ok) throw new Error("Failed to update event");

      const data = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? data.data : e))
      );
    } finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
      refetchEvents();
    }
  };

  if (loadingEvents) return <p className="p-8">Loading events...</p>;
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


        {/* Event Forms */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-4 border-indigo-600 pb-2">
            🎯 All Events
          </h1>

          {events.map((event) => {
            const isSaving = savingIds.includes(event._id);

            return (

              <div
                key={event._id}
                className="bg-white shadow-md rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto"
              >
                {/* Left: Event details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                      {event.eventName}
                    </h2>
                    <p className="text-base text-gray-500 mb-2">
                      <strong>Organiser:</strong> {event.organiser}
                    </p>
                    <p className="text-base text-gray-500 mb-2">
                      <strong>Proposed By:</strong> {event.proposed_by}
                    </p>
                    <p className="text-base text-gray-500 mb-3">
                      <strong>Event Date:</strong> {event.eventDate}
                    </p>
                  </div>

                  {/* <div className="flex flex-wrap gap-4 mt-6">
      {[
        { label: "Proposal", icon: "📄", link: event.proposal },
        { label: "Media", icon: "🧾", link: event.mediaFile },
        { label: "Form", icon: "📝", link: event.formLink },
        { label: "Meet", icon: "💻", link: event.meetLink },
      ].map((btn) => (
        <a
          key={btn.label}
          href={btn.link}
          download={btn.label === "Proposal" || btn.label === "Media"}
          target={btn.label !== "Proposal" && btn.label !== "Media" ? "_blank" : undefined}
          rel="noreferrer"
          className="px-4 py-2 text-base bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition"
        >
          {btn.icon} {btn.label}
        </a>
      ))}
    </div> */}
                  <div className="flex flex-wrap gap-4 mt-6">
                    {[
                      { label: "Proposal", icon: "📄", link: event.proposal },
                      { label: "Marketting", icon: "🧾", link: event.marketingFile },
                      { label: "Form", icon: "📝", link: event.formLink },
                      { label: "Meet", icon: "💻", link: event.meetLink },
                    ].map((btn) => {
                      const isEnabled = !!btn.link; // check if link exists
                      return (
                        <a
                          key={btn.label}
                          href={isEnabled ? btn.link : undefined}
                          download={isEnabled && (btn.label === "Proposal" || btn.label === "Media")}
                          target={isEnabled && btn.label !== "Proposal" && btn.label !== "Media" ? "_blank" : undefined}
                          rel="noreferrer"
                          className={`px-4 py-2 text-lg rounded-xl transition flex items-center justify-center
          ${isEnabled
                              ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none"
                            }`}
                        >
                          {btn.icon} {btn.label}
                        </a>
                      );
                    })}
                  </div>

                </div>

                {/* Right: Media previews & submit */}
                <div className="flex flex-col gap-6 md:w-1/2">
                  <div className="flex gap-6 overflow-x-auto">
                    {["banner", "posterWhatsapp", "posterInsta"].map((field) => (
                      <div key={field} className="flex flex-col gap-3 min-w-[150px]">
                        <label className="text-base text-gray-600">
                          {event[field]
                            ? `Change ${field}`
                            : field === "banner"
                              ? "Banner"
                              : field === "posterWhatsapp"
                                ? "Poster WhatsApp"
                                : "Poster Instagram"}
                        </label>
                        {event[field] && (
                          <img
                            src={event[field]}
                            alt="Preview"
                            className="w-40 h-42 object-cover  border"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleChange(event._id, field, e.target.files[0])
                          }
                          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
                          disabled={isSaving}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubmitEvent(event._id)}
                    disabled={isSaving}
                    className={`mt-4 w-full py-3 rounded-lg font-semibold text-white ${!isSaving
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-gray-300 cursor-not-allowed text-gray-600"
                      }`}
                  >
                    {isSaving ? "Saving..." : "Submit / Update Form"}
                  </button>
                  
                </div>
              </div>


            );
          })}
        </div>

      </div>
    </>
  );
};

export default DesignTeamDashboard;
