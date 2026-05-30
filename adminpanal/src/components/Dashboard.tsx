import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import {
  Hotel, LogOut, BedDouble, CalendarCheck, Image, MessageSquare, BarChart3,
  Plus, Edit2, Trash2, CheckCircle, XCircle, User, Star, Eye
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "bookings" | "gallery" | "testimonials" | "stats">("overview");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();

  // Shared Data States
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  // Refetch triggers
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states
  const [roomForm, setRoomForm] = useState({ id: "", name: "", price: 0, image: "", rating: 5, amenities: "", desc: "", available: true });
  const [showRoomModal, setShowRoomModal] = useState(false);

  const [galleryForm, setGalleryForm] = useState({ src: "", alt: "", span: "" });
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const [testimonialForm, setTestimonialForm] = useState({ name: "", role: "", text: "", rating: 5 });
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  // Status Alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const triggerAlert = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // Fetch User Info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await api.getProfile();
        setUser(u);
      } catch (err) {
        api.logout();
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Fetch Page Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [r, b, g, t, s] = await Promise.all([
          api.getRooms(),
          api.getBookings(),
          api.getGallery(),
          api.getTestimonials(),
          api.getStats()
        ]);
        setRooms(r);
        setBookings(b);
        setGallery(g);
        setTestimonials(t);
        setStats(s);
      } catch (err: any) {
        console.error("Error loading dashboard data:", err);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user, refreshTrigger]);

  const handleSignOut = () => {
    api.logout();
    navigate("/login");
  };

  const handleBookingAction = async (id: string, status: "approved" | "cancelled") => {
    try {
      await api.updateBookingStatus(id, status);
      triggerAlert(`Booking status updated to ${status}!`);
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to update booking status", true);
    }
  };

  // ROOM CRUD ACTIONS
  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amenitiesArr = roomForm.amenities.split(",").map(a => a.trim()).filter(Boolean);
      const data = { ...roomForm, amenities: amenitiesArr };

      if (roomForm.id) {
        await api.updateRoom(roomForm.id, data);
        triggerAlert("Room updated successfully!");
      } else {
        await api.createRoom(data);
        triggerAlert("Room created successfully!");
      }
      setShowRoomModal(false);
      setRoomForm({ id: "", name: "", price: 0, image: "", rating: 5, amenities: "", desc: "", available: true });
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to save room", true);
    }
  };

  const handleEditRoom = (room: any) => {
    setRoomForm({
      id: room._id,
      name: room.name,
      price: room.price,
      image: room.image,
      rating: room.rating,
      amenities: room.amenities.join(", "),
      desc: room.desc,
      available: room.available
    });
    setShowRoomModal(true);
  };

  const handleDeleteRoom = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.deleteRoom(id);
      triggerAlert("Room deleted successfully!");
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to delete room", true);
    }
  };

  // GALLERY ACTIONS
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addGalleryItem(galleryForm);
      triggerAlert("Gallery item added!");
      setShowGalleryModal(false);
      setGalleryForm({ src: "", alt: "", span: "" });
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to add gallery item", true);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await api.deleteGalleryItem(id);
      triggerAlert("Gallery item deleted!");
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to delete item", true);
    }
  };

  // TESTIMONIAL ACTIONS
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addTestimonial(testimonialForm);
      triggerAlert("Testimonial added successfully!");
      setShowTestimonialModal(false);
      setTestimonialForm({ name: "", role: "", text: "", rating: 5 });
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to add testimonial", true);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.deleteTestimonial(id);
      triggerAlert("Testimonial deleted!");
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to delete testimonial", true);
    }
  };

  // STATS ACTIONS
  const handleStatUpdate = async (id: string, number: number, suffix: string, label: string) => {
    try {
      await api.updateStat(id, { number, suffix, label });
      triggerAlert("Metric updated successfully!");
      setRefreshTrigger(p => p + 1);
    } catch (err: any) {
      triggerAlert(err.message || "Failed to update stat", true);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-amber-500">
        <div className="text-center space-y-4">
          <Hotel className="h-12 w-12 mx-auto animate-spin" />
          <p className="text-sm uppercase tracking-widest">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-white/5 flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <Hotel className="h-6 w-6 text-amber-500" />
          <div>
            <h1 className="font-display font-semibold tracking-wide text-lg gold-text">GRAND HOTEL</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-light">Admin Panel</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-6 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-500">
            <User className="h-4 w-4" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{user?.role} Portal</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink active={activeTab === "overview"} onClick={() => setActiveTab("overview")} icon={<BarChart3 />} label="Overview" />
          <SidebarLink active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} icon={<CalendarCheck />} label="Bookings" badge={bookings.filter(b => b.status === "pending").length || undefined} />
          <SidebarLink active={activeTab === "rooms"} onClick={() => setActiveTab("rooms")} icon={<BedDouble />} label="Rooms" />
          <SidebarLink active={activeTab === "gallery"} onClick={() => setActiveTab("gallery")} icon={<Image />} label="Gallery" />
          <SidebarLink active={activeTab === "testimonials"} onClick={() => setActiveTab("testimonials")} icon={<MessageSquare />} label="Testimonials" />
          <SidebarLink active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<Star />} label="Hotel Stats" />
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition duration-200 text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        {/* Floating alerts */}
        {successMsg && (
          <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-green-500/15 border border-green-500/20 text-green-400 text-sm shadow-xl flex items-center gap-3 animate-bounce">
            <CheckCircle className="h-5 w-5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="fixed top-6 right-6 z-50 p-4 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm shadow-xl flex items-center gap-3 animate-bounce">
            <XCircle className="h-5 w-5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab contents */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-semibold gold-text">Overview</h2>
              <p className="text-slate-400 text-sm mt-1">Live metrics and pending actions for Grand Hotel</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard title="Rooms Available" value={`${rooms.filter(r => r.available).length} / ${rooms.length}`} icon={<BedDouble className="text-amber-500" />} />
              <MetricCard title="Pending Bookings" value={bookings.filter(b => b.status === "pending").length} icon={<CalendarCheck className="text-amber-500" />} />
              <MetricCard title="Gallery Items" value={gallery.length} icon={<Image className="text-amber-500" />} />
              <MetricCard title="Testimonials" value={testimonials.length} icon={<MessageSquare className="text-amber-500" />} />
            </div>

            {/* Pending actions */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-amber-500" />
                Recent Booking Requests
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-3 px-4">Guest</th>
                      <th className="py-3 px-4">Room</th>
                      <th className="py-3 px-4">Check In/Out</th>
                      <th className="py-3 px-4">Total Price</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b._id} className="border-b border-white/5 hover:bg-white/5 transition duration-150">
                        <td className="py-4 px-4 font-medium">
                          <div>{b.user?.name || "Guest"}</div>
                          <div className="text-xs text-slate-400 font-light">{b.user?.email}</div>
                        </td>
                        <td className="py-4 px-4">{b.room?.name || "Deleted Room"}</td>
                        <td className="py-4 px-4">
                          <span className="text-slate-200">{new Date(b.checkIn).toLocaleDateString()}</span>
                          <span className="text-slate-400 font-light mx-1">to</span>
                          <span className="text-slate-200">{new Date(b.checkOut).toLocaleDateString()}</span>
                        </td>
                        <td className="py-4 px-4 text-amber-500 font-medium">${b.totalPrice}</td>
                        <td className="py-4 px-4 text-right">
                          {b.status === "pending" ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleBookingAction(b._id, "approved")} className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleBookingAction(b._id, "cancelled")} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              b.status === "approved" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            }`}>
                              {b.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 font-light">No bookings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-semibold gold-text">Bookings Management</h2>
                <p className="text-slate-400 text-sm mt-1">Manage guest reservations, checkout totals, and statuses</p>
              </div>
            </div>

            <div className="glass rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-900 border-b border-white/5 text-slate-400 uppercase text-xs tracking-wider">
                      <th className="py-4 px-6">Guest Info</th>
                      <th className="py-4 px-6">Room / Suite</th>
                      <th className="py-4 px-6">Dates</th>
                      <th className="py-4 px-6 text-center">People & Rooms</th>
                      <th className="py-4 px-6">Total Amount</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id} className="border-b border-white/5 hover:bg-white/5 transition duration-150">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-200">{b.user?.name}</div>
                          <div className="text-xs text-slate-400">{b.user?.email}</div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-300">{b.room?.name || "Unknown Room"}</td>
                        <td className="py-4 px-6 text-slate-300">
                          <div>{new Date(b.checkIn).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-400">to {new Date(b.checkOut).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div>{b.guests} Guests</div>
                          <div className="text-xs text-slate-400">{b.roomsCount || 1} Room(s)</div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-amber-500">${b.totalPrice}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            b.status === "approved" ? "bg-green-500/10 text-green-400" :
                            b.status === "cancelled" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {b.status === "pending" && (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleBookingAction(b._id, "approved")} className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold text-xs transition">
                                Approve
                              </button>
                              <button onClick={() => handleBookingAction(b._id, "cancelled")} className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs transition">
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 font-light">No bookings recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ROOMS CRUD TAB */}
        {activeTab === "rooms" && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-semibold gold-text">Rooms & Suites</h2>
                <p className="text-slate-400 text-sm mt-1">Configure pricing, details, and availability of hotel assets</p>
              </div>
              <button
                onClick={() => {
                  setRoomForm({ id: "", name: "", price: 0, image: "", rating: 5, amenities: "", desc: "", available: true });
                  setShowRoomModal(true);
                }}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition shadow-lg transform active:scale-95"
              >
                <Plus className="h-5 w-5" />
                Add Suite
              </button>
            </div>

            {/* Rooms list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div key={room._id} className="glass rounded-2xl overflow-hidden border border-white/5 flex flex-col hover:border-amber-500/30 transition duration-300">
                  <div className="h-48 overflow-hidden relative">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-xs font-semibold flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      {room.rating}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-display font-semibold text-slate-200">{room.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          room.available ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          {room.available ? "Active" : "Booked/Disabled"}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-3 mb-4 font-light leading-relaxed">{room.desc}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {room.amenities.map((a: string) => (
                          <span key={a} className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="text-xl font-semibold text-amber-500">
                        ${room.price} <span className="text-xs text-slate-400 font-light">/ night</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/10 hover:text-amber-500 text-slate-300 border border-white/5 transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-slate-300 border border-white/5 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ROOM CREATE/EDIT MODAL */}
            {showRoomModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl w-full max-w-xl p-8 border border-white/15 max-h-[90vh] overflow-y-auto glow-gold">
                  <h3 className="text-2xl font-display font-semibold mb-6 gold-text">
                    {roomForm.id ? "Edit Suite Details" : "Create New Suite"}
                  </h3>
                  <form onSubmit={handleRoomSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 uppercase">Suite Name</label>
                        <input
                          type="text"
                          required
                          value={roomForm.name}
                          onChange={(e) => setRoomForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 uppercase">Price per Night ($)</label>
                        <input
                          type="number"
                          required
                          value={roomForm.price}
                          onChange={(e) => setRoomForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 uppercase">Rating (1-5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={roomForm.rating}
                          onChange={(e) => setRoomForm(p => ({ ...p, rating: parseFloat(e.target.value) || 5.0 }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 uppercase">Status</label>
                        <select
                          value={roomForm.available ? "true" : "false"}
                          onChange={(e) => setRoomForm(p => ({ ...p, available: e.target.value === "true" }))}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        >
                          <option value="true">Available</option>
                          <option value="false">Unavailable</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Image URL (Unsplash or base64)</label>
                      <input
                        type="text"
                        required
                        value={roomForm.image}
                        onChange={(e) => setRoomForm(p => ({ ...p, image: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Amenities (Comma separated)</label>
                      <input
                        type="text"
                        placeholder="WiFi, Mini Bar, Butler service"
                        value={roomForm.amenities}
                        onChange={(e) => setRoomForm(p => ({ ...p, amenities: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={roomForm.desc}
                        onChange={(e) => setRoomForm(p => ({ ...p, desc: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setShowRoomModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition"
                      >
                        Save Room
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-semibold gold-text">Gallery Portfolio</h2>
                <p className="text-slate-400 text-sm mt-1">Manage luxury imagery of hotel lobby, pools, suites, and spas</p>
              </div>
              <button
                onClick={() => {
                  setGalleryForm({ src: "", alt: "", span: "" });
                  setShowGalleryModal(true);
                }}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Add Image
              </button>
            </div>

            {/* Gallery Grid preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item._id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/5">
                  <img src={item.src} alt={item.alt} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-between p-4">
                    <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">{item.alt}</span>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-400 font-light">{item.span || "normal size"}</span>
                      <button
                        onClick={() => handleDeleteGallery(item._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* GALLERY NEW IMAGE MODAL */}
            {showGalleryModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl w-full max-w-md p-8 border border-white/15 glow-gold">
                  <h3 className="text-2xl font-display font-semibold mb-6 gold-text">Add Gallery Photo</h3>
                  <form onSubmit={handleGallerySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Image URL</label>
                      <input
                        type="text"
                        required
                        value={galleryForm.src}
                        onChange={(e) => setGalleryForm(p => ({ ...p, src: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Alt text / Description</label>
                      <input
                        type="text"
                        required
                        value={galleryForm.alt}
                        onChange={(e) => setGalleryForm(p => ({ ...p, alt: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="e.g. Fine dining lounge"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Grid Layout Span (CSS Class)</label>
                      <select
                        value={galleryForm.span}
                        onChange={(e) => setGalleryForm(p => ({ ...p, span: e.target.value }))}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                      >
                        <option value="">Normal span</option>
                        <option value="col-span-2">Wide span (col-span-2)</option>
                        <option value="row-span-2">Tall span (row-span-2)</option>
                      </select>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setShowGalleryModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition"
                      >
                        Add Photo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === "testimonials" && (
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-display font-semibold gold-text">Guest Testimonials</h2>
                <p className="text-slate-400 text-sm mt-1">Manage public client comments and travel reviews</p>
              </div>
              <button
                onClick={() => {
                  setTestimonialForm({ name: "", role: "", text: "", rating: 5 });
                  setShowTestimonialModal(true);
                }}
                className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Add Review
              </button>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <div key={t._id} className="glass rounded-2xl p-6 border border-white/5 relative group hover:border-amber-500/30 transition duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-200 text-base">{t.name}</h4>
                      <p className="text-xs text-slate-400 font-light">{t.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm italic font-light leading-relaxed">"{t.text}"</p>
                  
                  <button
                    onClick={() => handleDeleteTestimonial(t._id)}
                    className="absolute bottom-6 right-6 p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* TESTIMONIAL MODAL */}
            {showTestimonialModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass-strong rounded-3xl w-full max-w-md p-8 border border-white/15 glow-gold">
                  <h3 className="text-2xl font-display font-semibold mb-6 gold-text">Add Testimonial</h3>
                  <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 uppercase">Guest Name</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.name}
                          onChange={(e) => setTestimonialForm(p => ({ ...p, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-300 uppercase">Role / Company</label>
                        <input
                          type="text"
                          required
                          value={testimonialForm.role}
                          onChange={(e) => setTestimonialForm(p => ({ ...p, role: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                          placeholder="e.g. Travel Editor"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        required
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-300 uppercase">Review Comment</label>
                      <textarea
                        required
                        rows={4}
                        value={testimonialForm.text}
                        onChange={(e) => setTestimonialForm(p => ({ ...p, text: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
                        placeholder="Write guest remarks here..."
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setShowTestimonialModal(false)}
                        className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HOTEL STATS TAB */}
        {activeTab === "stats" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-semibold gold-text">Hotel Statistics</h2>
              <p className="text-slate-400 text-sm mt-1">Adjust metrics displayed on the landing page of the Grand Hotel</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((item) => (
                <StatEditorCard key={item._id} item={item} onSave={handleStatUpdate} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Sub-components
const SidebarLink: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition duration-200 ${
      active
        ? "bg-amber-500 text-slate-950 font-semibold shadow-lg shadow-amber-500/10"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="h-5 w-5 shrink-0">{icon}</span>
      <span>{label}</span>
    </div>
    {badge !== undefined && (
      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${active ? "bg-slate-950 text-amber-500" : "bg-amber-500/10 text-amber-500"}`}>
        {badge}
      </span>
    )}
  </button>
);

const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="glass rounded-2xl p-6 border border-white/5 flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-slate-400 font-light">{title}</p>
      <p className="text-3xl font-display font-bold text-slate-100">{value}</p>
    </div>
    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
      {icon}
    </div>
  </div>
);

interface StatEditorCardProps {
  item: any;
  onSave: (id: string, number: number, suffix: string, label: string) => Promise<void>;
}

const StatEditorCard: React.FC<StatEditorCardProps> = ({ item, onSave }) => {
  const [number, setNumber] = useState(item.number);
  const [suffix, setSuffix] = useState(item.suffix);
  const [label, setLabel] = useState(item.label);
  const [saving, setSaving] = useState(false);

  const handleUpdate = async () => {
    setSaving(true);
    await onSave(item._id, number, suffix, label);
    setSaving(false);
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-white/5">
        <h4 className="font-semibold text-slate-300 font-display text-base">Metric Element</h4>
        <span className="text-3xl font-bold font-display text-amber-500">
          {number}{suffix}
        </span>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase">Value / Number</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase">Suffix (e.g. +)</label>
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase">Display Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-200"
          />
        </div>
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="w-full py-2.5 bg-white/5 hover:bg-amber-500 hover:text-slate-950 font-semibold border border-white/10 hover:border-transparent rounded-xl text-xs transition uppercase tracking-wider"
        >
          {saving ? "Saving..." : "Save Metric Changes"}
        </button>
      </div>
    </div>
  );
};
