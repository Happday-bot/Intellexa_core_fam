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
import { getEvents,getMediaStats, refetchEvents } from "../data/bootstrapStore";
import { getCred } from "./auth/auth";
import { baseurl } from "../data/url";

const MediaTeamDashboard = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ instagram: "", linkedin: "", youtube: "" });
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [savingIds, setSavingIds] = useState([]);
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
  },[]);

  // Fetch Events (simplified: load all without any conditions)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const data = await getEvents()
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

  const handleChangeEvent = (id, field, value) => {
    setEvents((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmitEvent = async (e, id) => {
    e.preventDefault();
    const eventToUpdate = events.find((e) => e._id === id);
    if (!eventToUpdate) return;

    // Only send editable link fields
    const editableFields = ["preInstagram", "preLinkedin", "preYoutube", "postInstagram", "postLinkedin", "postYoutube"];
    const payload = {};
    editableFields.forEach((field) => {
      payload[field] = eventToUpdate[field]??""; // or "" if backend accepts empty string
    });

    payload.progressIndex = 5;

    setSavingIds((prev) => [...prev, id]);
    try {
      const res = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update event");
      const data = await res.json();
      setEvents((prev) => prev.map((e) => (e._id === id ? data.data : e)));
    } finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
      refetchEvents();
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

  if (loadingEvents) return <p className="p-8">Loading events...</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ­ƒôè Media Team Dashboard
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {user.name} ­ƒæï</h2>

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
                  ­ƒôê Monthly Growth Overview
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

        {/* Event Forms: display all events without filtering */}
        <div className="flex flex-col gap-6 w-full px-4 py-6 bg-gray-50 ">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-b-4 border-indigo-600 pb-2">
            ­ƒÄ» All Events
          </h1>
          <h3>If you had to face any error in saving the form that has prefilled data, please try to fill all the fields once again and try submit</h3>

          {events.map((event) => {
            const isSaving = savingIds.includes(event._id);

            return (
              <form
                key={event._id}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all w-full"
                onSubmit={(e) => handleSubmitEvent(e, event._id)}
                noValidate
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between  gap-2 mb-4 border-b pb-3 border-gray-100">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-800">{event.eventName}</h1>
                    <p className="text-sm text-gray-500">
                      <strong>Organiser:</strong> {event.organiser}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Event Date:</strong> {event.eventDate}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Proposed By:</strong> {event.proposed_by}
                    </p>
                  </div>
                  <div>

                    <div className="flex-shrink-0 w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {event.posterWhatsapp ? (
                        <img
                          src={event.posterWhatsapp}
                          alt={event.eventName}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <p className="text-sm text-gray-500 text-center px-2">
                          The image will be uploaded soon by the design team.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["preInstagram", "preLinkedin", "preYoutube", "postInstagram", "postLinkedin", "postYoutube"].map((field) => (
                    <div key={field} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-600 mb-1">
                        {field.includes("pre") ? "Pre-" : "Post-"} {field.replace(/pre|post/, "")} Link {field.includes("Youtube") ? "(optional)" : "*"}
                      </label>
                      <input
                        type="url"
                        name={field}
                        value={event[field] || ""}
                        onChange={(e) => handleChangeEvent(event._id, field, e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                        disabled={isSaving}
                        required={!(field.includes("Youtube") || field.includes("pre"))}
                      />
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${!isSaving
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  >
                    {isSaving ? "Saving..." : "Submit"}
                  </button>
                </div>
              </form>
            );
          })}
        </div>

      </div>
    </>
  );
};

export default MediaTeamDashboard;
