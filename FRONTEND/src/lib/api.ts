const API_URL = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("grandhotel_token");
export const setToken = (token: string) => localStorage.setItem("grandhotel_token", token);
export const removeToken = () => localStorage.removeItem("grandhotel_token");

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password?: string) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  async signUp(email: string, password?: string, name?: string, role = "guest") {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name: name || email.split("@")[0], role }),
    });
    if (res.token) setToken(res.token);
    return res;
  },

  async getProfile() {
    return request("/auth/me");
  },

  // Rooms
  async getRooms(availableOnly = false) {
    return request(`/rooms${availableOnly ? "?available=true" : ""}`);
  },

  // Bookings
  async createBooking(data: { roomId: string; checkIn: string; checkOut: string; guests: number; roomsCount?: number }) {
    return request("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMyBookings() {
    return request("/bookings/my");
  },

  // Gallery
  async getGallery() {
    return request("/gallery");
  },

  // Testimonials
  async getTestimonials() {
    return request("/testimonials");
  },

  // Stats
  async getStats() {
    return request("/stats");
  }
};
