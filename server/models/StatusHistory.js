import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema(
  {
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true, index: true },
    from: String,
    to: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    remark: String,
  },
  { timestamps: true }
);

export default mongoose.model("StatusHistory", statusHistorySchema);