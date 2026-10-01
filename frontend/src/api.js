const tokenKey = "leaf-ledger-session";
export function getToken() { return localStorage.getItem(tokenKey) || ""; }
export function setToken(token) { if (token) localStorage.setItem(tokenKey, token); else localStorage.removeItem(tokenKey); }

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = getToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body) headers.set("Content-Type", "application/json");

  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  register: (values) => request("/api/auth/register", { method: "POST", body: JSON.stringify(values) }),
  login: (values) => request("/api/auth/login", { method: "POST", body: JSON.stringify(values) }),
  getBooks: () => request("/api/books"),
  getBook: (id) => request(`/api/books/${id}`),
  getReviews: (id) => request(`/api/books/${id}/reviews`),
  getTags: () => request("/api/tags"),
  getTagBooks: (id) => request(`/api/tags/${id}/books`),
  getTbr: () => request("/api/me/tbr"),
  addToTbr: (bookId) => request(`/api/me/tbr/${bookId}`, { method: "POST" }),
  removeFromTbr: (bookId) => request(`/api/me/tbr/${bookId}`, { method: "DELETE" }),
  addReview: (bookId, review) => request(`/api/books/${bookId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review)
  })
};
