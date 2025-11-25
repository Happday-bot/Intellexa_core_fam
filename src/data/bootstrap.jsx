import { useEffect } from "react";
import { __setMediaStats, __setDesignStats, __setEvents, __setEventStats, __setStats } from "./bootstrapStore";
import { getCred } from "../components/auth/auth";
import { baseurl } from "./url";

export default function BootstrapData({ children, onReady }) {

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Fetch media stats
        const mediaRes = await fetch(`${baseurl}/stats/media`);
        const mediaData = await mediaRes.json();
        __setMediaStats(mediaData);

        // 2. Fetch design stats
        const designRes = await fetch(`${baseurl}/stats/design`);
        const designData = await designRes.json();
        __setDesignStats(designData);

        // 3. Fetch design stats
        const eventRes = await fetch(`${baseurl}/stats/event`);
        const eventData = await eventRes.json();
        __setEventStats(eventData);

        // 4. Fetch events
        const user_info = JSON.parse(sessionStorage.getItem("user"));
        const eventsRes = await fetch(`${baseurl}/events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User": JSON.stringify(user_info),
          },
        });

        const eventsData = await eventsRes.json();
        __setEvents(eventsData);

        //5. Fetch Stats
       const stats = await fetch(`${baseurl}/events/count`);
       const statsData = await stats.json();
       __setStats(statsData);

      }finally {
        onReady(); // <---- signal completion
      }
    };

    init();
  }, []);

  return children;
}
