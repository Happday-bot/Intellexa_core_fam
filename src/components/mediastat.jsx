import React, { useEffect, useState } from "react";
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
import { getMediaStats } from "../data/bootstrapStore";

export default function MediaStatsGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = getMediaStats();
        setData(result.stats || []);
      } catch (err) {
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={(entry) =>
              `${entry.month.slice(0, 3)} '${entry.year.toString().slice(-2)}`
            }
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="instagram" stroke="#E1306C" strokeWidth={2} />
          <Line type="monotone" dataKey="linkedin" stroke="#0A66C2" strokeWidth={2} />
          <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
