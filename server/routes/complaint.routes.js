import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { restrictTo } from "../middleware/role.js";
import { complaintImages } from "../middleware/uploads.js";
import { addOfficialResponse, createComplaint, getComplaint, listComplaints, updateStatus } from "../controllers/complaint.controller.js";

const router = Router();
router.use(protect);
router.route("/").get(listComplaints).post(complaintImages, createComplaint);
router.get("/:id", getComplaint);
router.patch("/:id/status", restrictTo("officer", "admin"), updateStatus);
router.patch("/:id/response", restrictTo("officer", "admin"), addOfficialResponse);
export default router;
