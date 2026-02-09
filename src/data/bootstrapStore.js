// PRIVATE, IN-MEMORY STORE
// Now supports simple subscriptions for reactivity

import { baseurl } from "./url";

let MEDIA_STATS = null;
let DESIGN_STATS = null;
let EVENT_STATS = null;
let EVENTS = null;
let STATS = null;
let USERS = null;

const listeners = new Set();
const notify = () => listeners.forEach(l => l());

// --- SUBSCRIPTIONS ---
export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// --- GETTERS ---
export const getMediaStats = () => MEDIA_STATS;
export const getDesignStats = () => DESIGN_STATS;
export const getEventStats = () => EVENT_STATS;
export const getEvents = () => EVENTS;
export const getstats = () => STATS;
export const getUsers = () => USERS;

// --- SETTERS (used by bootstrap only) ---
export const __setMediaStats = (data) => { MEDIA_STATS = data; };
export const __setDesignStats = (data) => { DESIGN_STATS = data; };
export const __setEventStats = (data) => { EVENT_STATS = data; };
export const __setEvents = (data) => { EVENTS = data; };
export const __setStats = (data) => { STATS = data; };
export const __setUsers = (data) => { USERS = data; };

// --- REFETCH FUNCTIONS ---
// Helper to fetch and notify
const fetchAndNotify = async (url, setter, options = {}) => {
  const res = await fetch(`${baseurl}${url}`, {
    ...options,
    credentials: "include", // Essential for cookies
  });
  const data = await res.json();
  setter(data);
  notify();
  return data;
};

export const refetchMediaStats = () => fetchAndNotify("/stats/media", (d) => { MEDIA_STATS = d; });
export const refetchDesignStats = () => fetchAndNotify("/stats/design", (d) => { DESIGN_STATS = d; });
export const refetchEventStats = () => fetchAndNotify("/stats/event", (d) => { EVENT_STATS = d; });
export const refetchEvents = () => fetchAndNotify("/events", (d) => { EVENTS = d; });
export const refetchStats = () => fetchAndNotify("/events/count", (d) => { STATS = d; });
export const refetchUsers = () => fetchAndNotify("/users", (d) => { USERS = d; });