import { api } from "../api/axios";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function refresh() {
  const res = await api.post("/auth/refresh");
  return res.data; // { accessToken }
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data; // { ok: true }
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data; // { user }
}
