const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const post = async (path, body, headers = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Request failed");
  return data;
};

export const apiFetch = (path, options = {}) => {
  const { headers, ...rest } = options;
  return fetch(`${BASE}${path}`, {
    ...rest,
    headers: { "Content-Type": "application/json", ...headers },
  });
};

export const authApi = {
  login: (email, password) => post("/auth/login", { email, password }),
  register: (email, password, name) =>
    post("/auth/register", { email, password, name }),
  logout: (token) =>
    post("/auth/logout", {}, { Authorization: `Bearer ${token}` }),
};
