import React, { useEffect, useState } from "react";
import { getEvents,refetchEvents } from "../data/bootstrapStore";
import { getCred } from "./auth/auth";
import { baseurl } from "../data/url";

const TechLeadForms = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState([]); // <-- Track saving events
  const today = new Date();

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = getEvents();
        setEvents(data.events);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Sort helper
  const sortByDateAsc = (arr) =>
    [...arr].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  // Categorize events
  const submittableEvents = sortByDateAsc(events.filter((e) => !e.submitted));
  const editableEvents = sortByDateAsc(
    events.filter((e) => e.submitted && new Date(e.eventDate) >= today)
  );
  const disabledEvents = sortByDateAsc(
    events.filter((e) => e.submitted && new Date(e.eventDate) < today)
  );

  // Input change handler
  const handleChange = (id, field, value) => {
    setEvents((prev) =>
      prev.map((e) => (e._id === id ? { ...e, [field]: value } : e))
    );
  };

  // Submit/update event links
  const handleSubmit = async (id) => {
    const event = events.find((e) => e._id === id);
    if (!event.formLink) return;

    setSavingIds((prev) => [...prev, id]); // Disable the button
    try {
      const res = await fetch(`${baseurl}/editevent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formLink: event.formLink,
          meetLink: event.meetLink,
          submitted: true,
          progressIndex:2
        }),
      });

      if (!res.ok) throw new Error("Failed to update event");
      const data = await res.json();

      setEvents((prev) =>
        prev.map((e) => (e._id === id ? data.data : e))
      );
    } finally {
      setSavingIds((prev) => prev.filter((savingId) => savingId !== id)); // Re-enable
      refetchEvents();
    }
  };

  // Event card
  const renderEventCard = (event, editable) => {
    const eventDate = new Date(event.eventDate);
    const isSaving = savingIds.includes(event._id);
    const buttonLabel = event.submitted
      ? isSaving
        ? "Updating..."
        : "Update Links"
      : isSaving
      ? "Submitting..."
      : "Submit Links";

    return (
      <div
        key={event._id}
        className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          {event.eventName}
        </h2>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Organiser:</strong> {event.organiser}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          <strong>Proposed By:</strong> {event.proposed_by || event.proposedBy}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          <strong>Event Date:</strong> {eventDate.toLocaleDateString("en-GB")}
        </p>

        <div className="space-y-2 my-2">
          {event.proposal && (
            <a
              href={event.proposal}
              download
              className="block text-indigo-600 underline text-sm hover:text-indigo-800"
            >
              📄 Download Proposal
            </a>
          )}
          {event.marketingFile && (
            <a
              href={event.marketingFile}
              download
              className="block text-indigo-600 underline text-sm hover:text-indigo-800"
            >
              🧾 Download Marketing Content
            </a>
          )}

          <input
            type="url"
            placeholder="Form Link"
            value={event.formLink || ""}
            onChange={(e) => handleChange(event._id, "formLink", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 mt-2"
            disabled={!editable || isSaving}
            required
          />
          <input
            type="url"
            placeholder="Meet Link (optional)"
            value={event.meetLink || ""}
            onChange={(e) => handleChange(event._id, "meetLink", e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400 mt-2"
            disabled={!editable || isSaving}
          />
        </div>

        <div className="mt-5">
          <button
            onClick={() => handleSubmit(event._id)}
            disabled={!editable || isSaving}
            className={`w-full py-2 rounded-lg font-semibold transition-all ${
              editable && !isSaving
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            {buttonLabel}
          </button>
        </div>

        {event.submitted && editable && (
          <p className="text-xs text-green-600 mt-2 text-center">
            ✅ Editable until event day ({eventDate.toLocaleDateString("en-GB")})
          </p>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading events...
      </div>
    );

  const user = getCred();

  return (  
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📝 Tech Lead Event Forms
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {user.name} 👋</h2>

      {/* Submittable */}
      {submittableEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">
            🟢 Submittable Events ({submittableEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {submittableEvents.map((e) => renderEventCard(e, true))}
          </div>
        </>
      )}

      {/* Editable */}
      {editableEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ✏️ Editable Events ({editableEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {editableEvents.map((e) => renderEventCard(e, true))}
          </div>
        </>
      )}

      {/* Disabled */}
      {disabledEvents.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-gray-500 mb-4">
            ⛔ Disabled Events ({disabledEvents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disabledEvents.map((e) => renderEventCard(e, false))}
          </div>
        </>
      )}
    </div>
  );
};

export default TechLeadForms;

