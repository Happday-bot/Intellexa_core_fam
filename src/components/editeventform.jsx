import React, { useEffect, useState } from "react";
import { baseurl } from "../data/url";

const EditEventForm = ({ eventData, onUpdate, onClose }) => {
  const [updatedEvent, setUpdatedEvent] = useState(eventData || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedEvent(eventData || {});
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "targetYear") {
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      setUpdatedEvent((prev) => ({ ...prev, [name]: arr }));
    } else {
      setUpdatedEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setUpdatedEvent((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedEvent?._id) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${baseurl}/editevent/${updatedEvent._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const result = await response.json();
      onUpdate(result.updatedEvent || updatedEvent);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!updatedEvent) return null;

  const fields = [
    ["eventName", "Event Name"],
    ["organiser", "Organiser"],
    ["proposed_by", "Proposed By"],
    ["status", "Status"],
    ["proposal", "Proposal (URL)"],
    ["contributedDate", "Added On"],
    ["eventDate", "Event Date"],
    ["venue", "Venue"],
    ["time", "Time"],
    ["suggestion", "Suggestion"],
    ["insta", "Instagram Caption"],
    ["linkedin", "LinkedIn Caption"],
    ["whatsapp", "WhatsApp Caption"],
    ["targetYear", "Target Year (comma separated)"],
    ["expectedParticipants", "Expected Participants"],
    ["progressIndex", "Progress Index (0–7)"],
  ];

  const readOnlyFields = [
    "proposed_by",
    "status",
    "contributedDate",
    "eventDate",
    "venue",
    "time",
    "suggestion",
    "progressIndex",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-12">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md w-[95%] md:w-[70%] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-10 grid grid-cols-2 gap-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <h3 className="col-span-2 text-3xl font-bold text-indigo-700 text-center mb-4">
          Edit Event — {updatedEvent.eventName}
        </h3>

        {fields.map(([key, label]) => {
          const isReadOnly = readOnlyFields.includes(key);
          let value = updatedEvent[key] ?? "";

          // For targetYear, display as comma-separated string
          if (key === "targetYear" && Array.isArray(updatedEvent[key])) {
            value = updatedEvent[key].join(",");
          }

          return (
            <div key={key} className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`w-full border rounded-lg px-3 py-2 ${
                  isReadOnly
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-white"
                }`}
              />
            </div>
          );
        })}

        <div className="col-span-2 text-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-8 py-2 rounded-lg shadow hover:bg-indigo-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventForm;
