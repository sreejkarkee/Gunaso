import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["road", "water", "electricity", "sanitation", "health", "corruption", "other"],
      default: "other",
    },
    urgency: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    status: {
      type: String,
      enum: ["submitted", "received", "assigned", "in_progress", "resolved", "rejected", "escalated"],
      default: "submitted",
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
      address: String,
    },
    attachments: {
      type: [String],
      default: [],
    },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    officialResponse: {
      message: { type: String, trim: true, maxlength: 2000 },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      respondedAt: Date,
    },
    aiMeta: {
      summary: String,
      confidence: Number,
      suggestedDepartment: String,
    },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
    dueAt: Date,
  },
  { timestamps: true }
);

complaintSchema.index({ location: "2dsphere" });

export default mongoose.model("Complaint", complaintSchema);