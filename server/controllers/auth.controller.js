import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Complaint from "../models/Complaint.js";
import StatusHistory from "../models/StatusHistory.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await User.create(data); // role is never taken from the request
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("name email role department createdAt").sort({ createdAt: -1 });
  res.json({ users });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot delete your own admin account");
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  const complaints = await Complaint.find({ citizen: user._id }).select("_id");
  const complaintIds = complaints.map((complaint) => complaint._id);
  await Promise.all([
    Complaint.deleteMany({ citizen: user._id }),
    StatusHistory.deleteMany({ complaint: { $in: complaintIds } }),
    User.deleteOne({ _id: user._id }),
  ]);
  res.json({ message: "User and their complaints deleted" });
});