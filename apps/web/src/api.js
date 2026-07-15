const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const parse = async (res) => {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? data.message ?? "Request failed");
  return data;
};

const auth = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const get = (path, token) =>
  fetch(`${BASE}${path}`, { headers: auth(token) }).then(parse);

const post = (path, body, token) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth(token) },
    body: JSON.stringify(body),
  }).then(parse);

const patch = (path, body, token) =>
  fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...auth(token) },
    body: JSON.stringify(body),
  }).then(parse);

const del = (path, token) =>
  fetch(`${BASE}${path}`, { method: "DELETE", headers: auth(token) }).then(parse);

export const loginUser = (email, password) =>
  post("/auth/login", { email, password });

export const registerUser = (email, password, name) =>
  post("/auth/register", { email, password, name });

export const logoutUser = (token) => post("/auth/logout", {}, token);

export const getMe = (token) => get("/api/me", token);

export const updateMe = (token, profile) => patch("/api/me", profile, token);

export const listKsbs = (token) => get("/api/ksbs", token);

export const listEvidence = (token) => get("/api/evidence", token);

export const createEvidence = (token, evidence) =>
  post("/api/evidence", evidence, token);

export const updateEvidence = (token, id, evidence) =>
  patch(`/api/evidence/${id}`, evidence, token);

export const deleteEvidence = (token, id) =>
  del(`/api/evidence/${id}`, token);

export const submitEvidence = (token, id) =>
  post(`/api/evidence/${id}/submit`, {}, token);

export const getReviewQueue = (token) => get("/api/admin/queue", token);

export const reviewEvidence = (token, id, review) =>
  post(`/api/admin/evidence/${id}/review`, review, token);
