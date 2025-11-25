import { useEffect, useRef, useState } from "react";
import MediaStatsGraph from "./mediastat.jsx";
import DesignStats from "./designstat.jsx";
import EventStatsGraph from "./eventstat.jsx";
import { baseurl } from "../data/url.js";
import { getstats } from "../data/bootstrapStore.js";


export default function Dashboard() {
  const [eventCount, setEventCount] = useState(0);
  const [completedevent, setCompletedEvent] = useState(0);
  const [youtube, setyoutube] = useState(0);
  const [insta, setinsta] = useState(0);
  const [linkedin, setlinkedin] = useState(0);
  const chartRef = useRef(null);

  // Fetch total event count from backend
  useEffect(() => {
      let data = getstats();
        setEventCount(data.total_events);
        setCompletedEvent(data.completed);
        setyoutube(data.youtube);
        setinsta(data.insta);
        setlinkedin(data.linkedin);
  }, []);

  // Dashboard colors
  const config = {
    primary_color: "#89ade0ff",
    background_color: "#4d63c5ff",
  };

  // Line chart data
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Events Completed",
        data: [5, 8, 10, 7, 12, 15],
        borderColor: config.primary_color,
        backgroundColor: `${config.primary_color}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderWidth: 3,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } },
      x: { grid: { display: false } },
    },
  };

  useEffect(() => {
    document.body.style.background = `linear-gradient(to bottom right, ${config.background_color}, white, ${config.background_color})`;
  }, []);

  // Stats section cards
  const stats = [
    { title: "Total Events", value: eventCount || "0", growth: "↑ 12%", color: "indigo" },
    { title: "Completed Events", value: completedevent || "0", growth: "↑ 12%", color: "indigo" },
    { title: "Pending Events", value: eventCount - completedevent || "0", growth: "↑ 12%", color: "indigo" },
    { title: "Whatsapp Members", value: "4171", growth: "↑ 5%", color: "blue" },
    { title: "Insta Followers", value: insta, growth: "↑ 5%", color: "yellow" },
    { title: "LinkedIn Followers", value: linkedin, growth: "↑ 5%", color: "violet" },
    { title: "YouTube Followers", value: youtube, growth: "↑ 5%", color: "pink" },
  ];

  return (
    <div className="min-h-full font-sans">

      <div id="overview" className="max-w-9xl mx-auto px-6 py-10 space-y-8">
        {/* === STATS SECTION === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:-translate-y-1 transition transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{item.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{item.value}</p>
                  <p className="text-green-600 text-sm mt-2">{item.growth} from last month</p>
                </div>
                <div
                  className={`w-14 h-14 bg-${item.color}-100 rounded-xl flex items-center justify-center`}
                >
                  <svg
                    className={`w-8 h-8 text-${item.color}-600`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === LINE CHART === */}
        <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Event Completion Overview</h2>
              <p className="text-gray-500">Monthly event completion trends</p>
            </div>
          </div>
          <EventStatsGraph/>
        </section>
        <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Media Team Monthly Growth</h2>
              <p className="text-gray-500">Instagram, LinkedIn, and YouTube performance trends</p>
            </div>
          </div>

          <MediaStatsGraph />
        </section>
        <section className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <div className="flex justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Design Team Statistics</h2>
              <p className="text-gray-500">Number of design creation performance trends</p>
            </div>
          </div>
          <DesignStats />
        </section>

        {/* === DOMAIN INTERESTS === */}
        <section id="domains" className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Domain Interests</h2>
          <p className="text-gray-500 mb-6">Popular technology domains among members</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Quantum Computing", value: "40%", color: "from-indigo-500 to-indigo-600" },
              { name: "AI & ML", value: "30%", color: "from-purple-500 to-purple-600" },
              { name: "Web Development", value: "20%", color: "from-blue-500 to-blue-600" },
              { name: "Cyber Security", value: "10%", color: "from-green-500 to-green-600" },
            ].map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white shadow-lg`}
              >
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-4xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === EVENT ENGAGEMENT === */}
        <section id="events" className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Potential Events & Engagement Level
          </h2>
          <p className="text-gray-500 mb-6">Predicted engagement based on member interests</p>

          {[
            { name: "Coding Contest", value: 90 },
            { name: "Hackathon", value: 80 },
            { name: "Workshop", value: 60 },
            { name: "Seminar", value: 45 },
          ].map((event, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-700">{event.name}</span>
                <span className="text-sm font-bold text-indigo-600">{event.value}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${event.value}%` }}
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
