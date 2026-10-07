import crypto from "crypto";
import { z } from "zod";
import Complaint from "../models/Complaint.js";
import Department from "../models/Department.js";
import StatusHistory from "../models/StatusHistory.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const categories = ["road", "water", "electricity", "sanitation", "health", "corruption", "other"];
const statuses = ["submitted", "assigned", "in_progress", "resolved", "rejected", "escalated"];
const createSchema = z.object({
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(10).max(5000),
  category: z.enum(categories).default("other"),
  urgency: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  location: z.object({
    coordinates: z.array(z.number()).length(2),
    address: z.string().trim().max(300).optional(),
  }),
  attachments: z.array(z.string().url()).max(5).default([]),
});
const statusSchema = z.object({
  status: z.enum(statuses),
  remark: z.string().trim().max(500).optional(),
});

const ticketId = () => `GNS-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
const isStaff = (user) => ["officer", "admin"].includes(user.role);

const canAccess = (complaint, user) =>
  isStaff(user) || complaint.citizen._id?.toString() === user._id.toString() ||
  complaint.citizen.toString() === user._id.toString();

export const listComplaints = asyncHandler(async (req, res) => {
  const filter = isStaff(req.user) ? {} : { citizen: req.user._id };
  if (req.query.status && statuses.includes(req.query.status)) filter.status = req.query.status;
  const complaints = await Complaint.find(filter)
    .sort({ createdAt: -1 })
    .populate("department", "name")
    .populate("assignedTo", "name");
  res.json({ complaints });
});

export const getComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("citizen", "name email")
    .populate("department", "name")
    .populate("assignedTo", "name email");
  if (!complaint) throw new ApiError(404, "Complaint not found");
  if (!canAccess(complaint, req.user)) throw new ApiError(403, "You cannot view this complaint");
  const history = await StatusHistory.find({ complaint: complaint._id })
    .sort({ createdAt: -1 })
    .populate("changedBy", "name role");
  res.json({ complaint, history });
});

export const createComplaint = asyncHandler(async (req, res) => {
  const data = createSchema.parse(req.body);
  const department = await Department.findOne({ categories: data.category });
  const complaint = await Complaint.create({
    ...data,
    ticketId: ticketId(),
    citizen: req.user._id,
    department: department?._id,
    dueAt: department ? new Date(Date.now() + department.slaHours * 60 * 60 * 1000) : undefined,
  });
  await StatusHistory.create({ complaint: complaint._id, to: complaint.status, changedBy: req.user._id });
  res.status(201).json({ complaint });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, remark } = statusSchema.parse(req.body);
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, "Complaint not found");
  const from = complaint.status;
  complaint.status = status;
  if (status === "assigned" && !complaint.assignedTo) complaint.assignedTo = req.user._id;
  await complaint.save();
  await StatusHistory.create({ complaint: complaint._id, from, to: status, changedBy: req.user._id, remark });
  res.json({ complaint });
});
