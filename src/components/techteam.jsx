import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Addeventform from "./addeventform";
import EditEventForm from "./editeventform";
import { getEvents, refetchEvents} from "../data/bootstrapStore";
import { getCred } from "./auth/auth";
import { baseurl } from "../data/url";


const TechTeams = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const login_name = getCred();
  const [newEvent, setNewEvent] = useState({
    _id: "",
    eventName: "",
    organiser: "",
    proposed_by: "",
    status: "",
    proposal: "",
    contributedDate: "",
    eventDate: "",
    venue: "",
    time: "",
    suggestion: "",
    insta: "",
    linkedin: "",
    whatsapp: "",
    targetYear: "",
    expectedParticipants: "",
    progressIndex: 0,
    image: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const user_info = getCred();
        if (!user_info) {
          return;
        }
        const data = getEvents();
        // Sort events by contributedDate (descending: newest first)
        const sortedEvents = data.events.sort(
          (a, b) => new Date(b.contributedDate) - new Date(a.contributedDate)
        );

        setEvents(sortedEvents);
      } catch (error) {
      }
    };

    fetchEvents();
  }, []);

  const tracks = [
    "Event Team",
    "Tech Lead",
    "Design Team",
    "Approval",
    "Media Team",
    "Approval",
    "Marketing",
    "Completed"
  ];
  const [editEvent, setEditEvent] = useState(null);

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((ev) => (ev._id === updatedEvent._id ? updatedEvent : ev))
    );
    setEditEvent(null);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewEvent((prev) => ({ ...prev, image: e.target.files[0] }));
  };
  const currentDate = new Date().toISOString().split("T")[0];
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.eventName || !newEvent.organiser) {
      return;
    }

    const newEntry = { ...newEvent };

    try {
      // ✅ POST to backend
      const response = await fetch(`${baseurl}/add_event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to save event to backend");
      }
      // keep frontend logic same
      setShowForm(false);
      setNewEvent({
        eventName: "",
        organiser: "",
        proposed_by: "",
        status: "Under Approval",
        proposal: "",
        contributedDate: currentDate,
        eventDate: "Yet to be Decided",
        venue: "Will be Announced Later",
        time: "Will be Announced Later",
        suggestion: "Will be given later. Kindly update once you get one.",
        insta: "",
        linkedin: "",
        whatsapp: "",
        targetYear: "",
        expectedParticipants: "",
        progressIndex: 0,
        posterWhatsapp: "",
      });
    } finally {
      refetchEvents();
    }

  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8 relative">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-4">
            Hi, {login_name.name}👋
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            <strong>Team:</strong> {login_name.team} |{" "}
            <strong>Designation:</strong> {login_name.role}
          </p>

          {/* Event List */}
          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-100 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-6"
              >
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {event.eventName}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Organiser:</strong> {event.organiser}
                  </p>
                  <p className="text-gray-600">
                    <strong>Proposed By:</strong> {event.proposed_by}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded font-medium ${event.status === "completed"
                          ? "bg-green-200 text-green-700"
                          : event.status === "ongoing"
                            ? "bg-yellow-200 text-yellow-700"
                            : "bg-red-200 text-red-700"
                        }`}
                    >
                      {event.status}
                    </span>
                  </p>
                  <p className="text-gray-600">
                    <strong>Proposal:</strong>{" "}
                    <a
                      href={event.proposal}
                      className="text-indigo-600 hover:underline"
                      download
                    >
                      Download
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Added On:</strong> {event.contributedDate}
                  </p>
                  <p className="text-gray-600">
                    <strong>Event Date:</strong> {event.eventDate}
                  </p>
                  <p className="text-gray-600">
                    <strong>Venue:</strong> {event.venue}
                  </p>
                  <p className="text-gray-600">
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <strong>Suggestion:</strong> {event.suggestion}
                  </p>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm">
                      <strong>Instagram:</strong> {event.insta}
                    </p>
                    <p className="text-sm">
                      <strong>LinkedIn:</strong> {event.linkedin}
                    </p>
                    <p className="text-sm">
                      <strong>WhatsApp:</strong> {event.whatsapp}
                    </p>
                  </div>
                  <p className="text-gray-600 mt-2">
                    <strong>Target Year:</strong> {event.targetYear} |{" "}
                    <strong>Expected Participants:</strong>{" "}
                    {event.expectedParticipants}
                  </p>

                  {/* Progress Tracker */}
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
                  <button
                    onClick={() => setEditEvent(event)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Edit Event
                  </button>

                </div>

                {/* Poster */}
                <div className="flex-shrink-0 w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  {event.posterWhatsapp ? (
                    <img
                      src={event.posterWhatsapp}
                      alt={event.eventName}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <p className="text-sm text-gray-500 text-center px-2">
                      The image will be uploaded by the design team soon.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Add Button */}
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-6 left-6 bg-indigo-600 text-white text-lg px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition z-50"
          >
            + Add Event
          </button>
        </div>

        {/* Overlay Form */}
        {showForm && (
          <Addeventform
            newEvent={newEvent}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            handleAddEvent={handleAddEvent}
            onClose={() => setShowForm(false)}
          />
        )}

        {editEvent && (
          <EditEventForm
            eventData={editEvent}
            onUpdate={handleUpdateEvent}
            onClose={() => setEditEvent(null)}
          />
        )}

      </div>
    </>
  );
};

export default TechTeams;
