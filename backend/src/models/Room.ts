import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  price: number;
  image: string;
  rating: number;
  amenities: string[];
  desc: string;
  available: boolean;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    amenities: [{ type: String }],
    desc: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
