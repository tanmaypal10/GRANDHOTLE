import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  text: string;
  rating: number;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
