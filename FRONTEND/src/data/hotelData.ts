import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomPremium from "@/assets/room-premium.jpg";
import roomFamily from "@/assets/room-family.jpg";
import roomPresidential from "@/assets/room-presidential.jpg";
import galleryPool from "@/assets/gallery-pool.jpg";
import galleryRestaurant from "@/assets/gallery-restaurant.jpg";
import gallerySpa from "@/assets/gallery-spa.jpg";
import hero from "@/assets/hotel-hero.jpg";

export const rooms = [
  { id: 1, name: "Deluxe Room", price: 280, image: roomDeluxe, rating: 4.8, amenities: ["King Bed", "City View", "WiFi", "Mini Bar"], desc: "Spacious comfort with a view of the city skyline." },
  { id: 2, name: "Premium Suite", price: 520, image: roomPremium, rating: 4.9, amenities: ["Ocean View", "Lounge", "Jacuzzi", "Butler"], desc: "Sea-facing elegance with private lounge access." },
  { id: 3, name: "Family Room", price: 380, image: roomFamily, rating: 4.7, amenities: ["Two Beds", "Kids Area", "WiFi", "Breakfast"], desc: "Generous space designed for family stays." },
  { id: 4, name: "Presidential Suite", price: 1450, image: roomPresidential, rating: 5.0, amenities: ["Skyline", "Grand Piano", "Private Chef", "Spa"], desc: "Our crown jewel — unmatched opulence and service." },
];

export const galleryImages = [
  { src: galleryPool, alt: "Infinity pool", span: "row-span-2" },
  { src: galleryRestaurant, alt: "Fine dining", span: "" },
  { src: gallerySpa, alt: "Spa", span: "" },
  { src: roomDeluxe, alt: "Deluxe room", span: "" },
  { src: roomPresidential, alt: "Presidential view", span: "row-span-2" },
  { src: roomPremium, alt: "Premium suite", span: "" },
  { src: hero, alt: "Lobby", span: "col-span-2" },
];

export const testimonials = [
  { name: "Sophia Laurent", role: "Travel Editor, Vogue", text: "An impeccable blend of timeless elegance and modern comfort. The Presidential Suite is a destination in itself.", rating: 5 },
  { name: "James Whitmore", role: "CEO, Whitmore Holdings", text: "The most attentive service I've experienced anywhere in the world. From check-in to check-out, flawless.", rating: 5 },
  { name: "Aiko Tanaka", role: "Architect", text: "Stunning architecture, masterful lighting and a spa experience that redefined the word luxury for me.", rating: 5 },
  { name: "Rafael Mendes", role: "Wine Critic", text: "The dining program alone is worth the trip. Every detail considered, every plate exquisite.", rating: 5 },
];

export const stats = [
  { number: 25000, suffix: "+", label: "Happy Guests" },
  { number: 320, suffix: "", label: "Luxury Rooms" },
  { number: 480, suffix: "", label: "Staff Members" },
  { number: 35, suffix: "", label: "Years of Excellence" },
];
