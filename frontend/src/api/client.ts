export const BASE_URL = "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (cb: () => void) => {
  onUnauthorized = cb;
};

export const jsonBody = (data: unknown): RequestInit => {
  return {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};

let refreshing: Promise<string | null> | null = null;

const NO_REFRESH_ON_401_PATHS = new Set([
  "/auth/refresh",
  "/auth/login",
  "/auth/register",
]);

const refreshAccessToken = (): Promise<string | null> => {
  if (!refreshing) {
    refreshing = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { accessToken: string };
        accessToken = data.accessToken;
        return accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {},
  retryOn401 = true,
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retryOn401 && !NO_REFRESH_ON_401_PATHS.has(path)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const newOptions = {
        ...options,
        headers: new Headers(options.headers),
      };

      (newOptions.headers as Headers).delete("Authorization");

      return apiFetch<T>(path, newOptions, false);
    }
    if (onUnauthorized) onUnauthorized();
    throw new ApiError(401, "Unauthorized");
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body?.message) {
        message = Array.isArray(body.message)
          ? body.message.join(", ")
          : body.message;
      }
    } catch {}
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
};
