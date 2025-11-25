// PRIVATE, IN-MEMORY STORE
// Not reactive, not exported as an object (safer)

import { getCred } from "../components/auth/auth";
import { baseurl } from "./url";

let MEDIA_STATS = null;
let DESIGN_STATS = null;
let EVENT_STATS = null;
let EVENTS = null;
let STATS = null;

// --- GETTERS ---
export const getMediaStats = () => MEDIA_STATS;
export const getDesignStats = () => DESIGN_STATS;
export const getEventStats = () => EVENT_STATS;
export const getEvents = () => EVENTS;
export const getstats = ()=> STATS;

// --- SETTERS (used by bootstrap only) ---
export const __setMediaStats = (data) => { MEDIA_STATS = data; };
export const __setDesignStats = (data) => { DESIGN_STATS = data; };
export const __setEventStats = (data) => { EVENT_STATS = data; };
export const __setEvents = (data) => { EVENTS = data; };
export const __setStats = (data) => {STATS = data;};

// --- REFETCH FUNCTIONS (safe to expose globally) ---
export const refetchMediaStats = async () => {
  const res = await fetch(`${baseurl}/stats/media`);
  const data = await res.json();
  MEDIA_STATS = data;
  return data;
};

export const refetchDesignStats = async () => {
  const res = await fetch(`${baseurl}/stats/design`);
  const data = await res.json();
  DESIGN_STATS = data;
  return data;
};

export const refetchEventStats = async () => {
  const res = await fetch(`${baseurl}/stats/event`);
  const data = await res.json();
  EVENT_STATS = data;
  return data;
};

export const refetchEvents = async () => {
  const res = await fetch(`${baseurl}/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-User": JSON.stringify(getCred()),
    },
  });

  const data = await res.json();
  EVENTS = data;
  return data;
};

export const refetchStats = async () => {
  const res = await fetch(`${baseurl}/events/count`);
  const data = await res.json();
  STATS = data;
  return data;
}