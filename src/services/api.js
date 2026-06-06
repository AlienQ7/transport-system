//export API_URL = "http://localhost:8787";
//exportt async function apiFetch(url, options = {}) {
//  const token = localStorage.getItem("token");
/*
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}*/

const API_URL = "https://transport-backend.pages.dev";returnort async function apiFetch(url, options = {}) {
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
