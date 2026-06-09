// Automatically switches based on your running environment
const IS_PRODUCTION = typeof window !== "undefined" && 
  (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1");

export const API_URL = IS_PRODUCTION
  ? "https://transport-system.celestialq7.workers.dev"
  : "http://localhost:8787";

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}
