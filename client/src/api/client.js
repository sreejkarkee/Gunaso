export function createApi(token, onUnauthorized) {
  return async function request(path, options = {}) {
    const response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 401) onUnauthorized();
    if (!response.ok) throw new Error(body.message || "Request failed");
    return body;
  };
}
