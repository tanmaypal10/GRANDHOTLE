import mongoose, { Schema, Document } from "mongoose";

export interface IStat extends Document {
  label: string;
  number: number;
  suffix: string;
  createdAt: Date;
}

const StatSchema = new Schema<IStat>(
  {
    label: { type: String, required: true },
    number: { type: Number, required: true },
    suffix: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IStat>("Stat", StatSchema);
