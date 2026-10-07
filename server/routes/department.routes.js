import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { restrictTo } from "../middleware/role.js";
import { createDepartment, listDepartments } from "../controllers/department.controller.js";

const router = Router();
router.get("/", listDepartments);
router.post("/", protect, restrictTo("admin"), createDepartment);
export default router;
