import React, { useEffect } from "react";

const Addeventform = ({
  newEvent,
  handleChange,
  handleFileChange,
  handleAddEvent,
  onClose,
}) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const login_name = JSON.parse(sessionStorage.getItem("user"));

  // Sync default values into newEvent when form loads
  useEffect(() => {
    handleChange({
      target: { name: "status", value: newEvent.status || "Under Approval" },
    });
    handleChange({
      target: { name: "contributedDate", value: newEvent.contributedDate || currentDate },
    });
    handleChange({
      target: { name: "eventDate", value: newEvent.eventDate || "Yet to be Decided" },
    });
    handleChange({
      target: { name: "venue", value: newEvent.venue || "Will be Announced Later" },
    });
    handleChange({
      target: { name: "time", value: newEvent.time || "Will be Announced Later" },
    });
    handleChange({
      target: {
        name: "suggestion",
        value: newEvent.suggestion || "Will be given later. Kindly update once you get one.",
      },
    });
    handleChange({
      target: { name: "progressIndex", value: newEvent.progressIndex ?? 0 },
    });
    handleChange({
      target: { name: "proposed_by", value: newEvent.proposed_by || login_name.name },
    });
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedYears = Array.isArray(newEvent.targetYear)
      ? [...newEvent.targetYear]
      : [];

    if (checked) updatedYears.push(value);
    else updatedYears = updatedYears.filter((year) => year !== value);

    handleChange({ target: { name: "targetYear", value: updatedYears } });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-start justify-center py-4"
      style={{ overscrollBehavior: "contain" }}
    >
      <form
        onSubmit={handleAddEvent}
        className="relative bg-white/95 backdrop-blur-md w-[95%] md:w-[70%] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-10 grid grid-cols-2 gap-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h3 className="col-span-2 text-3xl font-bold text-indigo-700 text-center mb-4">
          Add New Event
        </h3>

        {/* Section Header */}
        <div className="col-span-2 border-b pb-2 mb-2">
          <h4 className="text-lg font-semibold text-gray-800">
            Event Information
          </h4>
        </div>

        {/* Editable Fields */}
        {[
          ["eventName", "Event Name"],
          ["organiser", "Organiser"],
          ["proposal", "Proposal (URL)"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              name={key}
              value={newEvent[key]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        ))}

        {/* Non-editable Fields */}
        {[
          ["proposed_by", "Proposed By"],
          ["status", "Status"],
          ["contributedDate", "Added On"],
          ["eventDate", "Event Date"],
          ["venue", "Venue"],
          ["time", "Time"],
          ["progressIndex", "Progress Index (0–7)"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              name={key}
              value={newEvent[key]}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        ))}

        {/* Suggestion */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Suggestion
          </label>
          <textarea
            name="suggestion"
            value={newEvent.suggestion}
            disabled
            className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* Target Year */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Year
          </label>
          <div className="flex flex-wrap gap-4">
            {["I", "II", "III", "IV"].map((year) => (
              <label key={year} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={year}
                  checked={newEvent.targetYear?.includes(year)}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span>{year}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Expected Participants */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Participants
          </label>
          <input
            type="number"
            name="expectedParticipants"
            value={newEvent.expectedParticipants}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            max={2000}
            min={0}
            required
          />
        </div>

        {/* Social Captions */}
        <div className="col-span-2 border-b pb-2 mb-2 mt-4">
          <h4 className="text-lg font-semibold text-gray-800">
            Social & Promotion Details
          </h4>
        </div>

        {[
          ["insta", "Instagram Caption"],
          ["linkedin", "LinkedIn Caption"],
          ["whatsapp", "WhatsApp Caption"],
        ].map(([key, label]) => (
          <div key={key} className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              name={key}
              value={newEvent[key]}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-8 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default Addeventform;
