import axios from "axios";
import env from "../config/environment";

export const api = axios.create({
  baseURL: env.config.apiUrl, // http://localhost:3001/api
  withCredentials: true,      // 🔥 cookies refresh
});

export function setupInterceptors({ getAccessToken, setAccessToken, onLogout }) {
  api.interceptors.request.use((config) => {
    const token = getAccessToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;

      if (error?.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        // evita loops
        if (original.url?.includes("/auth/refresh") || original.url?.includes("/auth/login")) {
          onLogout?.();
          return Promise.reject(error);
        }

        try {
          const r = await api.post("/auth/refresh");
          const newToken = r.data?.accessToken;
          if (!newToken) throw new Error("No access token");

          setAccessToken?.(newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch (e) {
          onLogout?.();
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );
}
