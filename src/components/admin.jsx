import React, { useState, useEffect } from "react";
import { Users, Calendar, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCred } from "./auth/auth";
import { getEvents, getUsers, refetchEvents, refetchUsers } from "../data/bootstrapStore";
import { baseurl } from "../data/url";

// ================= Sidebar =================
const Sidebar = ({ selectedTab, setSelectedTab, pendingQueries }) => {
  const login_name = getCred().name;
  const tabs = [
    { id: "users", label: "Members", icon: <Users size={20} /> },
    { id: "events", label: "Events", icon: <Calendar size={20} /> },
    {
      id: "queries",
      label: `Queries${pendingQueries > 0 ? ` (${pendingQueries})` : ""}`,
      icon: <MessageSquare size={20} />,
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-gray-800 min-h-screen text-gray-100 flex flex-col shadow-lg">
      {/* Header */}
      <div className="px-3 py-6 border-b border-gray-700 items-center justify-center">
        <h1 className="text-xl font-extrabold tracking-wide text-white-400">
          Admin Dashboard
        </h1>
        <h2 className="text-2xl text-white-400 mb-2 mt-4">Welcome Back, <b className="text-2xl font-extrabold">{login_name}</b> 👋</h2>
      </div>

      {/* Tabs */}
      <ul className="flex-1 space-y-1 px-3">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setSelectedTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
            ${selectedTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <span className="text-indigo-400">{tab.icon}</span>
              <span className="flex-1 text-left font-medium">{tab.label}</span>
              {selectedTab === tab.id && (
                <span className="w-1.5 h-6 bg-indigo-400 rounded-full"></span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>

  );
};

// ================= Members Tab =================
const MembersTab = () => {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [roles] = useState(["Faculty Coordinator", "President", "Vice President", "Secretary", "Technical Lead", "Lead", "Co-Lead", "Core Member", "Yet to be set"]);
  const [teams] = useState([
    "AI",
    "App",
    "Backend",
    "Info Sec",
    "IOT",
    "Web",
    "Design",
    "Media",
    "Event",
    "Intellexa",
    "Yet to be set",
  ]);

  // Fetch users
  
      try {
        const data = getUsers();
        if(data){
          setUsers(data.users || []);
        }
        else{
          const fetchedUsers = refetchUsers();
          setUsers(fetchedUsers.users || []);
        }
      } catch (err) {
      }
  

  // Handle role/team changes locally
  const handleRoleChange = (id, role) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === id ? { ...user, role } : user))
    );
  };

  const handleTeamChange = (id, team) => {
    setUsers((prev) =>
      prev.map((user) => (user._id === id ? { ...user, team } : user))
    );
  };

  // Update user info
  const handleUpdate = async (id, updatedRole, updatedTeam) => {
    setLoadingId(id + "_update");
    try {
      const res = await fetch(`${baseurl}/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: updatedRole, team: updatedTeam }),
      });
      if (!res.ok) throw new Error("Failed to update user");
    }finally {
      setLoadingId(null);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    setLoadingId(id + "_delete");
    try {
      const res = await fetch(`${baseurl}/del/user/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u._id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Members Management
      </h2>

      {users.length ? (
        <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition w-full"
            >
              {/* Top Section - Name & Email */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 mb-4">
                <div className="w-full sm:w-2/3">
                  <h3
                    className="text-lg font-semibold text-gray-800 truncate"
                    title={u.name}
                  >
                    {u.name}
                  </h3>
                  <p
                    className="text-sm text-gray-600 truncate"
                    title={u.email}
                  >
                    {u.email}
                  </p>
                </div>
                <span className="mt-2 sm:mt-0 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize">
                  {u.role || "Member"}
                </span>
              </div>

              {/* Bottom Section - Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-2/3">
                  {/* Team Dropdown */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Team
                    </label>
                    <select
                      value={u.team || "Yet to be set"}
                      onChange={(e) => handleTeamChange(u._id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {teams.map((team) => (
                        <option key={team} value={team}>
                          {team}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Role Dropdown */}
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                      Role
                    </label>
                    <select
                      value={u.role || "Member"}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleUpdate(u._id, u.role, u.team)}
                    disabled={loadingId === u._id + "_update"}
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition ${loadingId === u._id + "_update"
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {loadingId === u._id + "_update" ? "Saving..." : "Update"}
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    disabled={loadingId === u._id + "_delete"}
                    className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition ${loadingId === u._id + "_delete"
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                  >
                    {loadingId === u._id + "_delete" ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 italic">
          No members found.
        </div>
      )}
    </div>

  );
};

// ================= Events Tab =================
const EventsTab = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("under approval");
  const tracks = [
    "Event Team",
    "Tech Lead",
    "Design Team",
    "Approval",
    "Pre/Post Media Team",
    "Approval",
    "Marketing",
    "Completed"
  ];
  const [savingIds, setSavingIds] = useState([]);

  const handleChangeEvent = (id, field, value) => {
    setEvents((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleSubmitEvent = async (id) => {
    const eventToUpdate = events.find((e) => e._id === id);
    if (!eventToUpdate) return;

    if (!eventToUpdate.marketingFile) {
      alert("Give url for marketting file");
      return;
    }

    setSavingIds((prev) => [...prev, id]);
    try {
      const res = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketingFile: eventToUpdate.marketingFile,
          venue: eventToUpdate.venue,
          eventDate: eventToUpdate.eventDate,
          time: eventToUpdate.time,
          status: "ongoing",
          progressIndex: 1
        }),
      });
      if (!res.ok) throw new Error("Failed to update event");
      const data = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? data.data : e))
      );
    }
    finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id));
      refetchEvents();
    }
  };

  const handleProgressUpdate = async (id, currentProgressIndex, delta) => {
    const newIndex = currentProgressIndex + delta;

    // Guardrail validation
    if (newIndex < 0 || newIndex>7) return;

    setSavingIds(prev => [...prev, id]);

    const payload = { progressIndex: newIndex };

    if (currentProgressIndex === 6 && delta === 1) {
      payload.status = "completed";
      try {
        await fetch(`${baseurl}/stats/events/increment`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
      }
    }

    try {
      const res = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update progress");

      const data = await res.json();

      setEvents(prev =>
        prev.map(e => (e._id === id ? data.data : e))
      );

    } finally {
      setSavingIds(prev => prev.filter(sId => sId !== id));
      refetchEvents();
    }
  };


  const handleSuggestionSubmit = async (id, suggestion) => {
    try {
      const res = await fetch(`${baseurl}/suggest/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion }),
      });
      if (!res.ok) throw new Error("Failed to submit suggestion");
      const data = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? data.data : e))
      );
    } catch (err) {

    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const user_info = getCred();
        if (!user_info) {
          return;
        }

        const data = await getEvents();
        setEvents(data.events || []);
      }finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categorize = (status) =>
    events.filter(
      (e) => e.status && e.status.toLowerCase() === status.toLowerCase()
    );

  const renderEventForm = (event) => (
    <div
      key={event._id}
      className="bg-white border border-indigo-200 rounded-xl shadow-sm p-4 mb-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h4 className="text-lg font-semibold text-indigo-700">
          {event.eventName || "Untitled Event"}
        </h4>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === "under approval"
            ? "bg-yellow-100 text-yellow-700"
            : event.status === "ongoing"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
            }`}
        >
          {event.status || "Unknown"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="font-medium text-gray-700">Organiser:</label>
          <p className="text-gray-900">{event.organiser || "—"}</p>
        </div>
        <div>
          <label className="font-medium text-gray-700">Proposed By:</label>
          <p className="text-gray-900">{event.proposed_by || "—"}</p>
        </div>
        <div>
          <label className="font-medium text-gray-700">Venue:</label>
          <input
            type="text"
            value={event.venue || ""}
            onChange={(e) => handleChangeEvent(event._id, "venue", e.target.value)}
            className="border px-2 py-1 rounded w-full text-sm"
          />
        </div>
        <div>
          <label className="font-medium text-gray-700">Whatsapp, Insta, Linkedin Marketting content:</label>
          <input
            type="url"
            value={event.marketingFile || ""}
            onChange={(e) => handleChangeEvent(event._id, "marketingFile", e.target.value)}
            className="border px-2 py-1 rounded w-full text-sm"
          />
        </div>
        <div>
          <label className="font-medium text-gray-700">Date & Time:</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={event.eventDate || ""}
              onChange={(e) => handleChangeEvent(event._id, "eventDate", e.target.value)}
              className="border px-2 py-1 rounded w-1/2 text-sm"
            />
            <input
              type="time"
              value={event.time || ""}
              onChange={(e) => handleChangeEvent(event._id, "time", e.target.value)}
              className="border px-2 py-1 rounded w-1/2 text-sm"
            />
          </div>
        </div>

        <div className="col-span-2 mt-2">
          <button
            onClick={() => handleSubmitEvent(event._id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            disabled={savingIds.includes(event._id)}
          >
            {savingIds.includes(event._id) ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div>
          <label className="font-medium text-gray-700">Target Year:</label>
          <p className="text-gray-900">
            {event.targetYear}
          </p>
        </div>
        <div>
          <label className="font-medium text-gray-700">Event proposed on:</label>
          <p className="text-gray-900">
            {event.contributedDate}
          </p>
        </div>
        <div>
          <label className="font-medium text-gray-700">Event Poster:</label>
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
        <div className="col-span-2">
          <label className="font-medium text-gray-700">Proposal Link:</label>
          <a
            href={event.proposal}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline block truncate"
          >
            {event.proposal || "No proposal link"}
          </a>

          <label className="font-medium text-gray-700">Form Link:</label>
          <a
            href={event.formLink || "#"}
            target={event.formLink ? "_blank" : "_self"}
            rel="noreferrer"
            className={`block text-sm underline px-1 py-0.5 rounded ${event.formLink
              ? "text-indigo-600 hover:text-indigo-800"
              : "text-gray-400 cursor-not-allowed"
              }`}
          >
            {event.formLink || "No Form link provided"}
          </a>

          <label className="font-medium text-gray-700">Meet Link:</label>
          <a
            href={event.meetLink || "#"}
            target={event.meetLink ? "_blank" : "_self"}
            rel="noreferrer"
            className={`block text-sm underline px-1 py-0.5 rounded ${event.meetLink
              ? "text-indigo-600 hover:text-indigo-800"
              : "text-gray-400 cursor-not-allowed"
              }`}
          >
            {event.meetLink || "No meet link provided"}
          </a>
        </div>

        <div className="col-span-2 mt-3">
          <label className="font-medium text-gray-700">Add Suggestion:</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Enter your suggestion"
              value={event.tempSuggestion || ""}
              onChange={(e) =>
                handleChangeEvent(event._id, "tempSuggestion", e.target.value)
              }
              className="border px-3 py-1 rounded w-full text-sm"
            />
            <button
              onClick={() => handleSuggestionSubmit(event._id, event.tempSuggestion)}
              className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        {["preInstagram", "preLinkedin", "preYoutube"].map((field) => (
          <a
            key={field}
            href={event[field]}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-3 py-2 rounded-lg border text-center ${event[field]
              ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {field.replace("pre", "Pre ")}
          </a>
        ))}
        {["postInstagram", "postLinkedin", "postYoutube"].map((field) => (
          <a
            key={field}
            href={event[field]}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs px-3 py-2 rounded-lg border text-center ${event[field]
              ? "bg-green-50 text-green-700 hover:bg-green-100"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {field.replace("post", "Post ")}
          </a>
        ))}
      </div>
      <div className="mt-6">
        <p className="text-gray-700 mb-2 font-medium">
          Event Progress
        </p>
        <div className="flex items-center justify-between relative">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
              style={{ width: `${100 / tracks.length}%` }}
            >
              <div
                className={`w-6 h-6 rounded-full ${index <= event.progressIndex
                  ? "bg-indigo-600"
                  : "bg-gray-300"
                  }`}
              ></div>
              <p
                className={`text-xs mt-2 ${index <= event.progressIndex
                  ? "text-indigo-600"
                  : "text-gray-500"
                  }`}
              >
                {track}
              </p>
            </div>
          ))}
          <div className="absolute top-3 left-0 w-full h-1 bg-gray-300 -z-10"></div>
          <div
            className="absolute top-3 left-0 h-1 bg-indigo-600 -z-10 transition-all"
            style={{
              width: `${(event.progressIndex / (tracks.length - 1)) * 100
                }%`,
            }}
          ></div>
        </div>
      </div>
      {/* ACTION BUTTONS */}
      <div className="mt-6 flex justify-between items-center">

        {/* --------- LEFT (NEGATIVE) --------- */}
        <div className="flex gap-2">

          {event.progressIndex === 3 && (
            <button
              onClick={() => handleProgressUpdate(event._id, event.progressIndex, -1)}
              disabled={savingIds.includes(event._id)}
              className={`px-3 py-1 border rounded
        ${savingIds.includes(event._id)
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                }`}
            >
              {savingIds.includes(event._id) ? "Processing..." : "Revert to Design Team"}
            </button>
          )}

          {event.progressIndex === 5 && (
            <button
              onClick={() => handleProgressUpdate(event._id, event.progressIndex, -1)}
              disabled={savingIds.includes(event._id)}
              className={`px-3 py-1 border rounded
        ${savingIds.includes(event._id)
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                }`}
            >
              {savingIds.includes(event._id) ? "Processing..." : "Revert to Media Team"}
            </button>
          )}

          {event.progressIndex === 6 && (
            <button
              onClick={() => handleProgressUpdate(event._id, event.progressIndex, -2)}
              disabled={savingIds.includes(event._id)}
              className={`px-3 py-1 border rounded
        ${savingIds.includes(event._id)
                  ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                  : "bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
                }`}
            >
              {savingIds.includes(event._id)
                ? "Processing..."
                : "Revert for Post media and Certificates"}
            </button>
          )}

        </div>


        {/* --------- RIGHT (POSITIVE) --------- */}
        <div className="flex gap-2">

          {event.progressIndex === 3 && (
            <button
              onClick={() => handleProgressUpdate(event._id, event.progressIndex, +1)}
              disabled={savingIds.includes(event._id)}
              className={`px-3 py-1 rounded
        ${savingIds.includes(event._id)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {savingIds.includes(event._id) ? "Processing..." : "Send to Media Team"}
            </button>
          )}

          {event.progressIndex === 5 && (
            <button
              onClick={() => handleProgressUpdate(event._id, event.progressIndex, +1)}
              disabled={savingIds.includes(event._id)}
              className={`px-3 py-1 rounded
        ${savingIds.includes(event._id)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {savingIds.includes(event._id) ? "Processing..." : "Send to Marketting"}
            </button>
          )}

          {event.progressIndex === 6 && (
            <button
              onClick={() => handleProgressUpdate(event._id, event.progressIndex, +1)}
              disabled={savingIds.includes(event._id)}
              className={`px-3 py-1 rounded
        ${savingIds.includes(event._id)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              {savingIds.includes(event._id) ? "Processing..." : "Mark as Completed"}
            </button>
          )}

        </div>


      </div>

    </div>
  );

  if (loading)
    return <p className="p-6 text-center text-gray-600">Loding Events...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Events Overview
      </h2>

      {/* Tabs Navigation */}
      <div className="flex space-x-3 border-b border-indigo-200 mb-6">
        {["under approval", "ongoing", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-md font-medium transition-all ${activeTab === tab
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="space-y-4">
        {categorize(activeTab).length ? (
          categorize(activeTab).map((e) => renderEventForm(e))
        ) : (
          <p className="text-gray-500 text-sm italic text-center py-8">
            No events found under {activeTab}.
          </p>
        )}
      </div>
    </div>
  );
};


// ================= Queries Tab =================
const QueriesTab = ({ setPendingQueries }) => {
  const [queries, setQueries] = useState([]);
  const [solutions, setSolutions] = useState({});
  const adminName = getCred().name;

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const user_info = getCred();
        if (!user_info) {
          return;
        }

        const res = await fetch(`${baseurl}/queries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User": JSON.stringify(user_info), // sending credentials as header
          },
        });
        const data = await res.json();

        const sorted = data.queries.sort((a, b) =>
          a.addressed ? 1 : b.addressed ? -1 : 0
        );

        setQueries(sorted || []);
        const pendingCount = sorted.filter((q) => !q.addressed).length;
        setPendingQueries(pendingCount);
      } catch (err) {
      }
    };
    fetchQueries();
  }, [setPendingQueries]);

  const handleChange = (id, value) => {
    setSolutions({ ...solutions, [id]: value });
  };

  const handleSubmit = async (id) => {
    const solution = solutions[id];
    if (!solution.trim()) return alert("Please provide a solution first.");

    try {
      const res = await fetch(`${baseurl}/address_query/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution, addressed_by: adminName }),
      });

      if (!res.ok) throw new Error("Failed to update query");

      setQueries((prev) =>
        prev.map((q) =>
          q._id === id ? { ...q, addressed: true, solution, addressed_by: adminName } : q
        )
      );

      setSolutions({ ...solutions, [id]: "" });
    } catch (err) {

    }
  };

  const unaddressedCount = queries.filter((q) => !q.addressed).length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Queries Raised</h2>
      <p className="text-sm text-gray-600 mb-4">
        Unaddressed Queries: <strong>{unaddressedCount}</strong>
      </p>

      {queries.length ? (
        <ul className="space-y-3">
          {queries.map((q) => (
            <li
              key={q._id}
              className={`bg-white shadow rounded-lg p-4 border ${q.addressed ? "opacity-70" : ""
                }`}
            >
              <strong className="block text-indigo-600 capitalize">
                {q.category}
              </strong>
              <p>
                <strong>{q.name}</strong>: {q.message}
              </p>

              {q.addressed ? (
                <div className="mt-2 text-green-700">
                  ✅ Addressed by <strong>{q.addressed_by}</strong>
                  <p className="text-gray-700 italic mt-1">“{q.solution}”</p>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={solutions[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    placeholder="Enter your solution..."
                    className="flex-1 border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleSubmit(q._id)}
                    className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 transition"
                  >
                    Submit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No queries raised.</p>
      )}
    </div>
  );
};

// AccessDenied.jsx
const DeniedTab = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
      <div className="text-4xl mb-4">🚫</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Access Denied
      </h2>
      <p className="text-gray-600 text-lg">
        Sorry, you don’t have access to this tab.
      </p>
    </div>
  );
}


// ================= Main Admin Dashboard =================
const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [pendingQueries, setPendingQueries] = useState(0);

  // Fetch pending queries globally at mount
  useEffect(() => {
    const fetchPendingQueries = async () => {
      try {
        const user_info = getCred();
        if (!user_info) {
          return;
        }

        const res = await fetch(`${baseurl}/queries`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User": JSON.stringify(user_info), // sending credentials as header
          },
        });
        const data = await res.json();

        const pendingCount = (data.queries || []).filter((q) => !q.addressed).length;
        setPendingQueries(pendingCount);
      } catch (err) {
      }
    };

    fetchPendingQueries();
  }, []); // runs only once at initial render

  const renderTab = () => {
    switch (selectedTab) {
      case "users":
        return getCred().team === "Intellexa" ?<MembersTab />:<DeniedTab/>;
      case "events":
        return <EventsTab />
      case "queries":
        return <QueriesTab setPendingQueries={setPendingQueries} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          pendingQueries={pendingQueries}
        />
        <div className="flex-1 bg-gray-50 overflow-auto">{renderTab()}</div>
      </div>
    </>
  );
};
export default AdminDashboard;