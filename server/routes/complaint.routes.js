import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { restrictTo } from "../middleware/role.js";
import { createComplaint, getComplaint, listComplaints, updateStatus } from "../controllers/complaint.controller.js";

const router = Router();
router.use(protect);
router.route("/").get(listComplaints).post(createComplaint);
router.get("/:id", getComplaint);
router.patch("/:id/status", restrictTo("officer", "admin"), updateStatus);
export default router;
