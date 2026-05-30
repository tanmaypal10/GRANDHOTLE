import mongoose, { Schema, Document } from "mongoose";

export interface IGalleryItem extends Document {
  src: string;
  alt: string;
  span: string; // row-span-2, col-span-2, etc.
  createdAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
    span: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);
