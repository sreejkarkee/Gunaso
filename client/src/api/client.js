export function createApi(token, onUnauthorized) {
  return async function request(path, options = {}) {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    const body = await response.json().catch(() => ({}));
    if (response.status === 401) {
      onUnauthorized();
    }
    if (!response.ok) {
      const details = Array.isArray(body.errors)
        ? body.errors.map((error) => `${error.field}: ${error.message}`).join("; ")
        : "";
      throw new Error(details ? `${body.message || "Request failed"}: ${details}` : body.message || "Request failed");
    }
    return body;
  };
}
