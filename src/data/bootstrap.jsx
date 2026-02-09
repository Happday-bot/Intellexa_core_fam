import { useEffect } from "react";
import { refetchMediaStats, refetchDesignStats, refetchEvents, refetchEventStats, refetchStats, refetchUsers } from "./bootstrapStore";

export default function BootstrapData({ children, onReady }) {

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch all data using the reactive refetchers (which now handle cookies)
        await Promise.all([
          refetchMediaStats(),
          refetchDesignStats(),
          refetchEventStats(),
          refetchEvents(),
          refetchStats(),
          refetchUsers()
        ]);
      } catch (err) {
        console.error("Bootstrap failed", err);
      } finally {
        onReady();
      }
    };

    init();
  }, []);

  return children;
}
