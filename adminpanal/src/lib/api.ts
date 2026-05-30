const API_URL = "http://localhost:5000/api";

// Helper to get token
export const getToken = () => localStorage.getItem("grandhotel_token");
export const setToken = (token: string) => localStorage.setItem("grandhotel_token", token);
export const removeToken = () => localStorage.removeItem("grandhotel_token");

// Base request helper
async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
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
  async login(credentials: { email: string; password?: string }) {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (res.token) setToken(res.token);
    return res;
  },
  
  async register(data: { email: string; password?: string; name: string; role?: string }) {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token) setToken(res.token);
    return res;
  },
  
  async getProfile() {
    return request("/auth/me");
  },
  
  logout() {
    removeToken();
  },

  // Rooms
  async getRooms(availableOnly = false) {
    return request(`/rooms${availableOnly ? "?available=true" : ""}`);
  },
  
  async createRoom(data: any) {
    return request("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  async updateRoom(id: string, data: any) {
    return request(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  
  async deleteRoom(id: string) {
    return request(`/rooms/${id}`, {
      method: "DELETE",
    });
  },

  // Bookings
  async getBookings() {
    return request("/bookings");
  },
  
  async updateBookingStatus(id: string, status: "pending" | "approved" | "cancelled") {
    return request(`/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  // Gallery
  async getGallery() {
    return request("/gallery");
  },
  
  async addGalleryItem(data: { src: string; alt: string; span?: string }) {
    return request("/gallery", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  async deleteGalleryItem(id: string) {
    return request(`/gallery/${id}`, {
      method: "DELETE",
    });
  },

  // Testimonials
  async getTestimonials() {
    return request("/testimonials");
  },
  
  async addTestimonial(data: { name: string; role: string; text: string; rating?: number }) {
    return request("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  async deleteTestimonial(id: string) {
    return request(`/testimonials/${id}`, {
      method: "DELETE",
    });
  },

  // Stats
  async getStats() {
    return request("/stats");
  },
  
  async updateStat(id: string, data: { number?: number; suffix?: string; label?: string }) {
    return request(`/stats/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
};
