import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    categories: [String],
    slaHours: { type: Number, default: 72 },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);