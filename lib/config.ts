// lib/config.ts

// Detecta la IP local automáticamente desde window.location
let host = "localhost:8000";
if (typeof window !== "undefined") {
  host = window.location.host || "localhost:8000";
}

export const API_BASE_URL = `http://${host}`;
