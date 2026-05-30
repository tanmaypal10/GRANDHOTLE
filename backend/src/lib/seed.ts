import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";
import Room from "../models/Room";
import Testimonial from "../models/Testimonial";
import GalleryItem from "../models/GalleryItem";
import Stat from "../models/Stat";
import Booking from "../models/Booking";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/grandhotel";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected. Clearing old data...");

    // Clear existing data
    await User.deleteMany({});
    await Room.deleteMany({});
    await Testimonial.deleteMany({});
    await GalleryItem.deleteMany({});
    await Stat.deleteMany({});
    await Booking.deleteMany({});

    console.log("Creating default Admin user...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("admin123", salt);
    
    const adminUser = new User({
      email: "admin@grandhotel.com",
      passwordHash,
      name: "Hotel Admin",
      role: "admin",
    });
    await adminUser.save();
    console.log("Admin user created (admin@grandhotel.com / admin123)");

    console.log("Creating rooms...");
    const rooms = [
      {
        name: "Deluxe Room",
        price: 280,
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        amenities: ["King Bed", "City View", "WiFi", "Mini Bar"],
        desc: "Spacious comfort with a view of the city skyline.",
        available: true,
      },
      {
        name: "Premium Suite",
        price: 520,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        amenities: ["Ocean View", "Lounge", "Jacuzzi", "Butler"],
        desc: "Sea-facing elegance with private lounge access.",
        available: true,
      },
      {
        name: "Family Room",
        price: 380,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        amenities: ["Two Beds", "Kids Area", "WiFi", "Breakfast"],
        desc: "Generous space designed for family stays.",
        available: true,
      },
      {
        name: "Presidential Suite",
        price: 1450,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        amenities: ["Skyline", "Grand Piano", "Private Chef", "Spa"],
        desc: "Our crown jewel — unmatched opulence and service.",
        available: true,
      },
    ];
    await Room.insertMany(rooms);
    console.log("Rooms seeded.");

    console.log("Creating testimonials...");
    const testimonials = [
      {
        name: "Sophia Laurent",
        role: "Travel Editor, Vogue",
        text: "An impeccable blend of timeless elegance and modern comfort. The Presidential Suite is a destination in itself.",
        rating: 5,
      },
      {
        name: "James Whitmore",
        role: "CEO, Whitmore Holdings",
        text: "The most attentive service I've experienced anywhere in the world. From check-in to check-out, flawless.",
        rating: 5,
      },
      {
        name: "Aiko Tanaka",
        role: "Architect",
        text: "Stunning architecture, masterful lighting and a spa experience that redefined the word luxury for me.",
        rating: 5,
      },
      {
        name: "Rafael Mendes",
        role: "Wine Critic",
        text: "The dining program alone is worth the trip. Every detail considered, every plate exquisite.",
        rating: 5,
      },
    ];
    await Testimonial.insertMany(testimonials);
    console.log("Testimonials seeded.");

    console.log("Creating gallery items...");
    const galleryItems = [
      {
        src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
        alt: "Infinity pool",
        span: "row-span-2",
      },
      {
        src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
        alt: "Fine dining",
        span: "",
      },
      {
        src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        alt: "Spa",
        span: "",
      },
      {
        src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        alt: "Deluxe room view",
        span: "",
      },
      {
        src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        alt: "Presidential suite view",
        span: "row-span-2",
      },
      {
        src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        alt: "Premium suite layout",
        span: "",
      },
      {
        src: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
        alt: "Hotel Lobby",
        span: "col-span-2",
      },
    ];
    await GalleryItem.insertMany(galleryItems);
    console.log("Gallery items seeded.");

    console.log("Creating homepage statistics...");
    const stats = [
      { label: "Happy Guests", number: 25000, suffix: "+" },
      { label: "Luxury Rooms", number: 320, suffix: "" },
      { label: "Staff Members", number: 480, suffix: "" },
      { label: "Years of Excellence", number: 35, suffix: "" },
    ];
    await Stat.insertMany(stats);
    console.log("Statistics seeded.");

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
