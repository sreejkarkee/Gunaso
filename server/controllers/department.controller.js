import { z } from "zod";
import Department from "../models/Department.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  categories: z.array(z.string().trim()).min(1),
  slaHours: z.number().int().positive().max(8760).default(72),
});

export const listDepartments = asyncHandler(async (req, res) => {
  res.json({ departments: await Department.find().sort({ name: 1 }) });
});

export const createDepartment = asyncHandler(async (req, res) => {
  res.status(201).json({ department: await Department.create(schema.parse(req.body)) });
});
